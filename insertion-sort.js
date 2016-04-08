function processData(input) {
    var t = parseInt(input[0]);
    for (var i = 0 ; i < t ; ++i) {
    	var values = input[i * 2 + 2].trim().split(" ")
    		.map(function(str) { return parseInt(str); });
    	console.log(count(values));
    	//console.log(values)
    }
} 

function count(values) {
	return countInSubarray(0, values.length - 1);

	function countInSubarray(start, end) {
		if (start === end) {
			return 0;
		}
		if((start + 1) === end) {
			if (values[start] > values[end]) {
				swap(start, end);
				return 1;
			} else {
				return 0;
			}
		}

		var middle = Math.floor((start + end) / 2),
			res = 0;

		res += countInSubarray(start, middle);
		res += countInSubarray(middle + 1, end);
		res += merge(start, middle, end);

		return res;
	}

	function swap(i, j) {
		var buff = values[i];
		values[i] = values[j];
		values[j] = buff;
	}

	function merge(start, middle, end) {
		var bufferArray = [],
			k = 0;
			i = start,
			j = middle + 1,
			pairsNum = 0;

		while(i <= middle && j <= end) {
			if (values[i] <= values[j]) {
				pairsNum += (j - (middle + 1));
				bufferArray[k++] = values[i++];
			} else {
				bufferArray[k++] = values[j++];
			}
		}
		while(i <= middle) {
			if (values[middle + 1] !== values[i]) {
				pairsNum += (end - (middle + 1) + 1);
			}
			bufferArray[k++] = values[i++];
		}
		while(j <= end) {
			bufferArray[k++] = values[j++];
		}


		for (i = 0 ; i < bufferArray.length ; ++i) {
			values[start + i] = bufferArray[i];
		}

		return pairsNum;
	}
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input.split("\n"));
});
