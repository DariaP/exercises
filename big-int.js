var lowerDigitsNum = 9,
	lowerMax = Math.pow(10, lowerDigitsNum) - 1;

function bigInt(input) {

	var higher = 0, 
		lower = 0;

	if (input) {
		higher = input.higher;
		lower = input.lower;
	}

	return {
		higher: function() {
			return higher;
		},
		lower: function() {
			return lower;
		},
		parse: function(strValue) {
			if (strValue.length <= lowerDigitsNum) {
				lower = parseInt(strValue);
			} else {
				var lowerDigitsStart = strValue.length - lowerDigitsNum;
				lower = parseInt(strValue.substr(lowerDigitsStart, lowerDigitsNum));
				higher = parseInt(strValue.substr(0, lowerDigitsStart));
			}
			return this;
		},
		toString: function() {
			return "" + higher + " " + lower;
		}
	}
}

function add(left, right) {

	var resultLower = left.lower() + right.lower(),
		resultHigher = left.higher() + right.higher();

	if (resultLower > lowerMax) {
		resultHigher++;
		resultLower = resultLower - (lowerMax + 1);
	}

	return bigInt({
		higher: resultHigher,
		lower: resultLower
	});
}

function sub(left, right) {

	var resultLower = left.lower() - right.lower(),
		resultHigher = left.higher() - right.higher();

	if (resultLower < 0) {
		resultHigher--;
		resultLower = resultLower + (lowerMax + 1);
	}

	if (resultHigher < 0) {
		return null;
	} else {
		return bigInt({
			higher: resultHigher,
			lower: resultLower
		});		
	}
}

function mul(left, right) {
	var resultLower = left.lower() * right.lower(),
		resultHigher = left.higher() * right.lower() + 
					   left.lower() * right.higher() +
					   left.higher() * right.higher() * (lowerMax + 1);

	if (resultLower > lowerMax) {
		resultHigher += Math.floor(resultLower / (lowerMax + 1));
		resultLower = resultLower % (lowerMax + 1);
	}

	return bigInt({
		higher: resultHigher,
		lower: resultLower
	});	
}

function mulBigIntToInt(leftBigInt, rightInt) {
	var resultLower = leftBigInt.lower() * rightInt,
		resultHigher = leftBigInt.higher() * rightInt;

	if (resultLower > lowerMax) {
		resultHigher += Math.floor(resultLower / (lowerMax + 1));
		resultLower = resultLower % (lowerMax + 1);
	}

	return bigInt({
		higher: resultHigher,
		lower: resultLower
	});	
}

function smaller(left, right) {
	return (right.higher() > left.higher() || 
	  (right.higher() === left.higher() && right.lower() > left.lower()));
}

function bigger(left, right) {
	return (right.higher() < left.higher() || 
	  (right.higher() === left.higher() && right.lower() < left.lower()));
}

function div(left, right) {

	if(right.higher() > left.higher() || 
	  (right.higher() === left.higher() && right.lower() > left.lower())) {
  		return bigInt({
  			higher: 0,
  			lower: 0
  		});
	}

	if (right.higher() > 0) {
		var estimate = Math.floor(left.higher() / right.higher());

		if (divEstimateTooBig(left, right, estimate)) {

			var step = Math.floor(estimate / 2),
				continueAdjusting = true;

			while (continueAdjusting) {
				//console.log(step);
				if (step < 1) {
					break;
				}
				if (divEstimateTooBig(left, right, estimate)) {
					estimate = estimate - step;
					step = Math.floor(step / 2);
				} else if (divEstimateTooSmall(left, right, estimate)) {
					estimate = estimate + step;
					step = Math.floor(step / 2);
				} else {
					continueAdjusting = false;
				}
			}

		}

  		return bigInt({
  			higher: 0,
  			lower: Math.floor(estimate)
  		});

	} else {
		var resultHigher = Math.floor(left.higher() / right.lower()),
			higherRemainder = left.higher() % right.lower(),
		    resultLower = Math.floor(
		    	(higherRemainder * (lowerMax + 1) + left.lower()) / right.lower()
		    );
  		
  		return bigInt({
  			higher: resultHigher,
  			lower: resultLower
  		});
	}
}

function divEstimateTooBig(left, right, estimate) {
	var product = mulBigIntToInt(right, estimate);
	return smaller(left, product);
}

function divEstimateTooSmall(left, right, estimate) {
	var product = mulBigIntToInt(right, estimate),
		remainder = sub(left, product);

	return bigger(remainder, bigInt({higher: 0, lower: estimate}));
}

function mod(number, modBase) {
	var quotient = div(number, modBase);
	return sub(number, mul(quotient, modBase));
}

module.exports = {
	add: add,
	sub: sub,
	mul: mul,
	div: div,
	smaller: smaller,
	bigger: bigger,
	bigInt: bigInt
}