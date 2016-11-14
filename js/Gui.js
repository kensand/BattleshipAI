var container = null;
var human = true;
var selectShipHoriz = true;
var selectShipButton = null;
var selectShip = null;
var selectShipLen = null;
var b2Ships = [];


function initGui(){
    
    container = document.getElementById("container");
    var board1 = document.createElement("div");
    var board2 = document.createElement("div");
    board2.id = "board2";
    board1.id = "board1";
    board1.style.pointerEvents = "none";
    board1.className += "board";
    board2.className += "board";
    //label boards
    var temp = document.createElement("p");
    temp.innerHTML += "Player 1 (AI)";
    temp.className += "boardLabel";
    board1.appendChild(temp);
    temp = document.createElement("p");
    temp.innerHTML += "Player 2";
    temp.className += "boardLabel";
    temp.id = "player2label";
    board2.appendChild(temp);
    //fill boards with divs
    for(i = 0; i < 10; i++){
	var tempRow1 = document.createElement("div");
	var tempRow2 = document.createElement("div");
	tempRow1.className += "row";
	tempRow2.className += "row";
	for(j = 0; j < 10; j++){
	    var tempDiv1 = document.createElement("div");
	    var tempDiv2 = document.createElement("div");
	    //tempDiv1.onclick = buttonClick;
	    //tempDiv2.onclick = buttonClick;
	    tempDiv1.className += "square";
	    tempDiv2.className += "square";
	    tempDiv1.id = "1:" + i + "," + j;
	    tempDiv2.id = "2:" + i + "," + j;
	    tempRow1.appendChild(tempDiv1);
	    tempRow2.appendChild(tempDiv2);
	}

	board1.appendChild(tempRow1);
	board2.appendChild(tempRow2);
    }
    container.appendChild(board1);
    container.appendChild(board2);
    var toggleAI = document.createElement("div");
    toggleAI.id = "toggleAI";
    var temp = document.createElement("button");
    temp.id = "toggle";
    temp.className = "toggle-down";    
    temp.innerHTML = "Player 2 AI is OFF";
    temp.onclick = toggleHuman;
    toggleAI.appendChild(temp);
    

    
    
    
    //setup AI settings bar

    var aiset = document.createElement("div");
    aiset.id = "aiset";
    var temp = document.createElement("label");
    temp.htmlfor = "AIspeed";
    var t = document.createTextNode("AI speed");
    temp.appendChild(t);
    aiset.appendChild(temp);

    temp = document.createElement("input");
    temp.value = "25";
    temp.id = "AIspeed";
    temp.name = "AIspeed";
    temp.type = "range"
    aiset.appendChild(temp);
    
    temp = document.createElement("br");
    aiset.appendChild(temp);
    
    temp = document.createElement("button");
    temp.innerHTML = "Start AI Game";
    temp.id = "startButton";
    temp.onclick = function(){ disableSettings();
			       gameInit();
			     };
    aiset.appendChild(temp);
    aiset.style.display = "none";
    container.appendChild(aiset);
    //setup ship select bar
    
    
    var shipSelect = document.createElement("div");
    shipSelect.id= "shipSelect"

    temp = document.createElement("p");

    temp.innerHTML += "Carrier";
    temp.id = "Carrier";
    temp.onclick = selectClick;
    //console.log(temp.innerHTML);
    temp.style.userSelect = "none";
    shipSelect.appendChild(temp);
    //console.log(temp.innerHTML);

    temp = document.createElement("p");
    temp.innerHTML = "Battleship";
    temp.id = "Battleship";
    temp.onclick = selectClick;
    temp.style.userSelect = "none";
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.innerHTML = "Submarine";
    temp.id="Submarine";
    temp.onclick = selectClick;
    temp.style.userSelect = "none";
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.innerHTML = "Destroyer";
    temp.id = "Destroyer";
    temp.onclick = selectClick;
    temp.style.userSelect = "none";
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.id = "Patrol";
    temp.onclick = selectClick;
    temp.style.userSelect = "none";
    temp.innerHTML = "Patrol Boat";
    shipSelect.appendChild(temp);

    temp = document.createElement("br");
    //shipSelect.appendChild(temp);

    temp = document.createElement("button");
    temp.onclick = rotateShip;
    temp.innerHTML = "Rotate Ship";
    temp.id = "rotateShipButton";
    shipSelect.appendChild(temp);
    
    temp = document.createElement("button");
    temp.onclick = function(){
	this.style.pointerEvents = "none";
	disableSettings();
			       gameInit();
			     };
    temp.innerHTML = "Start Game";
    temp.id = "humanStartGameButton";
    temp.style.opacity = "0.5";
    temp.style.pointerEvents = "none";
    shipSelect.appendChild(temp);

    container.appendChild(shipSelect);
    container.appendChild(toggleAI);
    temp = document.createElement("button");
    temp.innerHTML = "Reset";
    temp.id="resetButton";
    temp.onclick = reset;
    temp.style.display = "inline-block";
    container.appendChild(temp);
    
}

function reset(){
    container = null;
    human = true;
    selectShipHoriz = true;
    selectShipButton = null;
    selectShip = null;
    selectShipLen = null;
    b2Ships = [];
    initGui();
    b2 = null;//board2
    b1 = null;//board1
    turn = false; //false for p1, true for p2
    play = true; //play state
    if(intervalVal != null){
	clearInterval(intervalVal);
    }
    intervalVal = null;
   
    while (container.firstChild) {
	container.removeChild(container.firstChild);
    }
    initGui();
}
function buttonClick(){
    //console.log(this.id);
    this.style.backgroundColor = "#000000";
}

function rotateShip(){
    selectShipHoriz = !selectShipHoriz;
    if(selectShipButton != null){
	setPlacementOnHovers(selectShipLen, selectShipHoriz);
    }
}
function yId(id){
    return parseInt(id.slice(id.indexOf(":") + 1, id.indexOf(",")));
}
function xId(id){
    return parseInt(id.slice(id.indexOf(",") + 1));
}

function selectClick(){
    this.style.color = "green";
    if(selectShipButton != null){
	if(selectShipButton == this){
	    selectShipButton.style.color = "black";
	    selectShipButton = null;
	    selectShip = null;
	    return;
	}
	else{
	    selectShipButton.style.color = "black";
	    
	}
    }
    selectShipButton = this;
    
    if(this.id == "Carrier"){
	setPlacementOnHovers(5, selectShipHoriz);
    }
    else if(this.id == "Battleship"){		
	setPlacementOnHovers(4, selectShipHoriz);
	
    }
    else if(this.id == "Submarine"){
	setPlacementOnHovers(3, selectShipHoriz);
    }
    else if(this.id == "Destroyer"){		
	setPlacementOnHovers(3, selectShipHoriz);
    }
    else if(this.id == "Patrol"){
	setPlacementOnHovers(2, selectShipHoriz);
    }
}


function removeOnHovers(){
    setMouseFunctions(2, null, null, null);
    /*
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById("2:" + i.toString() + "," + j.toString());
	    e.onmouseenter = null;
	    e.onmouseleave = null;
	    e.onclick = null;
	}
    }*/
}

function setMouseFunctions(boardNum, onclick, onenter, onleave){
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById(boardNum.toString() + ":" + i.toString() + "," + j.toString());
	    console.log(boardNum.toString() + ":" + i.toString() + "," + j.toString());
	    e.onmouseenter = onenter;
	    e.onmouseleave = onleave;
	    e.onclick = onclick;
	}
    }
	    
}


function setPlacementOnHovers(length, horiz){
    selectShipLen = length;
    var onmouseenter = function(){
	if(selectShipButton == null){
	    return
	}
	var x = xId(this.id);
	var y = yId(this.id);
	var ship = new Ship(x,y,length, horiz);
	//console.log(horiz);
	if(!intersectOtherShips(ship, b2Ships)){
	    //console.log("doesn't intersect");
	    if(ship.validLoc()){
		//console.log("" + ship.getPoints());
		for(var i = 0; i < ship.len; i++){
		    //console.log("" + ship.getPoints()[i]);
		    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "green";
		    
		}
		
	    }
	    else{
		this.style.backgroundColor = "red";
	    }
	}
	else{
	    this.style.backgroundColor = "red";
	}
    };

    var onmouseleave = function(){
		
	if(selectShipButton == null){
	    return
	}
	var x = xId(this.id);
	var y = yId(this.id);
	var ship = new Ship(x,y,length, horiz);
	//console.log(horiz);
	if(!intersectOtherShips(ship, b2Ships)){
	    if(ship.validLoc()){
		//console.log("" + ship.getPoints());
		for(var i = 0; i < ship.len; i++){
		    //console.log("" + ship.getPoints()[i]);
		    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "#aaaaaa";
		}
	    }
	    else{
		this.style.backgroundColor = "#aaaaaa";
	    }
	}
	else{
	    if(shipsContainPoint(y,x,b2Ships)){
		this.style.backgroundColor = "blue";
	    }
	    else{
		this.style.backgroundColor = "#aaaaaa";
	    }
		       
	}
	
    };

    var onclick = function(){
	if(selectShipButton == null){
	    return
	}
	var x = xId(this.id);
	var y = yId(this.id);
	var ship = new Ship(x,y,length, horiz);
	//console.log(horiz);
	if(!intersectOtherShips(ship, b2Ships)){
	    if(ship.validLoc()){
		for(var i = 0; i < ship.len; i++){
		    //console.log("" + ship.getPoints()[i]);
		    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "blue";
		}
		b2Ships.push(ship);
		console.log(b2Ships);
		selectShipButton.style.pointerEvents = "none";
		
		selectShipButton.style.color = "black";
		selectShipButton.style.opacity = "0.5";
		selectShipButton = null;
		removeOnHovers();
		console.log("b2Ships.length = " + b2Ships.length);
		if(b2Ships.length == 5){
		    //start game
		    //document.getElementById("toggleAI").style.pointerEvents = "none";
		    document.getElementById("humanStartGameButton").style.pointerEvents = "auto"
		    document.getElementById("humanStartGameButton").style.opacity = "1.0";
		    //window.alert("Game would start now");
		    disableSettings();
		    //gameInit();
		}
		
	    }
	}
    };

    setMouseFunctions(2, onclick, onmouseenter, onmouseleave);

   
    /*
    selectShipLen = length;
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById("2:" + i.toString() + "," + j.toString());
	    e.onmouseenter = function(){
		if(selectShipButton == null){
		    return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
		    //console.log("doesn't intersect");
		    if(ship.validLoc()){
			//console.log("" + ship.getPoints());
			for(var i = 0; i < ship.len; i++){
			    //console.log("" + ship.getPoints()[i]);
			    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "green";
			    
			}
			
		    }
		    else{
			this.style.backgroundColor = "red";
		    }
		}
		else{
			this.style.backgroundColor = "red";
		}
	    };
	    e.onmouseleave = function(){
		
		if(selectShipButton == null){
		    return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
		    if(ship.validLoc()){
			//console.log("" + ship.getPoints());
			for(var i = 0; i < ship.len; i++){
			    //console.log("" + ship.getPoints()[i]);
			    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "#aaaaaa";
			}
		    }
		    else{
			this.style.backgroundColor = "#aaaaaa";
		    }
		}
		else{
		    if(shipsContainPoint(y,x,b2Ships)){
			this.style.backgroundColor = "blue";
		    }
		    else{
			this.style.backgroundColor = "#aaaaaa";
		    }
		       
		}
		
	    };



	    e.onclick = function(){
		if(selectShipButton == null){
		    return
		}
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
		    if(ship.validLoc()){
			for(var i = 0; i < ship.len; i++){
			    //console.log("" + ship.getPoints()[i]);
			    document.getElementById("2:" + ship.getPoints()[i][0].toString() + "," + ship.getPoints()[i][1].toString()).style.backgroundColor = "blue";
		    }
			b2Ships.push(ship);
			console.log(b2Ships);
			selectShipButton.style.pointerEvents = "none";
			
			selectShipButton.style.color = "black";
			selectShipButton.style.opacity = "0.5";
			selectShipButton = null;
			removeOnHovers();
			console.log("b2Ships.length = " + b2Ships.length);
			if(b2Ships.length == 5){
			    //start game
			    document.getElementById("toggleAI").style.display = "none";
			    document.getElementById("rotateShipButton").style.display = "none"
			    window.alert("Game would start now");
			}
			    
		    }
		}
	    };
	    
	}
    }
*/
}




















function toggleHuman(){
    var tog = document.getElementById("toggle");
    var ss = document.getElementById("shipSelect");
    var aiset = document.getElementById("aiset");
    var p2l = document.getElementById("player2label");
    if(!human){
	tog.className = "toggle-down";
	tog.innerHTML = "Player 2 AI is OFF";
	ss.style.display = "block";
	aiset.style.display = "none";
	p2l.innerHTML = "Player 2";
	//ss.style.display = "block";
	//ss.style.opacity = "1.0";
	//ss.style.pointerEvents = "auto";
	human = true;
    }
    else{
	tog.className = "toggle-up";
	human = false;
	//ss.style.display = "none";
	ss.style.display = "none";
	aiset.style.display = "block";
	p2l.innerHTML = "Player 2 (AI)";
	//ss.style.opacity = "0.5";
	//ss.style.pointerEvents = "none";
	tog.innerHTML = "Player 2 AI is ON";
	removeOnHovers();
	if(selectShipButton != null){
	    selectShipButton.style.color = "black";
	    selectShipButton = null;
	    selectShipLen = null;
	    selectShip = null;
	}
	//gameInit();
    }
}

function updateBoards(state1, state2){
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e1 = document.getElementById("1:" + i.toString() + "," + j.toString());
	    var e2 = document.getElementById("2:" + i.toString() + "," + j.toString());
	    e1.style.backgroundColor = "#aaaaaa";
	    e2.style.backgroundColor = "#aaaaaa";

	}
    }
    //Show ships
    if(!human){
	for(i = 0; i < state1.ships.length; i++){
	    var ship = state1.ships[i];
	    for(j = 0; j < ship.getPoints().length; j++){
		var pt = ship.getPoints()[j];
		var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
		e.style.backgroundColor = "blue";
	    }
	}
    }
    for(i = 0; i < state2.ships.length; i++){
	var ship = state2.ships[i];
	for(j = 0; j < ship.getPoints().length; j++){
	    var pt = ship.getPoints()[j];
	    var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
	    e.style.backgroundColor = "blue";
	    
	}
    }
    //Show hits
    for(i = 0; i < state1.hit.length; i++){
	var pt = state1.hit[i];
	var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
	e.style.backgroundColor = "red";
    }

    for(i = 0; i < state2.hit.length; i++){
	var pt = state2.hit[i];
	var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
	e.style.backgroundColor = "red";
    }

    //Show misses
    for(i = 0; i < state1.miss.length; i++){
	var pt = state1.miss[i];
	var e = document.getElementById("1:" + pt[0].toString() + "," + pt[1].toString());
	e.style.backgroundColor = "green";
    }

    for(i = 0; i < state2.miss.length; i++){
	var pt = state2.miss[i];
	var e = document.getElementById("2:" + pt[0].toString() + "," + pt[1].toString());
	e.style.backgroundColor = "green";
    }
}

function disableSettings(){
    document.getElementById("toggleAI").style.pointerEvents = "none";
    document.getElementById("toggle").style.pointerEvents = "none";
    document.getElementById("rotateShipButton").style.pointerEvents = "none"
    document.getElementById("startButton").style.pointerEvents = "none";
    document.getElementById("AIspeed").style.pointerEvents = "none"
    //document.getElementById("humanStartGameButton").style.pointerEvents = "none"
}
