document.addEventListener('DOMContentLoaded', (e) => {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.vebkitIndexedDB || window.msIndexedDB;
    
    let request = indexedDB.open('TaskManager', 1);
    request.onupgradeneeded = (event) => {
        let DB = event.target.result;
        if (!DB.objectStoreNames.contains('Schedule')) {
            var ObjectStore = DB.createObjectStore('Schedule', { keyPath: 'id', autoIncrement: true });
            ObjectStore.createIndex('IndexByTask', 'textInput', { unique: true });
            ObjectStore.createIndex('IndexByPriority', 'selectedPriority', { unique: false });
        }
    }
    request.onsuccess = (event) => {
        console.log('Success! DB has been opened!');
        db = event.target.result;
        showTasks();
    }
    request.onerror = (event) => {
        console.log('Error! There is problem with opening your DB');
    }
    });

function addTask(e){
    let textInput = document.getElementById("toAddText").value;
    let date = document.getElementById("date").value;
    let hour = document.getElementById("hour").value;
    let selectedPriority = document.getElementById("Priority").value;

let transaction = db.transaction(['Schedule'], 'readwrite');
let store = transaction.objectStore('Schedule');
let Task = {
    textInput,
    date,
    hour,
    selectedPriority
};
let req = store.add(Task);
    req.onsuccess = (event) => {
        alert('New task was added');
        
    };
    req.onerror = (event) => {
        alert('There is a problem with adding a new task');
        return false;
    };
}

function showTasks(event) {
            let transaction = db.transaction(['Schedule'], 'readonly');
            let store = transaction.objectStore('Schedule');
            let textOutput = document.getElementById("area");
            let index = store.index('IndexByTask');
    index.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            newEven = `<div class = "${cursor.value.selectedPriority}"> ${cursor.value.date} ${cursor.value.hour} <pre>${cursor.value.textInput}</pre></div>`;
            textOutput.insertAdjacentHTML("beforeend", newEven);
            console.log(cursor.value);
            console.log(cursor.key);
            console.log(cursor);
            cursor.continue();
        }
        
    }
}


