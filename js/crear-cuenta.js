window.onload = () => {
    //capturo elementos del html
    const form = document.forms.formCuentaNueva;
    const nombre = form.nombre;
    const contrasenia = form.contrasenia;
    const repetirContrasenia =  form.repetirContrasenia;
    const email = form.email;

    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombreValido = validarNombre(nombre.value);
        const emailValido = validarEmail(email.value);
        const contraseniaValida = validarContrasenia(contrasenia.value, repetirContrasenia.value);
        if (nombreValido && contraseniaValida && emailValido){
            const datosUsuario = new DatosUsuario();
                datosUsuario.setFirstName(nombre.value);
                datosUsuario.setLastName('DH');
                datosUsuario.setPassword(contrasenia.value);
                datosUsuario.setEmail(email.value);
            
            /* 
            **Antes de ver APIs: Simulamos obtener un token (creandolo), y redireccionamiento a la pantalla de las tareas 
            localStorage.setItem('token', JSON.stringify(datosUsuario));
            location.href = './lista-tareas.html'; 
            */
            
            //API: crear usuario
            const url = 'https://ctd-todo-api.herokuapp.com/v1';
            fetch(`${url}/users`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosUsuario)
            }).then(response => {
                return response.json();
            }).then(datos => {
                localStorage.setItem('token', datos.jwt);
                location.href = './lista-tareas.html';
            }).catch(err => {
                console.log(err);
            })
        
        }
    })
}

//funciones de validaciones

function validarNombre(valor){
    //validacion: no contiene numeros
    const expresion = /[0-9]/;
    const test = expresion.test(valor);
    //validacion: longitud
    const longitudCorrecta = valor.length > 2;
    return !test && longitudCorrecta;
}

function validarEmail(valor){
    const expresion = /[A-z]+@[A-z]+.[A-z]{3}/;
    const test = expresion.test(valor);
    
    return test;
}

function validarContrasenia( contrasenia, repetirContrasenia){
    const coincidentes =  contrasenia === repetirContrasenia;
    const longitudCorrecta = contrasenia.length > 2;
    
    return coincidentes && longitudCorrecta;
}

//Clase
class DatosUsuario {
    constructor(){
        this.firstName = null;
        this.lastName = null;
        this.password = null;
        this.email = null;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    setPassword(password){
        this.password = password;
    }

    setEmail(email){
        this.email = email;
    }
}