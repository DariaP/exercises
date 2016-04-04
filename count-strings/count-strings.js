var nfaFromRegexp = require('./regexp-to-nfa.js'),
    dfaFromNfa = require('./nfa-to-dfa'),
    modBase = 1000000007,
    x = 1000,
    x2 = x * x;

function modMul(a, b) {
    var a1 = Math.floor(a / x),
        a2 = a % x,
        b1 = Math.floor(b / x),
        b2 = b % x;

    return ((((a1 * b1) % modBase) * x2) % modBase +
           (((a1 * b2 + a2 * b1) % modBase) * x) % modBase + 
           (a2 * b2) % modBase) % modBase;
}

function processData(input) {
    var n = input[0];
    for (var i = 0 ; i < n ; ++i) {
        var args = input[i + 1].split(" ");
        console.log(count(args[0], parseInt(args[1])));
    }
} 

function count(regexp, n) {
    var dfa = dfaFromNfa(nfaFromRegexp(regexp)),
        adjMatrix = buildAdjMatrix(dfa);

    var pathsNum = power(adjMatrix, n);

    var res = 0;
    for (var i = 0 ; i < dfa.length ; ++i) {
        if (pathsNum[0][i] !== 0 && dfa[i].finite) {
            res = res + pathsNum[0][i];
        }
    }

    return res % modBase;
}

function buildAdjMatrix(dfa) {
    var matrix = [];
    for (var i = 0 ; i < dfa.length ; ++i) {
        var node = dfa[i];
        matrix[i] = [];
        for (var j = 0 ; j < dfa.length ; ++j)matrix[i][j] = 0;
        if (node['a']) {
            matrix[i][node['a']] = 1;            
        }
        if (node['b']) {
            matrix[i][node['b']] = 1;            
        }
    }
    return matrix;
}

function isOdd(num) { 
    return num % 2;
}

function power(m, p) {
    if (p == 1) {
        return m;
    }

    if (isOdd(p)) {
        var temp = power(m, (p - 1) / 2);
        return multiply3(temp, temp, m);
    } else {
        var temp = power(m, p / 2);
        return multiply(temp, temp);        
    }
}

function multiply3(m1, m2, m3) {
    return multiply(multiply(m1, m2), m3);
}

function multiply(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m1.length; j++) {
            var sum = 0;
            for (var k = 0; k < m1.length; k++) {
                sum = sum + modMul(m1[i][k], m2[k][j]);
            }
                
            result[i][j] = sum % modBase;
        }
    }
    return result;
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
