const passInput = document.getElementById('password'); 





document.getElementById('checkbox').addEventListener('change', function () {
    passInput.type = this.checked ? 'text' : 'password';
});




document.getElementById('form').onsubmit = function (event) {
    event.preventDefault();
    validate_user();
}



function validate_user() {

    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value; 
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;


    fetch('login', { 

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },

        body: JSON.stringify({
            "username": username, 
            "password": password, 
        })

    })
    .then(response => response.json())  

    .then(data => {

        if (data.message === "Login successful") {

            alert("Login successful");

            window.location.href = '/home';  

        } else {

            alert(data.message); 

        }
    })
    .catch(error => {

        console.error('Error:', error);

        alert("An error occurred. Please try again.");

    });
}
