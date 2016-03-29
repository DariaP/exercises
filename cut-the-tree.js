function processData(input) {
    var n = parseInt(input[0]),
        weights = input[1].split(" ").map(function(w) { return parseInt(w); }),
        edges = input.splice(2, input.length - 2).map(
            function(eStr) {
                return eStr.split(" ").map(function(e) { return parseInt(e); });
            }
        );
    
    var t = tree(n, edges);

    /*for (var i = 0 ; i < n ; ++i) {
        t[i].forEach(function(node) {
            console.log(i+"->"+node);
        })
    }*/
    console.log(solve(weights, t.list, t.start));
} 

function getAdjList(edges) {
    var list = [];

    function addLink(from, to) {
        if (!list[from]) {
            list[from] = [];
        }
        list[from].push(to);
    }

    for (var i = 0 ; i < edges.length ; ++i) {
        var edge = edges[i];
        addLink(edge[0] - 1, edge[1] - 1);
        addLink(edge[1] - 1, edge[0] - 1);
    }

    return list;
}

function tree(n, inputEdges) {

    var adjList = getAdjList(inputEdges),
        nodesQueue = [],
        start = 0,
        node = 0;

    while(adjList[start].length > 2) start++;
    nodesQueue.push(start);
    node = start;

    function removeLink(from, to) {
        var links = adjList[to];
        for (var i = 0 ; i < links.length ; ++i) {
            if (links[i] == from) {

                adjList[to].splice(i, 1);
            }
        }
    }

    while(nodesQueue.length !== 0) {
        node = nodesQueue.shift();
        adjList[node].forEach(function(nextNode) {
            removeLink(node, nextNode);
            nodesQueue.push(nextNode);
        })
    }

    return {start: start, list: adjList};
}

function solve(weights, tree, start) {
    var nodes = [],
        subtreesWeights = [],
        treeWeight = weights.reduce(function(pv, cv) { return pv + cv; }, 0),
        minDiff = treeWeight;

    nodes.push(start);

    while(nodes.length !== 0) {
        var nextNode = nodes.pop(),
            children = tree[nextNode],
            weight = weights[nextNode],
            foundMissingSubtree = false;

        for (var i = 0 ; i < children.length ; ++i) {
            var nextChild = children[i];

            if (!subtreesWeights[nextChild]) {
                if (!foundMissingSubtree) {
                    foundMissingSubtree = true;
                    nodes.push(nextNode);
                }
                nodes.push(nextChild);
            } else if (!foundMissingSubtree) {
                weight += subtreesWeights[nextChild];
            }
        }

        if (!foundMissingSubtree) {
            subtreesWeights[nextNode] = weight;
        }
    }
    
    var diffs = subtreesWeights.map(function(weight) {return Math.abs(treeWeight - 2 * weight)});
    //console.log(diffs);
    return Math.min.apply(null, diffs);
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
