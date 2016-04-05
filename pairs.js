function processData(input) {
    var k = parseInt(input[0][1]),
        numbers = input[1].map(function(numStr) { return parseInt(numStr); });
    
    console.log(count(numbers, k));
} 

function count(numbers, k) {

    var res = 0,
        buckets = split(numbers);

    for (var number in buckets) {
        number = parseInt(number);
        if (buckets[number + k]) {
            res += buckets[number + k];
        }
    }
    
    return res;
}

function split(numbers) {
    var buckets = {};
    for (var i = 0 ; i < numbers.length ; ++i) {

        var number = numbers[i];

        if (!buckets[number]) {
            buckets[number] = 0;
        }

        buckets[number]++;
    }
    return buckets;
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input.split("\n").map(function(line) { return line.split(" "); }));
});