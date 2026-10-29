
import { useEffect, useState } from 'react'
import './App.css'
import hero from "./assets/hero.png";

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

//NEW CODIGO
  return (
    <div className="app">

      {
      <section className="hero-inicio">
        <div className="hero-contenido">
          <span className="hero-etiqueta">
            <span className="punto-verde"></span>
            TU ESPACIO DE PRODUCTIVIDAD
          </span>

          <h1>
            Tus tareas.
            <br />
            <span>Tu progreso.</span>
          </h1>

          <p>
            Organiza tus ideas, administra tus pendientes
            y convierte tus objetivos en logros.
          </p>

          <button
            className="hero-boton"
            onClick={() =>
              document
                .getElementById("mis-tareas")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explorar mis tareas →
          </button>

          <div className="hero-detalle">
            <span>✓</span> Organiza · Planifica · Avanza
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-resplandor"></div>
          <div className="orbita orbita-1"></div>
          <div className="orbita orbita-2"></div>

          <div className="tarjeta-flotante tarjeta-principal">
            <div className="tarjeta-cabecera">
              <div>
                <span className="texto-pequeno">MI ESPACIO</span>
                <h3>Resumen diario</h3>
              </div>
              <span className="icono-calendario">▦</span>
            </div>

            <div className="progreso-circulo">
              <div className="progreso-centro">
                <strong>75%</strong>
                <span>completado</span>
              </div>
            </div>

            <div className="barra-progreso">
              <div></div>
            </div>

            <p className="texto-progreso">¡Vas por buen camino!</p>

            <div className="mini-tarea">
              <span className="check-tarea">✓</span>
              <span>Organizar pendientes</span>
              <span className="estado-listo">Listo</span>
            </div>

            <div className="mini-tarea">
              <span className="check-vacio"></span>
              <span>Completar proyecto</span>
              <span className="estado-pendiente">En curso</span>
            </div>

            <div className="mini-tarea">
              <span className="check-vacio"></span>
              <span>Planificar mañana</span>
              <span className="estado-pendiente">Pendiente</span>
            </div>
          </div>

          <div className="tarjeta-flotante tarjeta-notificacion">
            <span className="notificacion-icono">✓</span>
            <div>
              <strong>¡Buen trabajo!</strong>
              <p>Un paso más hacia tu meta</p>
            </div>
          </div>

          <div className="tarjeta-flotante tarjeta-fecha">
            <span className="fecha-icono">▦</span>
            <div>
              <strong>Nuevo día</strong>
              <p>Nuevas oportunidades</p>
            </div>
          </div>

          <div className="estrella estrella-1">*</div>
          <div className="estrella estrella-2">*</div>
          <div className="estrella estrella-3">*</div>
        </div>
      </section>
  }

  

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

      <section className="seccion-tareas" id="mis-tareas">

        <div className="titulo-tareas">

         <h2 id="mis-tareas">Mis tareas</h2>

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
