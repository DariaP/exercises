function transform(regexp) {
	var content = [],
		prevOpening = null;

	for (var i = 0  ; i < regexp.length ; ++i) {
		var c = regexp[i];
		if (c === "(") {
			var newOpening = {c: c, i: i, prev: prevOpening};
			content.push(newOpening);
			prevOpening = newOpening;
		} else if (c === ")") {
			var newClosing = {c: c, i: i, open: prevOpening};
			content.push(newClosing);
			prevOpening.close = newClosing;
			prevOpening = prevOpening.prev;
			newClosing.open.prev = null;
		} else if (c === "|") {
			prevOpening.type = "|";
			content.push({c: c, i: i});
		} else if (c === "*") {
			prevOpening.type = "*";
			content.push({c: c, i: i});
		} else {
			content.push({c: c, i: i});
		}
	}

	/*for (var i = 0 ; i < content.length ; ++i) {
		var next = content[i];
		//console.log(next);
		if (next.c === "(") {
			console.log(getContent(content, i));
		}
	}

	function getContent(content, i) {
		var res = "",
			end = next.close;
		while (next !== end) {
			res += next.c;
			next = content[++i];
		}
		res += end.c;
		return res;
	}*/
	console.log(content);
}

function kleeneStars() {
	var states = [],
		n = 4;

	for (var i = 0 ; i < n ; ++i) {
		states.push({ i: i, links: [] });
	}

	states[0].links.push({e: [s1, s3]});
	states[2].links.push({e: [s1, s3]});

	return {
		//entry: graph,
		//exit: ,
		setP: function(P) {
			states[1].links = P.links;
			P.forEach(function(state) {
				state.i += n;
				states.push(state);
			});
		},
		forEach: function(callback) { states.forEach(callback); }
	};
}

function concat() {
	var states = [],
		n = 2;

	for (var i = 0 ; i < n ; ++i) {
		states.push({ i: i, links: [] });
	}

	states[0].links.push({e: [s1, s3]});
	states[2].links.push({e: [s1, s3]});

	return {
		//entry: graph,
		//exit: ,
		setP: function(P) {
			states[1].links = P.links;
			P.forEach(function(state) {
				state.i += n;
				states.push(state);
			});
		},
		forEach: function(callback) { states.forEach(callback); }
	};
}

module.exports = transform;

