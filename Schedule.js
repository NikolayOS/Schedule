let submit = document.getElementById("Submit");
submit.addEventListener("click",() => {

let textInput = document.getElementById("toAddText").value;
let textOutput = document.getElementById("area");
let newEvent = document.createElement("div");
let pre = document.createElement("pre");
let eventTime = document.createElement("div");
let date = document.getElementById("date").value;
let hour = document.getElementById("hour").value;
newEvent.innerHTML = textInput;
let slectedPriority = document.getElementById("Priority").value;
if (slectedPriority == "High"){
    newEvent.className = "Priority1";
    eventTime.className = "Priority1";
}
else if (slectedPriority == "Medium"){
    newEvent.className = "Priority2";
    eventTime.className = "Priority2";
}
else if (slectedPriority == "Low"){
    newEvent.className = "Priority3";
    eventTime.className = "Priority3";
}

eventTime.innerHTML = `${date} ${hour}`;
textOutput.append(pre);
pre.append(eventTime);
pre.append(newEvent);

})