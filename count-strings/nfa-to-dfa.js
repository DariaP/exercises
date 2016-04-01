function convert(nfa) {
	var nfaLinks = nfaMap(nfa),
		dfaNodes = {},
		dfaNodesStack = [{
			id: "0",
			nfaNodes: new Set()
		}];

		console.log(nfaLinks.finite);
	dfaNodesStack[0].nfaNodes.add(0)

	while (dfaNodesStack.length !== 0) {
		var dfaNode = dfaNodesStack.pop(),
			reachableNfaNodes = [];

		dfaNode.id = Array.from(dfaNode.nfaNodes.values()).sort().join(" ");
		if (dfaNodes[dfaNode.id]) {
			continue;
		}

		dfaNode.links = {'a': new Set(), 'b': new Set()};

		dfaNode.nfaNodes.forEach(function(nfaNode) {
			reachableNfaNodes = reachableNfaNodes.concat(process(dfaNode, nfaNode));
		});

		while (reachableNfaNodes.length !== 0) {
			var nfaNode = reachableNfaNodes.pop();
			reachableNfaNodes = reachableNfaNodes.concat(process(dfaNode, nfaNode));
		}

		if (dfaNode.links['a'].size !== 0) {
			dfaNodesStack.push({
				nfaNodes: dfaNode.links['a']
			});
		}

		if (dfaNode.links['b'].size !== 0) {
			dfaNodesStack.push({
				nfaNodes: dfaNode.links['b']
			});
		}

		for (var linkType in dfaNode.links) {
			dfaNode.links[linkType] = Array.from(dfaNode.links[linkType].values()).sort().join(" ");
		}

		dfaNodes[dfaNode.id] = dfaNode;
	}
	console.log(dfaNodes);

	function process(dfaNode, nfaNodeId) {
		//console.log(dfaNode.id + " " + )
		var reachableNodes = [],
			links = nfaLinks[nfaNodeId];

		if (nfaNodeId == nfaLinks.finite) {
			dfaNode.finite = true;
		}

		if (links['a']) {
			links['a'].forEach(function(node) {
				dfaNode.links['a'].add(node);
			})
		}

		if (links['b']) {
			links['b'].forEach(function(node) {
				dfaNode.links['b'].add(node);
			})
		}

		if (links['e']) {
			links['e'].forEach(function(node) {
				if (!dfaNode.nfaNodes.has(node)) {
					reachableNodes.push(node);
				}
			})
		}

		return reachableNodes;
	}

}

function nfaMap(nfa) {
	var links = {}, nodes = [nfa], visited = [];
	while(nodes.length !== 0) {
		var nextNode = nodes.pop();

		if(nextNode.finite) {
			links.finite = nextNode.idx;
		}

		links[nextNode.idx] = {};

		for (var linkType in nextNode.links) {
			links[nextNode.idx][linkType] = nextNode.links[linkType].map(function(node) {
				return node.idx;
			});
			nextNode.links[linkType].forEach(function(node) {
				if (!visited[node.idx]) {
					nodes.push(node);
					visited[node.idx] = true;					
				}
			});
		}
	}
	return links;
}

module.exports = convert;