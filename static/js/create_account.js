
function submit_form(){


    var first_name = document.getElementById('first_name').value ;
    var last_name = document.getElementById('last_name').value ;    
    var username = document.getElementById('username').value ;
    var password = document.getElementById('password').value ;
    var c_password = document.getElementById('c_password').value ;
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;



    if (password === c_password){

        fetch('account_creation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({

                "first_name" : first_name , 
                "last_name" : last_name , 
                "username" : username , 
                "password" : password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            confirm(data.data);

            window.location.href = 'login';
            
           
            
        })
    
    }

    else{

        alert("Password & Confirm Password Doesn't Match")

    }






    
    }