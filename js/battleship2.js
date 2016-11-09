//The previous version was getting too messy, and I realized I screwed up a couple times... this is my next attempt lol
var container = null;
var human = true;
var selectShipHoriz = true;
var selectShipButton = null;
var selectShip = null;
var selectShipLen = null;
var b2Ships = [];




//Ship object
function Ship(x, y, len, horiz){
    this.x = x;
    this.y = y;
    this.len = len;
    this.horiz = horiz;
}
Ship.prototype.validLoc = function(){
    if(this.horiz){
	if(this.x + this.len <= 10){
	    return true;
	}
	else{
	    return false
	}
    }
    else{
	if(this.y + this.len <= 10){
	    return true;
	}
	else{
	    return false
	}
    }
}
Ship.prototype.getPoints = function(){
    var ret = [];
    for(var i = 0; i < this.len; i++){
	if(this.horiz){
	    ret.push([this.y,this.x + i]);
	}
	else{
	    ret.push([this.y+i,this.x]);
	}
    }
    return ret;
}

Ship.prototype.overlaps = function(ship){
    var pts = ship.getPoints();
    
    //console.log("these.getPoints() = " + this.getPoints());
    //console.log("pts = " + pts);
    for(var i= 0; i < pts.length; i++){
	//console.log("pts[i] = " + pts[i])
	for(var j = 0; j < this.getPoints().length; j++){
	    //console.log("pts[i] = " + pts[i] + "this.getPoints()[j] = " + this.getPoints()[j]);
	    //console.log("this.getPoints()[j] == pts[i] = " + this.getPoints()[j][0] == pts[i][0] && this.getPoints()[j][1] == pts[i][1] );
	    if(this.getPoints()[j][0] == pts[i][0] && this.getPoints()[j][1] == pts[i][1]){
		return true;
	    }
	}
    }
    return false;
}


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
	    tempDiv1.onclick = buttonClick;
	    tempDiv2.onclick = buttonClick;
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
    var temp = document.createElement("div");
    temp.id = "toggle";
    temp.className = "toggle-down";    
    temp.innerHTML = "Player 2 AI is OFF";
    temp.onclick = toggleHuman;
    toggleAI.appendChild(temp); 

    
    
    
    //setup ship select bar
    
    var shipSelect = document.createElement("div");
    shipSelect.id= "shipSelect"

    var temp = document.createElement("p");

    temp.innerHTML += "Carrier";
    temp.id = "Carrier";
    temp.onclick = selectClick;
    //console.log(temp.innerHTML);
    shipSelect.appendChild(temp);
    //console.log(temp.innerHTML);

    temp = document.createElement("p");
    temp.innerHTML = "Battleship";
    temp.id = "Battleship";
    temp.onclick = selectClick;
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.innerHTML = "Submarine";
    temp.id="Submarine";
    temp.onclick = selectClick;
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.innerHTML = "Destroyer";
    temp.id = "Destroyer";
    temp.onclick = selectClick;
    shipSelect.appendChild(temp);

    temp = document.createElement("p");
    temp.id = "Patrol";
    temp.onclick = selectClick;
    temp.innerHTML = "Patrol Boat";
    shipSelect.appendChild(temp);

    temp = document.createElement("button");
    temp.onclick = rotateShip;
    temp.innerHTML = "Rotate Ship";
    shipSelect.appendChild(temp);

    container.appendChild(shipSelect);
    container.appendChild(toggleAI);
    
}





function buttonClick(){
    //console.log(this.id);
    this.style.backgroundColor = "#000000";
}

function rotateShip(){
    selectShipHoriz = !selectShipHoriz;
    setPlacementOnHovers(selectShipLen, selectShipHoriz);
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
	selectShipButton.style.color = "black";	    
    }
    if(selectShipButton == this){
	selectShipButton = null;
	selectShip = null;
    }
    else if(this.id == "Carrier"){
	selectShipButton = this;
	setPlacementOnHovers(5, selectShipHoriz);
	 //   console.log("got here");
    }
    else if(this.id == "Battleship"){
	
	
		
	selectShipButton = this;
	setPlacementOnHovers(4, selectShipHoriz);
	
    }
    else if(this.id == "Submarine"){
	
	
		
	selectShipButton = this;
	setPlacementOnHovers(3, selectShipHoriz);
//	    console.log("got here");
    }
    else if(this.id == "Destroyer"){
	
	
		
	selectShipButton = this;
	setPlacementOnHovers(3, selectShipHoriz);
	 //   console.log("got here");
    }
    else if(this.id == "Patrol"){
	
	
		
	selectShipButton = this;
	setPlacementOnHovers(2, selectShipHoriz);
//	    console.log("got here");
    }
}







function removeOnHovers(){
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById("2:" + i.toString() + "," + j.toString());
	    e.onmouseenter = null;
	    
	    e.onmouseleave = null;
	    
	    e.onclick = null;
	}
    }
}

function intersectOtherShips(Ship, otherShipsArr){
    for(var i = 0; i < otherShipsArr.length; i++){
	if(Ship.overlaps(otherShipsArr[i])){
	    
	    return true;
	}
    }
    return false;
}

function setPlacementOnHovers(length, horiz){
    selectShipLen = length;
    for(var i = 0; i < 10; i++){
	for(var j = 0; j < 10; j++){
	    var e = document.getElementById("2:" + i.toString() + "," + j.toString());
	    e.onmouseenter = function(){
		
		var x = xId(this.id);
		var y = yId(this.id);
		var ship = new Ship(x,y,length, horiz);
		//console.log(horiz);
		if(!intersectOtherShips(ship, b2Ships)){
		    console.log("doesn't intersect");
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
	    };
	    e.onmouseleave = function(){
		
		
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
	    };



	    e.onclick = function(){
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
			removeOnHovers();
			if(b2Ships.length == 5){
			    //start game
			}
			    
		    }
		}
	    };
	    
	}
    }
}




















toggleHuman = function(){
    var tog = document.getElementById("toggle");
    var ss = document.getElementById("shipSelect");
    if(!human){
	tog.className = "toggle-down";
	tog.innerHTML = "Player 2 AI is OFF";
	//ss.style.display = "block";
	ss.style.opacity = "1.0";
	ss.style.pointerEvents = "auto";
	human = true;
    }
    else{
	tog.className = "toggle-up";
	human = false;
	//ss.style.display = "none";
	ss.style.opacity = "0.5";
	ss.style.pointerEvents = "none";
	tog.innerHTML = "Player 2 AI is ON";
	board2.pointerEvents = "none";
	if(selectShipButton != null){
	    selectShipButton.style.color = "black";
	    selectShipButton = null;
	    selectShipLen = null;
	    selectShip = null;
	}
    }
}






initGui();
