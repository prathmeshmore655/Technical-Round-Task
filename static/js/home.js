var username_div = document.getElementById('username');
var receiver = 0;
const room_name = 'general';
const websocketurl = 'ws://127.0.0.1:8080/ws/chat/' + room_name + '/';
const websocket = new WebSocket(websocketurl);
var sender_to = 0;
var sender_id_to = 0;







function user_click(id, f_name, l_name, username, login_username, l_id) {
    var click_div = document.getElementById(`${id}`);
    var chat_box = document.getElementById('box');

    sender_to = login_username;
    sender_id_to = l_id;

    chat_box.style.display = 'block';
    receiver = id;

   
    var all_divs = document.getElementsByClassName('name');
    for (var i = 0; i < all_divs.length; i++) {
        all_divs[i].style.backgroundColor = 'aliceblue';
        all_divs[i].style.color = 'black';
    }

   



    click_div.style.backgroundColor = '#007bff';
    click_div.style.color = 'white';



    username_div.style.height = '100px';
    username_div.innerHTML = 
        `  <label for="">
            ${f_name} &nbsp; ${l_name} &nbsp; (${username})
        </label>`;





  
    websocket.send(JSON.stringify({
        type: "fetch_history",
        sender: l_id,  
        receiver: receiver
    }));




    setTimeout(() => {
        const label = username_div.querySelector('label');
        if (label) {
            label.style.opacity = 1;
            username_div.style.opacity = 1;
        }
    }, 10);
}






function searchUsers() {


    const searchInput = document.getElementById("search").value.toLowerCase();
    

    const userCards = document.querySelectorAll(".user_card");

    userCards.forEach(card => {


        const nameLabel = card.querySelector("label");

        const fullName = nameLabel.textContent.toLowerCase();

        card.style.display = fullName.includes(searchInput) ? "block" : "none";


    });
}




websocket.onopen = function () {
    console.log('Connected to WebSocket successfully');
};



websocket.onerror = function (e) {
    console.log("Error occurred:", e);
};



websocket.onclose = function () {
    console.log('WebSocket disconnected successfully');
};



const div = document.getElementById('self_user');




let type_timeout;


websocket.onmessage = function (e) {
    const data = JSON.parse(e.data);

    if (data.type === "history") {
        div.innerHTML = '';

        if (receiver != 0) {
            data.history.forEach(chat => {

                if (chat.sender == sender_to) {
                    
                    div.innerHTML += 
                        `<div class="chat_main" style="align-items: flex-end;">
                            <p>${chat.datetime}</p>
                            <div class="chat">${chat.message}</div>
                        </div>`;


                } 
                
                
                
                else {
                    div.innerHTML += 
                        `<div class="chat_main" style="align-items: flex-start;">
                            <p>${chat.datetime}</p>
                            <div class="chat">${chat.message}</div>
                        </div>`;



                }




            });
        }
    } 


    else if (data.type == "typing") {




        let div_to_update = document.getElementsByClassName('typing_name')[0];

        console.log('Workin till this', receiver);



        if (data.typer != receiver) {


            console.log("websocket" ,data);
            div_to_update.innerHTML = `
                <p style="font-size: medium; color: #007bff;">${data.name} is typing...</p>
            `;

            clearTimeout(type_timeout);

            type_timeout = setTimeout(() => {
                div_to_update.innerHTML = '';  
            }, 2000); 
        }



    } else {



        if (sender_to != 0) {
            if (data.sender == sender_id_to) {
                div.innerHTML += 
                    `<div class="chat_main" style="align-items: flex-end;">
                        <p>${data.now}</p>
                        <div class="chat">${data.message}</div>
                    </div>`;
            } 
            
            
            
            else {


                div.innerHTML += 
                    `<div class="chat_main" style="align-items: flex-start;">
                        <p>${data.now}</p>
                        <div class="chat">${data.message}</div>
                    </div>`;


            }

        }
    }
};




function sendMessage(sender) {


    const message = document.getElementById('message').value;


    const messageData = {
        "message": message,
        "sender": sender,
        "receiver": receiver,
    };


    console.log('Sending text message:', messageData);

    websocket.send(JSON.stringify(messageData));


    document.getElementById('message').value = '';  
}





let typingTimeout; 
const TYPING_INTERVAL = 2000; 



function typing_handler(id) {


    var message_send_data = {
        "type": "typing",
        "is_typing": true,
        "typer": id,
        "name": sender_to
    };




    console.log("message_data: ", message_send_data);



    websocket.send(
        JSON.stringify(message_send_data)
    );



    clearTimeout(typingTimeout);



    typingTimeout = setTimeout(() => {
        message_send_data = {
            "type": "typing",
            "is_typing": false,
            "typer": id,
            "name": document.getElementById('username').innerText.trim() 
        };



        websocket.send(
            JSON.stringify(message_send_data)
        );



    }, TYPING_INTERVAL);
}
