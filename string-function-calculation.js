function processData(str) {
    var sArray = buildSuffixArray(str),
        numbers = [],
        maxNumber = str.length,
        currentEqualSubstrLen = 0,
        prevSubstr = sArray.get(0);

    for (var i = 0 ; i < str.length ; ++i) {
        numbers[i] = 0;
    }

    for (var i = 1 ; i < str.length ; ++i) {

        var nextSubstr = sArray.get(i),
            j = 0;
        
        while (j < nextSubstr.length() && j < prevSubstr.length()) {

            if (nextSubstr.charAt(j) === prevSubstr.charAt(j)) {
                if (numbers[j] === 0) {
                    numbers[j] = 2 * (j + 1);
                } else {
                    numbers[j] += (j + 1);                    
                }
            } else {
                while (j < prevSubstr.length()) {
                    if (numbers[j] > maxNumber) {
                        maxNumber = numbers[j];
                    }
                    numbers[j] = 0;
                    j++;
                }
                break;
            }
            j++;
        }        
        /*

            var allEqual = true;
            j = 0;
        while (j < currentEqualSubstrLen) {
            if (nextSubstr.charAt(j) === prevSubstr.charAt(j)) {
                numbers[j] ++;
            } else {
                while (j < currentEqualSubstrLen) {
                    if (numbers[j] > maxNumber) {
                        maxNumber = numbers[j];
                    }
                    numbers[j] = 0;
                    j++;
                }
                allEqual = false;
                break;
            }
            j++;
        }
        
        if (allEqual === true) {
            // got all the way to the end! continue
            while (j < prevSubstr.length() && j < nextSubstr.length()) {
                if (prevSubstr.charAt(j) === nextSubstr.charAt(j)) {
                    // continue counting for substrings with length j + 1
                    numbers[j++] = 1;
                } else {
                    break;
                }
            }
        }*/
        
        prevSubstr = nextSubstr;
    }
    
    for (var i = 0 ; i < str.length ; ++i) {
        if (numbers[i] > maxNumber) {
            maxNumber = numbers[i];
        }
    }
    console.log(maxNumber);
} 

function zero(array, from, to) { 
    for (var i = from ; i <= to ; ++i) {
        array[i] = 0;
    }
}

function buildSuffixArray(str) {
    var array = [];
    for (var i = 0 ; i < str.length ; ++i) {
        array[i] = i;
    }
    
    array.sort(function(i1, i2) {
        return compareSubstrings(str, i1, i2);
    });
    
    return {
        print: function() {
            for (var i = 0 ; i < array.length ; ++i) {
                console.log(str.substr(array[i], str.length - array[i]));
            }
        },
        get: function(i) {
            return {
                length: function() { return (str.length - array[i]) },
                charAt: function(p) { return str.charAt(array[i] + p); }
            };
        }
    };
}

function compareSubstrings(str, i1, i2) {
    var i = 0;
    while ((i1 + i) < str.length 
           && (i2 + i) < str.length 
           && str.charCodeAt(i1 + i) === str.charCodeAt(i2 + i)) 
        i++;

    if ((i1 + i) === str.length) {
        return -1;
    } else if ((i2 + i) === str.length) {
        return 1;
    } else {
        return str.charCodeAt(i1 + i) - str.charCodeAt(i2 + i);
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
