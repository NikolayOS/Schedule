document.addEventListener("DOMContentLoaded", (e) => {
  window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.vebkitIndexedDB ||
    window.msIndexedDB;

  let request = indexedDB.open("TaskManager", 1);
  request.onupgradeneeded = (event) => {
    let DB = event.target.result;
    if (!DB.objectStoreNames.contains("Schedule")) {
      let ObjectStore = DB.createObjectStore("Schedule", {
        keyPath: "id",
        autoIncrement: true,
      });
      ObjectStore.createIndex("IndexByTask", "textInput", { unique: true });
    }
  };
  request.onsuccess = (event) => {
    console.log("Success! DB has been opened!");
    db = event.target.result;
    showTasks();
  };
  request.onerror = (event) => {
    console.log("Error! There is problem with opening your DB");
  };
});

function addTask(e) {
  let textInput = document.getElementById("toAddText").value;
  let date = document.getElementById("date").value;
  let hour = document.getElementById("hour").value;
  let selectedPriority = document.getElementById("Priority").value;

  let transaction = db.transaction(["Schedule"], "readwrite");
  let store = transaction.objectStore("Schedule");
  let Task = {
    textInput,
    date,
    hour,
    selectedPriority,
  };
  let req = store.add(Task);
  req.onsuccess = (event) => {
  };
  req.onerror = (event) => {
    return false;
  };
  newEven = `<div class = "${Task.selectedPriority}" id = "${Task.id}"> ${Task.date} ${Task.hour} <pre>${Task.textInput}</pre></div>`;
    document.getElementById("area").insertAdjacentHTML("beforeend", newEven);
  document.getElementById("rightWrapper").reset();
}
function showTasks(event) {
  let transaction = db.transaction(["Schedule"], "readonly");
  let store = transaction.objectStore("Schedule");
  let textOutput = document.getElementById("area");
  let index = store.index("IndexByTask");
  index.openCursor().onsuccess = (event) => {
    let cursor = event.target.result;
    if (cursor) {
      newEven = `<div class = "${cursor.value.selectedPriority}" id = "${cursor.value.id}"> ${cursor.value.date} ${cursor.value.hour} <pre>${cursor.value.textInput}</pre></div>`;
      textOutput.insertAdjacentHTML("beforeend", newEven);
      cursor.continue();
    }
  };
}
let deleteDisplayed = false;

document.querySelector("#area").addEventListener("contextmenu", (item) => {
  let deleteBtn = null;
  let left = item.clientX;
  let top = item.clientY;
  let target = item.target;
  if (target.tagName != "DIV") return;
  deleteBtn = document.querySelector("#Delete");
  deleteBtn.style.left = left + "px";
  deleteBtn.style.top = top + "px";
  deleteBtn.style.display = "block";
  item.preventDefault();
  deleteDisplayed = true;

  document.querySelector("#Delete").addEventListener("click", (e) => {
    let transaction = db.transaction(["Schedule"], "readwrite");
    let store = transaction.objectStore("Schedule");
    let index = store.delete(+`${target.id}`);
    index.onsuccess = (e) => {
      target.remove();
      return false;
    };
    index.onerror = (e) => {
      return false;
    };
  });
  
});
window.addEventListener("click", () => {
  if ((deleteDisplayed = true)) {
    document.querySelector("#Delete").style.display = "none";
  }
});

document.getElementById("PriorityInHeader").addEventListener("change", () => {
    for (let i = 0; i < document.getElementById("area").childNodes.length; i++){
      for (let j = i; j < document.getElementById("area").childNodes.length; j++){
        (j > i) ? document.getElementById("area").append(document.getElementById("area").childNodes.length[i]) :
        document.getElementById("area").prepend(document.getElementById("area").childNodes.length[i])
      }
    }
})
