//var Status = {hit: "hit", miss: "miss", sunk: "sunk" }; found in State.js
var qValues = null;//5 dimensional array of q values for each square given the square and state of that square.
//given square[][]
//given state[]
//each square q value[][]
var lastMove = null;
var lastState = null;
var hitReward = 6;
var learnRate = 0.05;
var totalInitWeight = 10.0;
var discountFactor = 0.8;
var missReward = -1;
var weights = [11.0, 1.0, 3.9, -3.5, 11.0];
var features = [feat2, featAdjacentMisses, hitFeat, featMisses, featHits];
//var f3board = emptyBoard();
//var f3boardTotal = emptyBoard();
function featMisses(state, action){
	return (83 - state.miss.length )/ 83;
}
function featHits(state, action){
	return 1 - state.hit.length / 17;
}

// action: a position that is open to click
function featAdjacentMisses(state, action) {
	var feat = 0;
	//for(var h = 0; h < state.hit.length; h++){
	//	if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
	//		return 0;
	//	}
	//}
	

	var row = action[0];
	var col = action[1];

	var maxShipLength = state.getMaxShipLength();

	// check row right
	var offset = 1.0;
	var offsetX = row + offset;
	var isWithinRange = offsetX < 10 && Math.abs(offset) <= maxShipLength;
	var offsetPos = [offsetX, action[1]];
	while (isWithinRange && state.isMiss(offsetPos)) {
		feat += maxShipLength / Math.abs(offset);
		offset++;
		var offsetX = row + offset;
		var isWithinRange = offsetX < 10 && Math.abs(offset) <= maxShipLength;
		var offsetPos = [offsetX, action[1]];
	}

	// row left
	offset = -1.0;
	offsetX = row + offset;
	isWithinRange = offsetX >= 0 && Math.abs(offset) <= maxShipLength;
	offsetPos = [offsetX, action[1]];
	while (isWithinRange && state.isMiss(offsetPos)) {
		feat += maxShipLength / Math.abs(offset);
		offset--;
		offsetX = row + offset;
		isWithinRange = offsetX >= 0 && Math.abs(offset) <= maxShipLength;
		offsetPos = [offsetX, action[1]];
	}


	// column down
	offset = 1.0;
	var offsetY = col + offset;
	isWithinRange = offsetY < 10 && Math.abs(offset) <= maxShipLength;
	offsetPos = [row, offsetY];
	while (isWithinRange && state.isMiss(offsetPos)) {
		feat += maxShipLength / Math.abs(offset);
		offset++;
		var offsetY = col + offset;
		isWithinRange = offsetY < 10 && Math.abs(offset) <= maxShipLength;
		offsetPos = [row, offsetY];
	}

	// column up
	offset = -1.0;
	offsetY = col + offset;
	isWithinRange = offsetY >= 0 && Math.abs(offset) <= maxShipLength;
	offsetPos = [row, offsetY];
	while (isWithinRange && state.isMiss(offsetPos)) {
		feat += maxShipLength / Math.abs(offset);
		offset--;
		offsetY = col + offset;
		isWithinRange = offsetY >= 0 && Math.abs(offset) <= maxShipLength;
		offsetPos = [row, offsetY];
	}
	//console.log("feat = " + feat);
	return (0 - feat) / maxShipLength;
}

function hitFeat(state, action){
	var sum = 0;
	var maxLen = 0;
	var b = state.getBoard();
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	for(var i = 0 ; i < state.ships.length; i++){
		if (state.ships[i].len > maxLen){
			maxLen = state.ships[i].len;
		}
	}
	for(var i = 0; i < maxLen; i++){
		if(action[1] + i < 10 && action[1] + i >= 0){
			if(ptInArr([action[0], action[1] + i], hitNoSunk)){
				sum += maxLen - i;
			}
		}
		if(action[0] - i < 10 && action[0] - i >= 0){
			if(ptInArr([action[0] - i, action[1]], hitNoSunk)){
				sum += maxLen - i;
			}
		}
		if(action[0] + i < 10 && action[0] + i >= 0){
			if(ptInArr([action[0] + i, action[1]], hitNoSunk)){
				sum += maxLen - i;
			}
		}
		if(action[1] - i < 10 && action[1] - i >= 0){
			if(ptInArr([action[0], action[1] - i], hitNoSunk)){
				sum += maxLen - i;
			}
		}
	}
	return sum / maxLen;
}

	



//number of possible ships in square action in given state
function feat7(state, action){
	var total = 0;
	var feat = 0;
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	for(var s = 0; s < state.ships.length; s++){
		var shipLen = state.ships[s].len;
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				var ship = new Ship(j,i, shipLen, true);
				if(ship.validLoc() && ptInArr(action, ship.getPoints()) && !shipsContainPoints(state.miss, [ship])  && shipsContainPoints(hitNoSunk, [ship]) && !intersectOtherShips(ship, state.sunk)){
					
					feat++;
						
				}
				ship = new Ship(j,i, shipLen, false);
				if(ship.validLoc() && ptInArr(action, ship.getPoints()) && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints(hitNoSunk, [ship]) && !intersectOtherShips(ship, state.sunk)){
					feat++;
					
					
				}
			}
		}
	}
	
	return  feat / 100;
}
function feat6(state, action){
	var feat = 0;
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(hitNoSunk.length == 0){
		for(var s = 0; s < state.ships.length; s++){
			var shipLen = state.ships[s].len;
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					var ship = new Ship(j,i, shipLen, true);
					if(ship.validLoc() && ptInArr(action, ship.getPoints()) && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
						feat++;
						
					}
					ship = new Ship(j,i, shipLen, false);
					if(ship.validLoc() && ptInArr(action, ship.getPoints()) && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([action], [ship]) && !intersectOtherShips(ship, state.sunk)){
						
						feat++;
						
					}
				}
			}
			
		}
	}
	return feat / 100;
}


function feat5(state, action){
	var ret = 0;
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(ptInArr( [action[0], action[1] + 1], hitNoSunk)){
		ret = 1;
	}
	if(ptInArr( [action[0], action[1] - 1], hitNoSunk)){
		ret = 1;
	}
	if(ptInArr( [action[0] + 1, action[1]], hitNoSunk)){
		ret = 1;
	}
	if(ptInArr( [action[0] - 1, action[1]], hitNoSunk)){
		ret = 1;
	}
	return ret;
}


function feat4(state, action){
	var ret = 0;/*
	if(ptInArr( [action[0], action[1] + 1], state.miss)){
		ret -= 1 / state.miss.length;
	}
	if(ptInArr( [action[0], action[1] - 1], state.miss)){
		ret -= 1/ state.miss.length;
	}
	if(ptInArr( [action[0] + 1, action[1]], state.miss)){
		ret -= 1/ state.miss.length;
	}
	if(ptInArr( [action[0] - 1, action[1]], state.miss)){
		ret -= 1/ state.miss.length;
	}
	if(ptInArr( [action[0], action[1] + 1], state.hit)){
		ret += 1/ state.hit.length;
	}
	if(ptInArr( [action[0], action[1] - 1], state.hit)){
		ret += 1/ state.hit.length;
	}
	if(ptInArr( [action[0] + 1, action[1]], state.hit)){
		ret += 1/ state.hit.length;
	}
	if(ptInArr( [action[0] - 1, action[1]], state.hit)){
		ret += 1/ state.hit.length;
		}*/
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(ptInArr( [action[0], action[1] + 1], state.miss)){
		ret -= 1 / state.miss.length;
	}
	if(ptInArr( [action[0], action[1] - 1], state.miss)){
		ret -= 1 / state.miss.length;
	}
	if(ptInArr( [action[0] + 1, action[1]], state.miss)){
		ret -= 1 / state.miss.length;
	}
	if(ptInArr( [action[0] - 1, action[1]], state.miss)){
		ret -= 1 / state.miss.length;
	}
	if(ptInArr( [action[0], action[1] + 1], hitNoSunk)){
		ret = 4;
	}
	if(ptInArr( [action[0], action[1] - 1], hitNoSunk)){
		ret = 4;
	}
	if(ptInArr( [action[0] + 1, action[1]], hitNoSunk)){
		ret = 4;
	}
	if(ptInArr( [action[0] - 1, action[1]], hitNoSunk)){
		ret = 4;
	}
	return ret / 4;

}

//number of times a square has had a hit on it.
function feat3(state, action){
	if(f3boardTotal[action[0]][action[1]] == 0){
		return 0;
	}
	return f3board[action[0]][action[1]] / f3boardTotal[action[0]][action[1]];

}

//number of possible ships in square action in given state
function feat2(state, action){
	var total = 0;
	var feat = 0;
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(hitNoSunk.length == 0){
		for(var s = 0; s < state.ships.length; s++){
			var shipLen = state.ships[s].len;
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					var ship = new Ship(j,i, shipLen, true);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
						total++;
						if(ptInArr(action, ship.getPoints())){
							feat++;
						}
						
					}
					ship = new Ship(j,i, shipLen, false);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([action], [ship]) && !intersectOtherShips(ship, state.sunk)){
						total++;
						if(ptInArr(action, ship.getPoints())){
							feat++;
						}
					}
				}
			}
		}
	}
	else{
		for(var s = 0; s < state.ships.length; s++){
			var shipLen = state.ships[s].len;
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					var ship = new Ship(j,i, shipLen, true);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship])  && shipsContainPoints(hitNoSunk, [ship]) && !intersectOtherShips(ship, state.sunk)){
						total++;
						if(ptInArr(action, ship.getPoints())){
							feat++;
						}
					}
					ship = new Ship(j,i, shipLen, false);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints(hitNoSunk, [ship]) && !intersectOtherShips(ship, state.sunk)){
						total++;
						if(ptInArr(action, ship.getPoints())){
							feat++;
						}
						
					}
				}
			}
		}
	}
	return feat / total;
}
function feat1(state, action){
	var probs = [];
	var doneShips = state.sunk.slice();
	for(var i = 0; i < 10; i++){
		var temp = [];
		for(var j = 0; j < 10; j++){
			temp.push(0);
		}
		probs.push(temp);
	}
	//kindof cheating here still
	var hitNoSunk = [];
	for(var h = 0; h < state.hit.length; h++){
		if(!shipsContainPoint(state.hit[h][0], state.hit[h][1], state.sunk)){
			hitNoSunk.push(state.hit[h].slice());
		}
	}
	if(hitNoSunk.length > 0){
		for(var h = 0; h < hitNoSunk.length; h++){
			for(var s = 0; s < state.ships.length; s++){
				var shipLen = state.ships[s].len;
				for(var i = 0; i < 10; i++){
					for(var j = 0; j < 10; j++){
						var ship = new Ship(j,i, shipLen, true);
						if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([hitNoSunk[h]], [ship]) && !intersectOtherShips(ship, state.sunk)){
							for(var p = 0; p < ship.getPoints().length; p++){
								var x = ship.getPoints()[p][1];
								var y = ship.getPoints()[p][0];
								probs[y][x] += 1;
							}
						}
						var ship = new Ship(j,i, shipLen, false);
						if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && shipsContainPoints([hitNoSunk[h]], [ship]) && !intersectOtherShips(ship, state.sunk)){
							for(var p = 0; p < ship.getPoints().length; p++){
								var x = ship.getPoints()[p][1];
								var y = ship.getPoints()[p][0];
								probs[y][x] += 1;
							}
						}
					}
				}
			}
		}
	}
	else{
		for(var s = 0; s < state.ships.length; s++){
			//console.log(state.ships[s]);
			var shipLen = state.ships[s].len;
			for(var i = 0; i < 10; i++){
				for(var j = 0; j < 10; j++){
					var ship = new Ship(j,i, shipLen, true);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
					   for(var p = 0; p < ship.getPoints().length; p++){
						   var x = ship.getPoints()[p][1];
						   var y = ship.getPoints()[p][0];
						   probs[y][x] += 1;
					   }
					}
					var ship = new Ship(j,i, shipLen, false);
					if(ship.validLoc() && !shipsContainPoints(state.miss, [ship]) && !intersectOtherShips(ship, state.sunk)){
					   for(var p = 0; p < ship.getPoints().length; p++){
						   var x = ship.getPoints()[p][1];
						   var y = ship.getPoints()[p][0];
						   probs[y][x] += 1;
					   }
					}
				}
				
			}
			
		}
	}

	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			if(ptInArr([j,i], state.hit) || ptInArr([j,i], state.miss)){
				probs[j][i] = 0;
			}
		}
	}

	return probs[action[0]][action[1]];
}

function initQLearning(){
	for(var i = 0; i < features.length; i++){
		weights.push(totalInitWeight/features.length);
	}
}

function Q(state, action){
	var sum = 0;
	//console.log(weights);
	
	for(var i = 0; i < features.length; i++){
		sum += weights[i] * features[i](state, action);
	}
	return sum;
}
	

function qlearningAI(state) {
	if(player1WinCount + player2WinCount == 100){
		learnRate = 0.1;
	}
	if(weights.length == 0){
		//console.log("got here");
		initQLearning();
	}
	if(lastMove != null){
		var reward = 0;
		var b = state.getBoard();
		var MaxQ = 0;
		for(var i = 0; i < state.getOpen().length; i++){
			var q = Q(state, state.getOpen()[i]);
			if( q > MaxQ){
				MaxQ = q;
			}
		}
		if(b[lastMove[0]][lastMove[1]] == Status.hit){
			reward = hitReward;
			//update f3board:
			//f3board[lastMove[0]][lastMove[1]]++;
			//f3boardTotal[lastMove[0]][lastMove[1]]++;
		}
		else if(b[lastMove[0]][lastMove[1]] == Status.miss){
			reward = missReward;
			//f3boardTotal[lastMove[0]][lastMove[1]]++;
		}
		var newWeights = [];
		//var sum = 0;
		for(var i = 0; i < weights.length; i++){
			var nw = weights[i] + learnRate * (reward + discountFactor * MaxQ - Q(lastState, lastMove)) * features[i](lastState, lastMove);
			if(nw < 0){
				//nw = totalInitWeight / features.length;
			}
			
			newWeights.push(nw);
			//sum += newWeights[i];
			
		}/*
		if(sum ==0){
			sum = 1;
		}
		for(var i = 0; i < weights.length; i++){
			weights[i] = (newWeights[i] / sum) ;
		}
		if(weights[0] != 1){
				console.log("error here");
				console.log(newWeights);
				console.log(weights);
		}*/
		weights = newWeights;
		console.log("weights = ");
		console.log(weights);
	}


	var MaxQ = Number.MIN_SAFE_INTEGER;
	best = [0,0];
	for(var i = 0; i < state.getOpen().length; i++){
		var q = Q(state, state.getOpen()[i]);
		//console.log(q);
		if(q == MaxQ){
			best.push(state.getOpen()[i]);
		}
		if( q > MaxQ){
			MaxQ = q;
			best = [state.getOpen()[i]];
		}
	}
	//console.log(best);
	lastMove = best[Math.floor((Math.random() * best.length))];
	lastState = state;
	return lastMove;
}










	
	/*if(qValues == null){
		initQLearning();
	}


	console.log("qvals = ");
	console.log(qValues);*/
	// TODO
	//assumes lastmove holds: [y,x], checks result on board. null if there was no last move.
	//if(lastMove != null){
		//update q-values
		/*
		for(var i = 0; i < 10; i++){
			var yg = [];
			for(var j = 0; j < 10; j++){
				var xg = [];
				for(var k = 0; k < 4; k++){
					var s = [] ;
					for(var l = 0;l < 10; l++){
						var yo = [];
						for(var m = 0; m < 10; m++){
						}
					}
				}
			}
		}*/
		/*
		if(ptInArr(lastMove, state.hit)){
			var q = qvalues[lastMove[0]][lastMove[1]][hit];
			for(var i = 0; i < state.hit.length; i++){
				if(lastMove[0] != state.hit[i][0] || lastMove[1] != state.hit[i][1]){
					var oldQVal = q[state.hit[i][0]][state.hit[i][1]];
					q[state.hit[i][0]][state.hit[i][1]] += learnRate * ( hitReward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				}
			}
			for(var i = 0; i < state.miss.length; i++){
				if(lastMove[0] != state.miss[i][0] || lastMove[1] != state.hit[i][1]){
					var oldQVal = q[state.hit[i][0]][state.hit[i][1]];
					q[state.hit[i][0]][state.hit[i][1]] += learnRate * ( hitReward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				}
			}*/

		/*	
		for(var i = 0; i < 10; i++){			
			for(var j = 0; j < 10; j++){					
				var b = state.getBoard();
				var reward = 0;
				if(b[i][j] == Status.hit){
					reward = hitReward;
				}
				else if(b[i][j] == Status.miss){
					reward = missReward;
				}
				var oldQVal = qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]];
				qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				oldQVal = qValues[lastMove[0]][lastMove[1]][b[i][j]][i][j];
				qValues[lastMove[0]][lastMove[1]][b[i][j]][i][j] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );		
				
			}
		}
	}
	console.log("qvals = ");
	console.log(qValues);
	var sum = emptyBoard();
	//console.log("state = ");
	//console.log(state);

	var hitNoSink = [];
	for(var i = 0; i < state.hit.length; i++){
		if(!shipsContainPoints(state.hit[i][0], state.hit[i][1], state.sunk)){
			hitNoSink.push(state.hit[i].slice());
		}
	}
	//if(hitNoSink == []){
	
	//get the sum of the hit q-values
	for(var i = 0; i < hitNoSink.length; i++){
		sum = sumBoard(sum, qValues[hitNoSink[i][0]][hitNoSink[i][1]][Status.hit]);
	}
	for(var i = 0; i < state.miss.length; i++){
		//console.log(state.miss[i]);
		sum = sumBoard(sum, qValues[state.miss[i][0]][state.miss[i][1]][Status.miss]);
	}
	for(var i = 0; i < state.sunk.length; i++){
		for(var j = 0; j < state.sunk[i].len; j++){
			sum = sumBoard(sum, qValues[state.sunk[i].getPoints()[j][0]][state.sunk[i].getPoints()[j][1]][Status.sunk]);
		}
	}
	//console.log(state.getOpen());
	for(var i = 0; i < state.getOpen().length; i++){
		//console.log(state.getOpen()[i]);
		sum = sumBoard(sum, qValues[state.getOpen()[i][0]][state.getOpen()[i][1]][Status.unknown]);
	}*/
	//}
	/*else{
		for(var i = 0; i < hitNoSink.length; i++){
			sum = sumBoard(sum, qValues[hitNoSink[i][0]][hitNoSink[i][1]][Status.hit]);
		}
		}*/
	/*for(var i = 0; i < hitNoSink.length; i++){
		sum = multBoard(sum, hitModifier(hitNoSink[i]));
	}
	console.log("sum = ");
	console.log(sum);
	*/

/*
	//learn
	if(lastMove != null){
		var reward = 0;
		var b = state.getBoard();
		if(b[lastMove[0]][lastMove[1]] == Status.hit){
			reward = hitReward;
		}
		else if(b[lastMove[0]][lastMove[1]] == Status.miss){
			reward = missReward;
		}

		for(var i = 0; i < 10; i++){			
			for(var j = 0; j < 10; j++){					
				var oldQVal = qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]];
				qValues[i][j][b[i][j]][lastMove[0]][lastMove[1]] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );//first oldQVal sholud be replaced with estiamte of optimal value
				//oldQVal = qValues[lastMove[0]][lastMove[1]][b[i][j]][i][j];
				//qValues[lastMove[0]][lastMove[1]][b[i][j]][i][j] += learnRate * ( reward + (discountFactor * oldQVal - oldQVal) );		
				
			}
		}
	}
		
	var sum = emptyBoard();
	
	var hitNoSink = [];
	for(var i = 0; i < state.hit.length; i++){
		if(!shipsContainPoints(state.hit[i][0], state.hit[i][1], state.sunk)){
			hitNoSink.push(state.hit[i].slice());
		}
	}
	
	//get the sum of the hit q-values
	for(var i = 0; i < hitNoSink.length; i++){
		sum = sumBoard(sum, qValues[hitNoSink[i][0]][hitNoSink[i][1]][Status.hit]);
	}
	if(hitNoSink == []){
		for(var i = 0; i < state.miss.length; i++){
			//console.log(state.miss[i]);
			sum = sumBoard(sum, qValues[state.miss[i][0]][state.miss[i][1]][Status.miss]);
		}
	}/*
	for(var i = 0; i < state.sunk.length; i++){
		for(var j = 0; j < state.sunk[i].len; j++){
			sum = sumBoard(sum, qValues[state.sunk[i].getPoints()[j][0]][state.sunk[i].getPoints()[j][1]][Status.sunk]);
		}
	}
	//console.log(state.getOpen());
	for(var i = 0; i < state.getOpen().length; i++){
		//console.log(state.getOpen()[i]);
		sum = sumBoard(sum, qValues[state.getOpen()[i][0]][state.getOpen()[i][1]][Status.unknown]);
	}*/
	//}















	/*
	var bestVal = Number.MIN_SAFE_INTEGER;
	var best = [0,0];
	for(var i = 0 ; i < 10; i++){
		for(var j = 0 ; j < 10; j++){
			if(bestVal < sum[i][j] && ptInArr([i,j], state.getOpen())){
				best = [i,j];
				bestVal = sum[i][j];
			}
		}
	}
	//console.log(best);
	lastMove = best;
	return best;
	//createpossible states for each square - hit, miss, unknown, sunk
//	return randAI(state);
}
*/

//function to get the possible ship locations given hits&misses

function hitModifier(point){
	var ret = emptyBoard();
	for(var i = 1; i < 5; i++){
		if(point[0] - i >= 0){
			ret[point[0] - i][point[1]] = 10 / i;
		}
		if(point[0] + i < 10){
			ret[point[0] + i][point[1]] = 10 / i;
		}
		if(point[1] - i >= 0){
			ret[point[0]][point[1] - i] = 10 / i;
		}
		if(point[1] + i < 10){
			ret[point[0]][point[1] + i] = 10 / i;
		}
	}
	return ret;
}
function sumBoard(arr2D1, arr2D2){
	var ret = emptyBoard();
	for(var i = 0; i < arr2D1.length; i++){
		for(var j = 0; j < arr2D1[i].length; j++){
			ret[i][j] = arr2D1[i][j] + arr2D2[i][j];
		}
	}
	return ret;
}
function multBoard(arr2D1, arr2D2){
	var ret = emptyBoard();
	for(var i = 0; i < arr2D1.length; i++){
		for(var j = 0; j < arr2D1[i].length; j++){
			ret[i][j] = arr2D1[i][j] * arr2D2[i][j];
		}
	}
	return ret;
}
function emptyBoard(){
	var ret = [];
	for(var i = 0; i < 10; i++){
		var innerRet = [];
		for(var j = 0; j < 10; j++){
			innerRet.push(0);
			}
		ret.push(innerRet);
	}
	return ret;
}

