from app import app


def test_obtener_tareas():
    cliente = app.test_client()

    respuesta = cliente.get('/tareas')

    assert respuesta.status_code == 200
    assert isinstance(respuesta.json["tareas"], list)


def test_crear_tarea():
    cliente = app.test_client()

    nueva_tarea = {
        "titulo": "Tarea de prueba pytest",
        "descripcion": "Probando POST con pytest"
    }

    respuesta = cliente.post('/tareas', json=nueva_tarea)

    assert respuesta.status_code == 200

    datos = respuesta.json

    assert "tareas" in datos

    tareas = datos["tareas"]

    assert any(
        tarea["titulo"] == "Tarea de prueba pytest"
        for tarea in tareas
    )