import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//Database connection
const appSettings = {
    databaseURL: "https://playground-b00cd-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDb = ref(database, "comments")

// Element selector
const publishBtn = document.getElementById("publish-btn")
const textEl = document.getElementById("text-input")
const senderEl = document.getElementById("send-from")
const receiverEl = document.getElementById("send-to")
const divEl = document.getElementById("endorsement")


onValue(itemsInDb, function(snapshot){
    clearList()
    if (snapshot.exists()){
        const itemsArray = Object.entries(snapshot.val())
        console.log(itemsArray)

        for (let i = 0; i < itemsArray.length; i++)
            {   let currentMessage = itemsArray[i]
                addMessage(currentMessage)
            }
        }
    else{
        let newLi = document.createElement("li")
        newLi.textContent = "There is no message there ..."
        divEl.appendChild(newLi)
    }
})

// function push to database
publishBtn.addEventListener('click', () =>{
    let message = textEl.value
    if (message !== ""){
        push(itemsInDb, message)
    }
    else{
        let newText = document.createElement("h4")
        newText.textContent = `You must type something...?`
        document.getElementById("error-container").textContent = ""
        document.getElementById("error-container").appendChild(newText)

    }
})
// function to clear the list
function clearList(){
    divEl.innerHTML = ""
}
// Function to append all the database
function addMessage(message) {
    let currentId = message[0];
    let currentMessage = message[1];

    // Create new list item element
    let liElement = document.createElement('li');
    liElement.id = currentId;

    // Set inner HTML
    liElement.innerHTML = `
        <h4>To Anonyme</h4>
        <p>${currentMessage}</p>
        <div class="review-contain">
            <h4>From Anonyme</h4>
            <img src="./assets/favorite-heart-button.png" alt="like button" />
            <span class="compteur">0</span>
        </div>
    `;

    // Add double click event listener to remove the message
    liElement.addEventListener("dblclick", () => {
        let exactLocationInDb = ref(database, `comments/${currentId}`);
        remove(exactLocationInDb);
        // Remove the li element from the DOM
        liElement.remove();
    });

    // Append the new li element to the container (assuming divEl is the container)
    divEl.appendChild(liElement);
}

