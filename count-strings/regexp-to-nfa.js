var regexpTree = require('./regexp-tree.js');

function buildNfa(regexp) {
	var tree = regexpTree(regexp);

	var nfa = transformHelper(tree);

	function transformHelper(tree) {
		var nextPiece;
		if (tree.type === "+") {
			nextPiece = contatenation();
		} else if (tree.type === "|") {
			nextPiece = alternation();
		} else if (tree.type === "*") {
			nextPiece = star();
			nextPiece.setInner(transformHelper(tree.children[0]));
		} else {
			nextPiece = node(tree.type);
		}

		if (tree.type === "+" || tree.type === "|") {
			var inner1 = transformHelper(tree.children[0]);
			var inner2 = transformHelper(tree.children[1]);
			nextPiece.setInners(inner1, inner2);
		}

		return nextPiece;
	}

	indexNodes(nfa);
	return convertTreeToAdjList(nfa);
}

function indexNodes(nfa) {
	var nodes = [nfa.head()], idx = 0;
	while(nodes.length !== 0) {
		var nextNode = nodes.pop();
		nextNode.idx = idx++;
		for (var linkType in nextNode.links) {
			nextNode.links[linkType].forEach(function(node) {
				if (!node.idx) {
					nodes.push(node);					
				}
			});
		}
	}
}

function convertTreeToAdjList(nfa) {
	var adjList = {}, 
		nodes = [nfa.head()], 
		visited = [];

	adjList.finite = nfa.finite().idx;

	while(nodes.length !== 0) {
		var nextNode = nodes.pop();

		adjList[nextNode.idx] = {};

		for (var linkType in nextNode.links) {
			adjList[nextNode.idx][linkType] = [];

			nextNode.links[linkType].forEach(function(node) {
				adjList[nextNode.idx][linkType].push(node.idx);

				if (!visited[node.idx]) {
					nodes.push(node);
					visited[node.idx] = true;					
				}
			});
		}
	}
	return adjList;
}

function node(value) {
	var states = [{ links: {}}, { links: {} }];
	states[0].links[value] = [states[1]];

	return {
		head: function() {
			return states[0];
		},
		setNext: function(node) {
			states[1].links = node.links;
		},
		finite: function() {
			return states[1];
		}
	}
}

function star() {
	var states = [],
		n = 4;

	for (var i = 0 ; i < n ; ++i) {
		states.push({ links: {} });
	}

	states[0].links['e'] = [states[1], states[3]];
	states[2].links['e'] = [states[1], states[3]];

	return {
		setInner: function(inner) {
			states[1].links = inner.head().links;
			inner.setNext(states[2]);
		},
		head: function() {
			return states[0];
		},
		setNext: function(node) {
			states[n - 1].links = node.links;
		},
		finite: function() {
			return states[n - 1];
		}
	};
}

function contatenation() {
	var head = null,
		finite = null;

	var setNextHelper = function() {};
	return {
		setInners: function(inner1, inner2) {
			head = inner1.head();
			finite = inner2.finite();
			inner1.setNext(inner2.head());
			setNextHelper = inner2.setNext;
		},
		head: function() {
			return head;
		},
		setNext: function(node) {
			setNextHelper(node);
		},
		finite: function() {
			return finite;
		}
	};
}

function alternation() {
	var states = [],
		n = 6;

	for (var i = 0 ; i < n ; ++i) {
		states.push({ links: {} });
	}

	states[0].links['e'] = [states[1], states[3]];
	states[2].links['e'] = [states[5]];
	states[4].links['e'] = [states[5]];

	return {
		setInners: function(inner1, inner2) {
			states[1].links = inner1.head().links;
			inner1.setNext(states[2]);
			states[3].links = inner2.head().links;
			inner2.setNext(states[4]);
		},
		head: function() {
			return states[0];
		},
		setNext: function(node) {
			states[n - 1].links = node.links;
		},
		finite: function() {
			return states[n - 1];
		}
	};
}

module.exports = buildNfa;

