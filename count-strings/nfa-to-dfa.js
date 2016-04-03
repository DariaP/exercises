function buildDfa(nfa) {
	var nfaLinks = nfa,//nfaMap(nfa),
		dfaLinks = [],
		i = 0;
		dfaNodes = {},
		dfaNodesStack = [{
			nfaNodes: new Set([0])
		}];

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
			dfaNode.links['a'] = Array.from(dfaNode.links['a'].values()).sort().join(" ");
		} else {
			dfaNode.links['a'] = null;
		}

		if (dfaNode.links['b'].size !== 0) {
			dfaNodesStack.push({
				nfaNodes: dfaNode.links['b']
			});
			dfaNode.links['b'] = Array.from(dfaNode.links['b'].values()).sort().join(" ");
		} else {
			dfaNode.links['b'] = null;
		}

		dfaLinks[i] = dfaNode.links;
		dfaLinks[i].finite = dfaNode.finite;
		dfaNodes[dfaNode.id] = i++;

	}

	return dfaLinks.map(function(links) {
		var newLinks = {};
		if (links.a) {
			newLinks.a = dfaNodes[links.a];
		}
		if (links.b) {
			newLinks.b = dfaNodes[links.b];
		}
		if (links.finite) {
			newLinks.finite = links.finite;	
		}
		return newLinks;
	});

	function process(dfaNode, nfaNodeId) {
		//console.log(dfaNode.id + " " + nfaNodeId)
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
					dfaNode.nfaNodes.add(node);
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

module.exports = buildDfa;