
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [tareas, setTareas] = useState<any[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [estado, setEstado] = useState('Pendiente')


  // GUARDAR TAREA
 const guardarTarea = () => {

  const metodo = idEditando === null ? 'POST' : 'PUT'

  const url = idEditando === null
    ? 'http://127.0.0.1:5000/tareas'
    : `http://127.0.0.1:5000/tareas/${idEditando}`

  fetch(url, {

    method: metodo,

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      titulo: titulo,
      descripcion: descripcion,
      estado: estado
    })

  })
    .then(respuesta => {

      if (!respuesta.ok) {
        throw new Error('Error al guardar la tarea')
      }

      return respuesta.json()
    })

    .then(() => {

      return fetch('http://127.0.0.1:5000/tareas')
    })

    .then(respuesta => respuesta.json())

    .then(datos => {

      setTareas(datos.tareas)

      setTitulo('')
      setDescripcion('')
      setEstado('Pendiente')
      setIdEditando(null)
      setMostrarFormulario(false)

    })

    .catch(error => {
      console.error('Error:', error)
    })
}

  //eliminar tareas
  const eliminarTarea = (id: number) => {

  fetch(`http://127.0.0.1:5000/tareas/${id}`, {
    method: 'DELETE'
  })
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error('Error al eliminar la tarea')
      }

      return respuesta.json()
    })
    .then(() => {

      // Volvemos a consultar las tareas
      return fetch('http://127.0.0.1:5000/tareas')
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
      setTareas(datos.tareas)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}

//otro de eliminar 
const editarTarea = (tarea: any) => {

  setIdEditando(tarea.id)
  setTitulo(tarea.titulo)
  setDescripcion(tarea.descripcion)
  setEstado(tarea.estado)
  setMostrarFormulario(true)
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

          <label>
  Estado
</label>

<select
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
>
  <option value="Pendiente">Pendiente</option>
  <option value="En proceso">En proceso</option>
  <option value="Completada">Completada</option>
</select>


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

  <button
    onClick={() => editarTarea(tarea)}
  >
    Editar
  </button>

  <button
    onClick={() => eliminarTarea(tarea.id)}
  >
    Eliminar
  </button>

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

