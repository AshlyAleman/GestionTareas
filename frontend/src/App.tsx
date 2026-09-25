
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [tareas, setTareas] = useState<any[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')


  // GUARDAR TAREA
  const guardarTarea = () => {

    fetch('http://127.0.0.1:5000/tareas', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        titulo: titulo,
        descripcion: descripcion
      })
    })

      .then(respuesta => {

        if (!respuesta.ok) {
          throw new Error('Error al guardar la tarea')
        }

        return respuesta.json()
      })

      .then(() => {

        // Volvemos a consultar las tareas reales
        return fetch('http://127.0.0.1:5000/tareas')

      })

      .then(respuesta => respuesta.json())

      .then(datos => {

        setTareas(datos.tareas)

        setTitulo('')
        setDescripcion('')
        setMostrarFormulario(false)

      })

      .catch(error => {

        console.error('Error:', error)

      })
  }


  // OBTENER TAREAS
  useEffect(() => {

    fetch('http://127.0.0.1:5000/tareas')

      .then(respuesta => respuesta.json())

      .then(datos => {

        setTareas(datos.tareas)

      })

      .catch(error => {

        console.error('Error:', error)

      })

  }, [])


  return (
    <div className="app">

      <header className="encabezado">

        <div>
          <h1>Gestión de Tareas</h1>
          <p>Organiza y controla tus tareas</p>
        </div>

        <button
          className="boton-crear"
          onClick={() => setMostrarFormulario(true)}
        >
          + Crear tarea
        </button>

      </header>


      {/* FORMULARIO */}

      {mostrarFormulario && (

        <div className="formulario">

          <h2>Nueva tarea</h2>

          <label>
            Título
          </label>

          <input
            type="text"
            placeholder="Ej: Crear API REST"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />


          <label>
            Descripción
          </label>

          <textarea
            placeholder="Describe la tarea..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />


          <div className="botones-formulario">

            <button
              className="boton-cancelar"
              onClick={() => {
                setTitulo('')
                setDescripcion('')
                setMostrarFormulario(false)
              }}
            >
              Cancelar
            </button>

            <button
              className="boton-guardar"
              onClick={guardarTarea}
            >
              Guardar
            </button>

          </div>

        </div>

      )}


      {/* TAREAS */}

      <section className="seccion-tareas">

        <div className="titulo-tareas">

          <h2>Mis tareas</h2>

          <span>
            {tareas.length} tareas
          </span>

        </div>


        <div className="contenedor-tareas">

          {tareas.map(tarea => (

            <div
              className="tarjeta"
              key={tarea.id}
            >

              <div className="tarjeta-arriba">

                <span className={`estado ${tarea.estado?.toLowerCase().replace(' ', '-')}`}>

                  {tarea.estado}

                </span>

                <span className="id-tarea">
                  #{tarea.id}
                </span>

              </div>


              <h3>
                {tarea.titulo}
              </h3>


              <p className="descripcion">
                {tarea.descripcion}
              </p>


              <div className="tarjeta-abajo">

                <span>
                  Usuario: {tarea.usuario_id}
                </span>

              </div>

            </div>

          ))}


          {tareas.length === 0 && (

            <div className="sin-tareas">

              <h3>No hay tareas todavía</h3>

              <p>
                Crea tu primera tarea para comenzar.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default App

