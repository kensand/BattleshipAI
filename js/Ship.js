
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
Ship.prototype.containsPoint = function(y,x){
    for(var i = 0; i < this.len; i++){
	if(this.getPoints()[i][0] == y && this.getPoints()[i][1] == x){
	    return true;
	}
    }
    return false;
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

function intersectOtherShips(Ship, otherShipsArr){
    for(var i = 0; i < otherShipsArr.length; i++){
	if(Ship.overlaps(otherShipsArr[i])){
	    
	    return true;
	}
    }
    return false;
}

function shipsContainPoint(y,x,ships){
    for(var i = 0; i < ships.length;i++){
	if(ships[i].containsPoint(y,x)){
	    return true;
	}
    }
    return false;
}

function randGenShips(){
    var ships = [];
    var shiplens = [2,3,3,4,5];
    while(shiplens.length > 0){
	var randx = Math.floor((Math.random() * 10));
	var randy = Math.floor((Math.random() * 10));
	var randHor = Math.floor((Math.random() * 2));
	var ship = new Ship(randx, randy, shiplens[0], randHor);
	if(ship.validLoc() && !intersectOtherShips(ship, ships)){
	    ships.push(ship);
	    shiplens.splice(0,1);
	}
    }
    return ships;
}
	
