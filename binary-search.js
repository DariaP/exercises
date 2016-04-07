function find(array, value) {
	var start = 0, end = array.length - 1;
	while (start <= end) {
		var middle = Math.floor((end + start) / 2);
		if (array[middle] === value) {
			return middle;
		} else if (array[middle] > value) {
			end = middle - 1;
		} else {
			start = middle + 1;
		}
	}
	return -1;
}

function findClosest(array, value) {
	var start = 0, end = array.length - 1;
	while (start <= end) {
		var middle = Math.floor((end + start) / 2);
		if (array[middle] === value) {
			return middle;
		} else if (array[middle] > value) {
			end = middle - 1;
		} else {
			start = middle + 1;
		}
	}
	return start;
}

module.exports = {
	find: find,
	findClosest: findClosest
};
