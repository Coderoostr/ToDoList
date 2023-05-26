const URL_BASE = "https://todolist-1af18-default-rtdb.firebaseio.com/";

const inputToDo = document.getElementById("textoToDo");
const listaToDo = document.getElementById("listaToDo");
const flechaExpandir = document.getElementById("flechaExpandir");

function clickExpandir(event) {
    flechaExpandir.classList.toggle("rotate-arrow");
    listaToDo.classList.toggle("expanded-list");
}

cargarDatosToDo();

async function submitFormulario(event){
    event.preventDefault();

    const textoToDo = inputToDo.value;

    if (!textoToDo || textoToDo.trim().length == 0) {
        alert("El texto no puede estar vacio")
        return;
    }

    const resultado = await subirToDoAlServidor(textoToDo);

    if (!resultado) {
        alert("Hubo un error al guardar los datos");
        return;
    }

    agregarEnLista(resultado);
}

async function cargarDatosToDo() {
    const response = await fetch(URL_BASE + "to-do.json", {
        method: "GET",
    });
    const datosServidor = await response.json();

    for (let clave in datosServidor) {
        const id = clave;
        const texto = datosServidor[clave].texto;
        const datosToDo = {id: id, texto: texto}
        agregarEnLista(datosToDo);
    }
}

function agregarEnLista(datosToDo) {
    const textoBoton = `<button onclick="clickEliminar(event, '${datosToDo.id}')">Eliminar</button>`;

    // Agregué un id al li para luego poder buscarlo
    listaToDo.innerHTML += `<li id="${datosToDo.id}" class="to-do-items">${datosToDo.texto}${textoBoton}</li>`;
  }

  async function clickEliminar(event, id) {
    // Hacer una petición al servidor para eliminar el dato
    await fetch(URL_BASE + `to-do/${id}.json`, { method: "DELETE" });

    // Eliminar el dato de la lista HTML
    // Forma 1: usar el parentElement del target (el botón)
    // El parent del botón debería ser el li
    // const liEliminar = event.target.parentElement;

    // Forma 2: ponerle un id al li para luego buscarlo
    const liEliminar = document.getElementById(id);
    listaToDo.removeChild(liEliminar);
  }

async function subirToDoAlServidor(textoToDo) {
    const datosEnviar = {
        texto: textoToDo,
    }

    const response = await fetch(URL_BASE + "to-do.json", {
        method: "POST",
        body: JSON.stringify(datosEnviar),
    });

    const datosRespuesta = await response.json();

    const id = datosRespuesta.name;

    return { id: id, texto: textoToDo };
}