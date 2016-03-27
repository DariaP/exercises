function processData(input) {
    var n = parseInt(input[0]);
    for (var i = 0 ; i < n ; ++i) {
        console.log(solve(input[i + 1]));
    }
} 

function substrings(str, len) {
    var result = [];
    for (var i = 0 ; i <= str.length - len ; ++i) {
        result.push(str.substr(i, len));
    } 
    return result;
}

function solve(str) {
    var result = 0;
    for (var len = 1 ; len < str.length ; ++len) {
        var substrs = substrings(str, len).map(function(string) {
            return string.split("").sort().join("");
        });
        substrs.sort(function(str1, str2) {
            for (var i = 0 ; i < len ; ++i) {
                if (str1.charAt(i) < str2.charAt(i)) return -1;
                if (str1.charAt(i) > str2.charAt(i)) return 1;
            }
            return 0;
        })
        
        result += count(substrs);
        //console.log(len + " " + result)
    }
    return result;
}

function count(substrs)  {
    var i = 1, 
        substr = substrs[0], 
        c = 0,
        result = 0;
    //console.log(substrs);
    while (i < substrs.length) {
        c = 1;
        while (substrs[i] === substr && i !== substrs.length) {
            //console.log(substr + " " + substrs[i])
            c++;
            i++;
        }
        substr = substrs[i++];
        if (c > 1) {
            //console.log(c);
            result += c * (c - 1) / 2;            
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
