function buildDfa(nfa) {
	var dfa = [],
		i = 0;
		dfaIdxs = {},
		dfaNodesStack = [newNode(new Set([0]))];

	while (dfaNodesStack.length !== 0) {

		var dfaNode = dfaNodesStack.pop(),
			reachableNfaNodes = [];

		dfaNode.nfaNodes.forEach(function(nfaNode) {
			var newReachableNodes = processReachableNfaNode(dfaNode, nfaNode);
			reachableNfaNodes = reachableNfaNodes.concat(newReachableNodes);
		});

		while (reachableNfaNodes.length !== 0) {
			var nfaNode = reachableNfaNodes.pop();
			newReachableNodes = processReachableNfaNode(dfaNode, nfaNode);
			reachableNfaNodes = reachableNfaNodes.concat(newReachableNodes);
		}

		processLink(dfaNode, 'a');
		processLink(dfaNode, 'b');

		dfa[i] = dfaNode.links;
		dfa[i].finite = dfaNode.finite;

		dfaIdxs[dfaNode.id] = i++;
	}

	replaceIdsWithIdxs(dfa);
	return dfa;


	function processReachableNfaNode(dfaNode, nfaNodeId) {

		var reachableNodes = [],
			links = nfa[nfaNodeId];

		if (nfaNodeId === nfa.finite) {
			dfaNode.finite = true;
		}

		saveLinks(links, 'a', dfaNode);
		saveLinks(links, 'b', dfaNode);

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

	function newNode(nfaNodesSet, id) {
		if (!id) id = nodeId(nfaNodesSet);
		return {
			nfaNodes: nfaNodesSet,
			links: {},
			id: id
		};
	}

	function saveLinks(links, type, dfaNode) {
		if (links[type]) {
			if (!dfaNode.links[type]) {
				dfaNode.links[type] = new Set();
			}
			links[type].forEach(function(node) {
				dfaNode.links[type].add(node);
			})
		}
	}

	function processLink(dfaNode, linkType) {
		if (dfaNode.links[linkType]) {
			var newNodeId = nodeId(dfaNode.links[linkType]);
			if (!dfaIdxs[newNodeId]) {
				dfaNodesStack.push(
					newNode(dfaNode.links[linkType], newNodeId)
				);
			}
			dfaNode.links[linkType] = newNodeId;
		}

	}

	function replaceIdsWithIdxs(dfa) {
		dfa.forEach(function(links) {
			if (links['a']) {
				links['a'] = dfaIdxs[links['a']];
			}
			if (links['b']) {
				links['b'] = dfaIdxs[links['b']];
			}
		});
	}

	function nodeId(set) {
		return Array.from(set.values()).sort().join(" ");
	}

}

module.exports = buildDfa;