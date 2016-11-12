// The main file for battleship

initGui();
var b2;
var b1;
turn = false;
function gameInit(){
    
    if(human){
	b2 = new State([], [], b2Ships, []);
    }
    else{
	b2 = new State([], [], randGenShips(), []);
    }
    b1 = new State([], [], randGenShips(), []);
    

    for(var i = 0; i <200; i++){
    //while(!isEndState(b1) && !isEndState(b2)){
	console.log(b1);
	console.log(b1.isEndState());
	console.log(b2);
	console.log(b2.isEndState());
	if(b1.isEndState()){
	    window.alert("player 2 wins!");
	}
	if(b2.isEndState()){
	    window.alert("player 1 wins!");
	}
	//isEndState(b2);
	setTimeout(function(){nextTurn2();}, 0);
	//sleep(1000);
    }
    /*
    var play = true;
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
}
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

