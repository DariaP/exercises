function processData(input) {
    var n = parseInt(input[0][0]),
    	t = parseInt(input[0][1]),
    	links = [];

    for (var i = 1 ; i < input.length ; ++i) {
    	links.push([parseInt(input[i][0]), parseInt(input[i][1])]);
    }

    var tree = buildTree(links, n);
    console.log(count(tree.start, tree.nodes, t));
} 

function buildTree(links, n) {

	var tree = {
		start: links[0][0] - 1,
		nodes: []
	}

	for (var i = 0 ; i < n ; ++i) {
		tree.nodes[i] = {
			parent: null,
			children: []
		}
	}

	for (var i = 0 ; i < links.length ; ++i) {
		var link = links[i];
		tree.nodes[link[0] - 1].children.push(link[1] - 1);
		tree.nodes[link[1] - 1].parent = link[0] - 1;
	}

	return tree;
}

function count(start, nodes, t) {
	var nodeIdx = start,
		ancestors = path(),
		result = 0;

	while(nodeIdx !== -1) {

		var node = nodes[nodeIdx];

		result += ancestors.sizeOfInerval(nodeIdx - t, nodeIdx + t);

		ancestors.add(nodeIdx);
		var nextNodeIdx = nextChild(node);

		while(nextNodeIdx === -1) {
			if (node.parent === null) {
				break;
			}
			ancestors.remove(nodeIdx);
			nodeIdx = node.parent;
			node = nodes[nodeIdx];
			nextNodeIdx = nextChild(node);
		}

		nodeIdx = nextNodeIdx;
	}

	return result;
}

function nextChild(node) {
	if (node.children.length === 0) {
		return -1;
	} else {
		return node.children.pop();
	}
}

function path() {
	var nodes = [];

	var bSearch = require('./binary-search.js');

	return {
		add: function(value) {
			var pos = bSearch.findClosest(nodes, value);
			if (pos === -1) {
				nodes.push(value)
			} else {
				nodes.splice(pos, 0, value);
			}
		},
		remove: function(value) {
			var pos = bSearch.find(nodes, value);
			nodes.splice(pos, 1);
		},
		sizeOfInerval: function(s, e) {
			var start = bSearch.findClosest(nodes, s),
				end = bSearch.findClosest(nodes, e);

			if (nodes[end] === e) {
				return end - start + 1;
			} else {
				return end - start;
			}
		} 
	}
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input.split("\n").map(function(line) { return line.split(" ") }));
});
