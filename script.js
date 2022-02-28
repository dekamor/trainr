var workout = {
    positionCount: null,
    positionList: null,
    interval: null,
    timing: null,
    secondsRemaining: null,
}

var whistleSound;

function addFields(){
    var number = document.getElementById("positions").value;
    var container = document.getElementById("container");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for (i=0;i<number;i++){
        var input = document.createElement("input");
        input.type = "text";
        input.setAttribute("id", i);
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
    }
}

function finishSetup(){
    updateWorkout(workout);
    console.log(workout)
    var str = serialize(workout);
    window.location.href = "trainr-workout.html" + "?" + str;
}

function testFunction(){
    console.log(sessionStorage.getItem('sessionDetails'));
}

function startWorkout(){
    var workoutDetails = unserialize();
    console.log(workoutDetails);
}

function startTimer(duration, displayTime, displayPositon) {
    var workoutDetails = unserialize();
    var timer = duration, minutes, seconds;
    var drillChangeTime = timer - nextDrillTime();
    var workoutActive = true;
    whistleSound = new sound("whistle_001.mp3");
    //whistleSound.play();
    displayPositon.textContent = getRandomDrill();
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        console.log(timer + " " + drillChangeTime);
        if(timer === drillChangeTime){
            console.log("change position");
            drillChangeTime = timer - nextDrillTime();
            displayPositon.textContent = getRandomDrill();
            whistleSound.play();
        }
        displayTime.textContent = minutes + ":" + seconds;
        if (--timer < 0) {        
            if(workoutActive){
                whistleSound.play();
                workoutActive = false;
            }
            timer = 0;
            displayPositon.textContent = "Nice Work! Get some water and refresh the page to go again.";
        }
    }, 1000);

}
start = function () {
    document.getElementById("startButton").innerHTML = "<br />" + "";
    var workoutDetails = unserialize();
    var fiveMinutes = 60 * 5,
        displayPositon = document.querySelector('#drillPosition'),
        displayTime = document.querySelector('#time');
    startTimer(Number(workoutDetails.secondsRemaining), displayTime, displayPositon);
};

function nextDrillTime(){
    var workoutDetails = unserialize();
    if(workoutDetails.timing === 'true'){
        console.log(workoutDetails.interval);
        return Number(workoutDetails.interval);
    }
    else{
        return getRandomIntInclusive(Number(workoutDetails.interval) - 2,  Number(workoutDetails.interval) + 2);
    }
}

function getRandomDrill(){
    var workoutDetails = unserialize();
    return workoutDetails.positionList[ getRandomIntInclusive(0,  Number(workoutDetails.positionCount) - 1)];
}



serialize = function(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

unserialize = function(){
    var queryString = decodeURIComponent(window.location.search); //parsing
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    for (var i = 0; i < queries.length; i++){
        console.log(queries[i])
    }
    var obj = {};
    for(i in queries){
        var split = queries[i].split('=');
        obj[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
    }
    obj.positionList = obj.positionList.split(",");
    console.log(obj);
    return obj;
}

updateWorkout = function(obj){
    obj.positionCount = document.getElementById("positions").value;
    obj.positionList = [];
    for (i=0;i<obj.positionCount;i++){
        obj.positionList.push(document.getElementById(i).value);
    }
    obj.interval = Number(document.getElementById("interval").value);
    obj.timing = document.getElementById("fixed").checked;
    obj.secondsRemaining = 60*Number(document.getElementById("minutes").value) + Number(document.getElementById("seconds").value);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}