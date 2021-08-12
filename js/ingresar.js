window.onload = () =>{
    const form = document.forms.formIngresar;
    const inputEmail = form.email;
    const inputContrasenia = form.contrasenia;

    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        //tomo los valores de los inputs cdo hago submit, porque si los pongo fuera del 'onsubmit' toma el valor de la pag apenas se inicia, que estan vacíos.
        const email = inputEmail.value;
        const contrasenia = inputContrasenia.value;

        const url = 'https://ctd-todo-api.herokuapp.com/v1';
        fetch(`${url}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,       //en este caso que key y value(como variable) son iguales podríamos haber puesto directamente=> email, 
                password: contrasenia
            })
        }).then(response =>{
            return response.json();
        }).then(datos => {
            localStorage.setItem('token', datos.jwt);
            location.href = './lista-tareas.html';
        }).catch(err => {
            console.log(err);
        });
    });
}