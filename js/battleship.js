// The main file for battleship

initGui();
var b2;
var b1;
var turn; //false for p1, true for p2
var play;
function gameInit(){
    
    if(human){
	b2 = new State([], [], b2Ships, []);
    }
    else{
	b2 = new State([], [], randGenShips(), []);
    }
    b1 = new State([], [], randGenShips(), []);
    

    turn = false;
    play = true;

    if(human){
	nextTurn2();
	if(b1.isEndState()){
	    play = false;
	    window.alert("player 2 wins!");
	}
	nextTurn2();
	
    }
    else{
	gameLoop();
    }
    /*
    for(var i = 0; i <200; i++){
    //while(play){
	console.log(b1);
	console.log(b1.isEndState());
	console.log(b2);
	console.log(b2.isEndState());
	if(b1.isEndState()){
	    play = false;
	    window.alert("player 2 wins!");
	}
	if(b2.isEndState()){
	    play = false;
	    window.alert("player 1 wins!");
	}
	//isEndState(b2);
	nextTurn2();
	//setTimeout(function(){nextTurn2();}, i * 500);
	//sleep(1000);
    }
*/
   
    
    /*
    
    //while(play){
    for(var i = 0; i <20; i++){
	updateBoards(b1, b2);
	p1Turn();
	updateBoards(b1,b2);
	if(human){
	    humanTurn();
	}
	else{
	    p2Turn();
	}
	sleep(1000);
	play = false;
    }*/
    console.log(b2);
    console.log(b1);
}

function gameLoop(){
    while(play){
	console.log(b1);
	console.log(b1.isEndState());
	console.log(b2);
	console.log(b2.isEndState());
	if(b1.isEndState()){
	    play = false;
	    window.alert("player 2 wins!");
	}
	if(b2.isEndState()){
	    play = false;
	    window.alert("player 1 wins!");
	}
	//isEndState(b2);
	nextTurn2();
	//setTimeout(function(){nextTurn2();}, i * 500);
	//sleep(1000);
    }
}

function humanTurn(){
    var onclick = function(){
	var x = xId(this.id);
	var y = yId(this.id);

	if(ptInArr([y,x], b1.getOpen())){
	    //TODO implement hit/miss/sink coloring
	    b1.shoot([y,x]);
	    if(b1.isEndState()){
		play = false;
		window.alert("player 2 wins!");
	    }
	    nextTurn2();
	    if(b2.isEndState()){
		play = false;
		window.alert("player 1 wins!");
	    }
	    nextTurn2();
	}
    }
    var onenter = function(){
	var x = xId(this.id);
	var y = yId(this.id);

	this.style.opacity = "0.5";/*
	if(ptInArr([y,x], board1.getOpen())){
	    //TODO implement hit/miss/sink coloring
	    
	    if(b1.isEndState()){
		play = false;
		window.alert("player 2 wins!");
	    }
	}*/
    }
    var onleave = function(){
	var x = xId(this.id);
	var y = yId(this.id);

	this.style.opacity = "1.0";
    }
    console.log("Got Here");
    changePtrEvents(1, "auto");
    setMouseFunctions(1, onclick, onenter, onleave);
}

function nextTurn2(){
    //console.log(performance.memory)
    if(!turn){
	turn = !turn;
	//console.log(p1Turn());
	p1Turn();
	updateBoards(b1, b2);
	
    }
    else{
	turn = !turn;
	if(human){
	    humanTurn();
	}
	else{
	    //console.log(p2Turn());
	    p2Turn();
	}
	
    }
}
/*
function nextTurn(){
    console.log(performance.memory)
    if(!turn){
	p1Turn();
	updateBoards(b1, b2);
	turn = !turn;
	if(human){
	    nextTurn();
	}
	else{
	    setTimeout(function(){nextTurn();}, 1000);
	}
    }
    else{
	if(human){
	    humanTurn();
	}
	else{
	    p2Turn();
	}
	turn = !turn;
	setTimeout(function(){nextTurn();}, 1000);
    }
}*/
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function p1Turn(){
    return b2.shoot(randAI(b2));
}
function p2Turn(){
    return b1.shoot(randAI(b1));
}

function ptInArr(point, pointArray){
    for(var i = 0; i < pointArray.length; i++){
	if(point[0] == pointArray[i][0] && point[1] == pointArray[i][1]){
	    return true;
	}
    }
    return false;
}


function changePtrEvents(boardNum, setting){
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById(boardNum.toString() + ":" + i.toString() + "," + j.toString());
	    e.style.pointerEvents = setting;
	}
    }
};
