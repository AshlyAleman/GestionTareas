
import sqlite3
import uuid

import pytest
import app as app_module
from app import app


@pytest.fixture
def cliente_prueba(monkeypatch):
    # Base de datos temporal exclusiva para cada prueba
    nombre_db = f"file:test_{uuid.uuid4().hex}?mode=memory&cache=shared"

    conexion_principal = sqlite3.connect(nombre_db, uri=True)

    conexion_principal.execute("""
        CREATE TABLE Tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            estado TEXT NOT NULL,
            usuario_id INTEGER NOT NULL
        )
    """)

    conexion_principal.commit()

    def conectar_base_datos_prueba():
        return sqlite3.connect(nombre_db, uri=True)

    # Sustituir SQL Server por la base de datos temporal durante las pruebas
    monkeypatch.setattr(
        app_module,
        "conectar_base_datos",
        conectar_base_datos_prueba
    )

    app.config["TESTING"] = True

    cliente = app.test_client()

    yield cliente

    conexion_principal.close()


def test_obtener_tareas(cliente_prueba):
    respuesta = cliente_prueba.get("/tareas")

    assert respuesta.status_code == 200
    assert isinstance(respuesta.json["tareas"], list)


def test_crear_tarea(cliente_prueba):
    nueva_tarea = {
        "titulo": "Tarea de prueba pytest",
        "descripcion": "Probando POST con pytest"
    }

    respuesta = cliente_prueba.post(
        "/tareas",
        json=nueva_tarea
    )

    assert respuesta.status_code == 200

    datos = respuesta.json

    assert "tareas" in datos

    tareas = datos["tareas"]

    assert any(
        tarea["titulo"] == "Tarea de prueba pytest"
        for tarea in tareas
    )
