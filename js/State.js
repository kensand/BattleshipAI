//State object constructor
var Status = { error: "error", hit: "hit", miss: "miss", sunk: "sunk" };
function State(hits, misses, shiplist, sunk){

	this.hit = hits.slice();
	this.miss = misses.slice();
	this.ships = shiplist.slice();
	this.sunk = sunk.slice();
}

State.prototype.getMaxShipLength = function () {
	var maxShipLength;
	for (var i = 0; i++; i < this.ships.length) {
		maxShipLength =  this.ships[i];
	}
	return maxShipLength;
}

State.prototype.getOpen = function(){
	var open = [];
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			var inhit = false;
			var inmiss = false;
			for(k = 0; k < this.hit.length; k++){
				if(this.hit[k][0] == i && this.hit[k][1] == j){
					inhit = true;
				}
			}
			if(!inhit){
				for(k = 0; k < this.miss.length; k++){
					if(this.miss[k][0] == i && this.miss[k][1] == j){
						inmiss = true;
					}
				}
			}
			if(!inhit && !inmiss){
				open.push([i,j]);
			}/*
			 if(this.hit.indexOf([i,j]) < 0 && this.miss.indexOf([i,j]) < 0){
			 open.push([i,j]);
			 }*/
		}
	}
	return open;
}

State.prototype.getBoard = function(){
	var ret = [];
	for(var i = 0; i < 10; i++){
		var retI = [];
		for(var j = 0; j < 10; j++){
			retI.push(Status.unknown);
		}
		ret.push(retI);
	}
	for(var i= 0; i < this.hit.length; i++){
		ret[this.hit[i][0]][this.hit[i][1]] = Status.hit;
	}
	for(var i= 0; i < this.miss.length; i++){
		ret[this.miss[i][0]][this.miss[i][1]] = Status.miss;
	}
	for(var i= 0; i < this.sunk.length; i++){
		for(var j= 0; j < this.sunk[i].len; j++){
			ret[this.sunk[i].getPoints()[j][0]][this.sunk[i].getPoints()[j][0]] = Status.sunk;
		}
	}
	return ret;
}

State.prototype.isMiss = function(position){
	return ptInArr(position, this.miss);
}

State.prototype.shoot = function(point){
	if(shipsContainPoint(point[0], point[1], this.sunk)){
		return Status.error;
	}
	else if(shipsContainPoint(point[0], point[1], this.ships)){
		this.hit.push(point);

		for(var i = 0; i < this.ships.length; i++){
			var s = this.ships[i];
			var count = 0;
			if(s.containsPoint(point[0], point[1])){
				for(var j = 0; j < s.getPoints().length; j ++){
					var pt = s.getPoints()[j];
					for(var k = 0; k < this.hit.length; k++){
						h = this.hit[k];
						if(h[0] == pt[0] && h[1] == pt[1]){
							count++;
						}
					}
				}
				if(count == s.getPoints().length){

					this.sunk.push(s);
					this.ships.splice(i,1);
					//console.log("ship sunk, ships left: " + this.ships.length);
					//i--;
					return Status.hit;
				}
			}
		}
		return Status.hit;
	}


	/*
	 //TODO more efficient sunk checking
	 for(i = 0; i < this.ships.length; i++){
	 var s = this.ships[i];
	 var hits = 0;
	 for(j = 0; j < s.getPoints().length; j++){
	 var pt = s.getPoints()[j];
	 if(this.hit.indexOf(pt) > -1){
	 hits++;
	 console.log("found matching hit");
	 }
	 }
	 if(hits == s.getPoints().length){

	 this.sunk.push(s);
	 this.ships.splice(i,1);
	 console.log("ship sunk, ships left: " + this.ships.length);
	 i--;
	 }
	 }

	 //TODO sunk checking
	 return Status.hit;
	 }*/
	else{
		this.miss.push(point);
		return Status.miss;
	}

}



State.prototype.isEndState = function(){
	//console.log(this.ships.length);
	//console.log(this.sunk.length);
	if(this.ships.length == 0){
		return true;
	}
	return false;
}


//state copy constructor
/*
 function State(state){

 this.hit = state.hit.slice();
 this.miss = state.miss.slice();
 this.boats = state.boats.slice();
 this.sunk = state.sunk.slice();
 }*/
