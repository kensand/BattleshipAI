function randAI(state){
	var open = state.getOpen();
	//console.log(open);
	return open[Math.floor((Math.random() * open.length))];
}
//these should probably be made to only take hit miss and sunk from state for fairness...
function idealAI(state){
	var probs = [];
	var doneShips = state.sunk.slice();
	for(var i = 0; i < 10; i++){
		var temp = [];
		for(var j = 0; j < 10; j++){
			temp.push(0);
		}
		probs.push(temp);
	}
	for(var s = 0; s < state.ships.length; s++){
		//comes close to cheating here
		var sLen = state.ships[s].getPoints().length;

		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				var tempShip = new Ship(i,j,sLen, true);
				if(tempShip.validLoc() && !intersectOtherShips(tempShip, doneShips)){
					for(var k = 0; k < tempShip.getPoints().length; k++){
						var x = tempShip.getPoints()[k][1];
						var y = tempShip.getPoints()[k][0];
						probs[y][x] += 1;
					}
				}
				tempShip = new Ship(i,j,sLen, false);
				if(tempShip.validLoc() && !intersectOtherShips(tempShip, doneShips)){
					var misses = false;
					for(var m = 0; m < state.miss.length; m++){
						if(tempShip.containsPoint(state.miss[m][0], state.miss[m][1])){
							misses = true;
						}
					}
					if(!misses){
						for(var k = 0; k < tempShip.getPoints().length; k++){
							var x = tempShip.getPoints()[k][1];
							var y = tempShip.getPoints()[k][0];
							probs[y][x] += 1;
						}
					}
				}
			}
		}
	}

	for(var i = 0; i < state.hit.length; i++){
		var x = state.hit[i][1];
		var y = state.hit[i][0];
		var newx = x;
		var newt = y;
		probs[y][x] = 0;
		if(!shipsContainPoint(y,x,state.sunk)){
			newx = x - 1;
			newy = y;
			if(newx >= 0 && newx < 10 && newy >= 0 && newy < 10){
				probs[newy][newx] *= 2;
			}
			newx = x;
			newy = y - 1;
			if(newx >= 0 && newx < 10 && newy >= 0 && newy < 10){
				probs[newy][newx] *= 2;
			}
			newx = x + 1;
			newy = y;
			if(newx >= 0 && newx < 10 && newy >= 0 && newy < 10){
				probs[newy][newx] *= 2;
			}
			newx = x;
			newy = y + 1;
			if(newx >= 0 && newx < 10 && newy >= 0 && newy < 10){
				probs[newy][newx] *= 2;
			}
		}
	}
	for(var i = 0; i < state.miss.length; i++){
		var x = state.miss[i][1];
		var y = state.miss[i][0];
		probs[y][x] = 0;
	}
	var bestVal = 0;
	var best = [0,0];
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			if(probs[i][j] > bestVal){
				bestVal = probs[i][j];
				best = [i,j];
			}
		}
	}
	console.log("best = " + best + ", bestVal = " + bestVal);
	return best;

}
