import pyodbc
conexion = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=ACER\\SQLEXPRESS03;'
    'DATABASE=GestionTareas;'
    'Trusted_Connection=yes;'
)
print("Conexión exitosa a la base de datos")
cursor = conexion.cursor()

cursor.execute("SELECT * FROM Tareas")
tareas = cursor.fetchall()

for tarea in tareas:
    print(tarea)