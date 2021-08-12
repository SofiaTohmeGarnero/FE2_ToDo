window.onload = () => {
    //crearTareas(); // => la llama la fnc  getTareasFromApi()
    //agregarTarea();  => deprecada ver fnc comentada
    getTareasFromApi();

    //para agregar una tarea nueva al presionar el boton "+"
    document.forms.agregarTarea.addEventListener('submit', (e) =>{
        e.preventDefault();
        tareaNueva();
    });
}


/* 
Esta constante queda obsoleta porque se usaba para crear tareas desde JS, ahora obtenemos las tareas almacenadas en el servidor a traves de la API

const tareas = [
    { nombre: 'tarea1', fecha: '18/06/89', estado: false },
    { nombre: 'tarea2', fecha: '18/06/89', estado: false },
    { nombre: 'tarea3', fecha: '18/06/89', estado: false },
] 
*/

function crearTareas(tareas) {
    /*estos innerHTML se hacen para limpiar todo el DOM y eliminar lo que hay en el html(skeletons) antes de cargar las tareas posta, tmbie sirve para borrar estas dos lineas del resto del código pq siempre se limpiara el DOM cuando se llame la funcion crearTareas() */
    document.querySelector('ul.tareas-pendientes').innerHTML = '';
    document.querySelector('ul.tareas-terminadas').innerHTML = '';
    
    tareas.forEach(tarea => {
        renderizarTarea(tarea)
    })
    //tareas.filter(tarea = !tarea.completed) seria otra opcion para re-renderizar tarea

}

function renderizarTarea(tarea) {
    const template = `
    <li class="tarea animar-entrada">
        <div class="not-done" onclick='completarTarea(${tarea.id},${tarea.completed})'></div>
        <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <div class="right-description">
            <p class="timestamp">Creado el: ${tarea.createdAt}</p>
            <button onclick='eliminarTarea(${tarea.id})'><i class="fas fa-trash"></i></button>
            </div>
        </div>
    </li>
    `;

    //esta logica es la que agrega las tareas en el contenedor que le corresponda según su estado
    const contenedorTareas = document.querySelector('ul.tareas-pendientes');
    const contenedorTareasCompletas = document.querySelector('ul.tareas-terminadas');
    if(!tarea.completed){
        contenedorTareas.innerHTML += template;
    }else{
        contenedorTareasCompletas.innerHTML += template
    }
}

function getTareasFromApi() {
    const url = 'https://ctd-todo-api.herokuapp.com/v1';
    const token = localStorage.getItem('token')
    fetch(`${url}/tasks`, {
        headers: {
        authorization: token  //para que nos traiga las tareas del usuario con ese token
        }
    }).then(response => {
        return response.json();
    }).then(tareas => {
        //console.log(tareas);
        crearTareas(tareas);
    })
}

/*
Esta funcion queda obsoleta al trabajar con la API, pq las crea pero si recargamos pag se borran, pq no se crean en el servidor

function agregarTarea() {
    const nuevaTarea = { nombre: 'tarea1', fecha: '18/06/89', estado: false };
    const nombreNuevaTarea = prompt('ingrese el nombre de la tarea;');

    nuevaTarea.nombre = nombreNuevaTarea;
    renderizarTarea(nuevaTarea);
}
*/

//con esta función creamos tareas nuevas y las guardamos en el servidor
function tareaNueva(){
    const descripcionTareaNueva = document.forms.agregarTarea.descripcionTareaNueva.value;
    const url = 'https://ctd-todo-api.herokuapp.com/v1';
    const token = localStorage.getItem('token');
    const body = {
            description: descripcionTareaNueva,
            completed: false
    }
    fetch(`${url}/tasks`,{
        method:'POST',
        headers:{
            authorization: token,
            "Content-Type": "application/json"
        },
        body:JSON.stringify(body)
    }).then(response => {
        return response.json();
    }).then(tarea => {
        renderizarTarea(tarea);
    }).catch(err => {
        console.log(err);
    })
}

function completarTarea(id, completed) {
    const url = 'https://ctd-todo-api.herokuapp.com/v1';
    const token = localStorage.getItem('token');

    fetch(`${url}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            authorization: token,
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            completed: !completed   //pq me trae el estado actual y se debe mandar para guardar el estado contrario
        })
    }).then(response => {
        return response.json();
    }).then(tarea => {
        getTareasFromApi();
        //console.log(tarea);
    }).catch( err => {
        console.log(err)
    })
}

function eliminarTarea(id){
    const url = 'https://ctd-todo-api.herokuapp.com/v1';
    const token = localStorage.getItem('token');

    if(!confirm('Esta seguro que desea eliminar la tarea')){
        return;
    }

    fetch(`${url}/tasks/${id}`,{
        method:'DELETE',
        headers:{
        authorization: token,
        }
    })/* .then(datos => {   //no hace falta pq la rta del servidor si es SI(se elimina) se ejecuta el .then y si es NO(no se elimina) entonces se ejecuta el .catch
        return datos.json();
    }) */.then(tarea => {
        /* estos innerHTML estaban en todos los fetch(que realizaban alguna modificacion el las tareas) pero es más performante que se escriban una sola vez en la fnc crearTareas() que es llamada por getTareasFromApi() por eso los omitimos aca
        document.querySelector('ul.tareas-pendientes').innerHTML = '';
        document.querySelector('ul.tareas-terminadas').innerHTML = '';
        */
        getTareasFromApi();
    }).catch(err => {
        console.log(err);
    })

}







//redireccionar a ingresar si no tenemos token
function comprobarToken(){
    const token = localStorage.getItem('token');
    if(!token){
        location.href = './ingresar.html'
    }
}

comprobarToken(); //para que sea más rápido lo podemos hacer fuera del 'onload' pq no el localStorage no es parte del DOM, no hace falta protegerlo

setInterval(() =>{      //compueba que exista token cada un intervalo de tiempo establecido
    comprobarToken();
    }, 100000);