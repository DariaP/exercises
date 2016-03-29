var transform = require('./regexp-to-nfa.js');

function processData(input) {
    var n = input[0];
    for (var i = 0 ; i < n ; ++i) {
        var args = input[i + 1].split(" ");
        console.log(count(args[0], parseInt(args[1])));
    }
} 

function count(regexp, n) {
    transform(regexp);
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
