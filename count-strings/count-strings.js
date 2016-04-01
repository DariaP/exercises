var nfaFromRegexp = require('./regexp-to-nfa.js'),
    dfaFromNfa = require('./nfa-to-dfa');

function processData(input) {
    var n = input[0];
    for (var i = 0 ; i < n ; ++i) {
        var args = input[i + 1].split(" ");
        console.log(count(args[0], parseInt(args[1])));
    }
} 

function count(regexp, n) {
    var nfa = nfaFromRegexp(regexp),
        dfa = dfaFromNfa(nfa);

    return paths(dfa, n);
}

function paths(dfa, n) {
    var paths = {0: 1},
        newPaths = {};

    for (var i = 0 ; i < n ; ++i) {
        newPaths = {};
        for (var node in paths) {
            if(dfa[node].links['a']) {
                add(dfa[node].links['a'], paths[node]);
            }   
            if(dfa[node].links['b']) {
                add(dfa[node].links['b'], paths[node]);
            }   
        }
        paths = newPaths;
    }

    var result = 0;
    for (var node in paths) {
        if (dfa[node].finite) {
            result += paths[node];
        }
    }

    return result;

    function add(node, numPaths) {
        if (!newPaths[node]) {
            newPaths[node] = numPaths;
        } else {
            newPaths[node] += numPaths;
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
   processData(_input.split("\n"));
});
