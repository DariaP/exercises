function regexpTree(regexp) {
	var tree = {children: []},
		nextNode = tree;

	for (var i = 0  ; i < regexp.length ; ++i) {
		var c = regexp[i];
		if (c === "(") {
			nextNode.children.push({
				type: "+", //default type for anything in brackets
				parent: nextNode,
				children: []
			});

			nextNode = nextNode.children[nextNode.children.length - 1];
		} else if (c === ")") {
			nextNode = nextNode.parent;
		} else if (c === "|") {
			nextNode.type = "|";
		} else if (c === "*") {
			nextNode.type = "*";
		} else {
			nextNode.children.push({
				type: c,
				parent: nextNode,
				children: []
			});
		}
	}

	return tree.children[0];
}

function walkTree(tree, callbackBefore, callbackAfter) {
	callbackBefore(tree);
	tree.children.forEach(function(child) {
		walkTree(child, callbackBefore, callbackAfter);
	})
	callbackAfter(tree);
}

function printTree(tree) {
	walkTree(tree, 
		function(node) {
			console.log(node.type + "(");
		}, 
		function() {
			console.log(")")
		}
	);
}

module.exports = regexpTree;

