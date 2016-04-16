function processData(input) {
    console.log(count(input));
} 

function count(str) {
    var sArray = buildSuffixArray(str);
    return sArray;
}

function buildSuffixArray(str) {
    var array = [];
    for (var i = 0 ; i < str.length ; ++i) {
        array[i] = i;
    }

    var buckets = [{
        suffixes: array,
        substrLen: 0
    }];

    var result = str.length;
    for (var i = 0 ; i < 100 ; ++i) {//while(buckets.length !== 0) {
        var bucket = buckets.pop();

        if (bucket.suffixes.length === 1) {
            continue;
        }

        if (result > (str.len - 1) * bucket.suffixes.length) {
            continue;
        }

//console.log(buckets.length + " " + bucket.substrLen + " " + bucket.suffixes.length);

        if (bucket.substrLen * bucket.suffixes.length > result) {
            result = bucket.substrLen * bucket.suffixes.length;
        }

        var newBuckets = split(bucket.suffixes, bucket.substrLen)
            .map(function(newBucket) {
                return {
                    suffixes: newBucket,
                    substrLen: bucket.substrLen + 1
                }
            });
console.log(newBuckets.length);
        buckets = buckets.concat(newBuckets);
    }

    return result;


    function get(suffixArray, i) {
        return {
            length: function() { return (str.length - suffixArray[i]) },
            charAt: function(p) { return str.charAt(suffixArray[i] + p); }
        };
    }

    function split(suffixArray, k) {
        var result = {};
        for (var i = 0 ; i < suffixArray.length ; ++i) {
            var substr = get(suffixArray, i),
                c = substr.charAt(k);
            if(!result[c]) {
                result[c] = [];
            }
            result[c].push(suffixArray[i]);
        }
        return Object.keys(result).map(function(c) { return result[c]; });
    }

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});
