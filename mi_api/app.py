from flask import Flask, request
from flask_cors import CORS
import pyodbc

app = Flask(__name__)

CORS(app)


def conectar_base_datos():
    conexion = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=ACER\\SQLEXPRESS03;'
        'DATABASE=GestionTareas;'
        'Trusted_Connection=yes;'
    )

    return conexion


@app.route('/tareas', methods=['GET', 'POST'])
def tareas():

    # CREAR TAREA
    if request.method == 'POST':

        data = request.get_json()

        titulo = data.get('titulo')
        descripcion = data.get('descripcion')

        # Valores automáticos
        estado = 'Pendiente'
        usuario_id = 1

        conexion = conectar_base_datos()
        cursor = conexion.cursor()

        cursor.execute("""
            INSERT INTO Tareas
            (titulo, descripcion, estado, usuario_id)
            VALUES (?, ?, ?, ?)
        """, (
            titulo,
            descripcion,
            estado,
            usuario_id
        ))

        conexion.commit()

        conexion.close()


    # OBTENER TODAS LAS TAREAS
    conexion = conectar_base_datos()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, titulo, descripcion, estado, usuario_id
        FROM Tareas
    """)

    resultado = cursor.fetchall()

    conexion.close()


    return {
        'tareas': [
            {
                'id': tarea[0],
                'titulo': tarea[1],
                'descripcion': tarea[2],
                'estado': tarea[3],
                'usuario_id': tarea[4]
            }
            for tarea in resultado
        ]
    }


app.run(debug=True)




#npm create vite@latest frontend -- --template react-ts
#npm install react react-dom
#npm list @types/react @types/react-dom
#npm install -D @types/react @types/react-dom
#npm list @types/react @types/react-dom
#npm install -D @vitejs/plugin-react
#dir dir scs
#Intalsmos pip install flask
#nos permite crear el servidor y juetsra api rest en pyhon
#from flask import Flask, request

#app = Flask(__name__)
#tareas_guardadas = ['Aprender Flask', 'Crear una API']

#@app.route('/', methods=['GET', 'POST'])
#def inicio():
   # if request.method == 'POST':
    #    nueva_tarea = request.form.get('tarea', '').strip()
      #  if nueva_tarea:
     #       tareas_guardadas.append(nueva_tarea)

    #lista_tareas = ''.join(f'<li>{tarea}</li>' for tarea in tareas_guardadas)
   # return f'''
    #    <h1>Creacion APIS REST</h1>
     #   <h2>Lista de tareas</h2>
       # <form method="post">
           # <input type="text" name="tarea" placeholder="Escribe una tarea">
        #    <button type="submit">Agregar</button>
      #  </form>
       # <ul>
       #     {lista_tareas}
       # </ul>
   # '''



#@app.route('/tareas')
#def tareas():
   # return {'tareas': tareas_guardadas}

#app.run(debug=True)

#despues en igual en terminal ejuctamos el comando: python app.pyp
#primero cd mas la carepta luego ingrepamos python app.py 
#intsalmos  pip install pyodbc