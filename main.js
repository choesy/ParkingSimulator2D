var game;
const canvasWidth = 1200;
const canvasHeight = 800;
const canvasMaxPossibileDistance = Math.sqrt(canvasWidth*canvasWidth+canvasHeight*canvasHeight);

var buttonSave;
var buttonLoad;

var buttonQSave;
var buttonQLoad;

var buttonCounter;

var saveScore;

var GAMETICKSCOUNTER=0;

function setup(){
    createCanvas(canvasWidth, canvasHeight);
    rectMode(CENTER);
    angleMode(DEGREES);
    
    slider = createSlider(1, 100, 1);
    buttonSave =createButton('saveBest')
    buttonLoad =createFileInput(loadBest)
    buttonSave.mousePressed(saveBest)

    buttonQSave =createButton('saveBestQ')
    buttonQLoad =createFileInput(loadBestQ)
    buttonQSave.mousePressed(saveBestQ)

    buttonSaveScore =createButton('saveScore')
    buttonSaveScore.mousePressed(saveScore)
  
    game = new Game(1,1);
}

function draw(){
    game.setUpdateCycles(slider.value());
    
    game.update(keys);
    game.draw();

    GAMETICKSCOUNTER++;

}

// input
var keys = {}
document.onkeydown = function(e){
    (e.key == " ") ? keys['Space'] = true : keys[e.key] = true;
}
document.onkeyup = function(e){
    (e.key == " ") ? keys['Space'] = false : keys[e.key] = false;
}

function loadBest(file){

    var base64Str=file.data.split(",")[1]
    var jsonStr=atob(base64Str)
    objBrain=NeuralNetwork_FF.deserialize(jsonStr)
    game.CarManager.loadBestCar(objBrain)
}

function saveBest(){

var objdataString=game.CarManager.saveBestCar()

saveJSON(objdataString,'car.json');


}


function loadBestQ(file){

    var base64Str=file.data.split(",")[1]
    var jsonStr=atob(base64Str)
    game.deepQCarManager.loadBestQCar(jsonStr)
}

function saveBestQ(){

var objdataString=game.deepQCarManager.saveBestQCar()

saveJSON(objdataString,'carQ.json');


}
function saveScore(){
        saveJSON(game.scoreArray,'scores.json');
    }