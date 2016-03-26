function processData(input) {
    console.log(solve(parseInt(input[0]), input[1]))
} 

var letters = {
    "A": 0,
    "C": 1,
    "T": 2,
    "G": 3
};

function countLetters(str) {
    var result = [0,0,0,0];
    for (var i = 0 ; i < str.length ; ++i) {
        var letter = str[i];
        result[letters[letter]]++;
    }
    return result;
}

function interval(str) {
    var currentSubstr = [0,0,0,0],
        s = 0, e = 0, letter;
    
    return {
        equals: function(wantedSubstr) {
            for (var i = 0 ; i < 4 ; ++i) {
                if (wantedSubstr[i] > currentSubstr[i]) return false;
            }
            return true;
        },
        moveStart: function() {
            var letter = str[s++];
            currentSubstr[letters[letter]]--;
            return letter;
        },
        moveEnd: function() {
            var letter = str[e++];
            currentSubstr[letters[letter]]++;
            return letter;
        },
        adjustEnd: function(letter) {
            while(e !== str.length) {
                var nextLetter = str[e++];
                currentSubstr[letters[nextLetter]]++;
                if (nextLetter === letter) {
                    return;
                }
            }
        },
        length: function() {
            return e - s;
        },
        end: function() {
            return e === str.length;
        }
    }    
}

function solve(n, str) {
    var wantedSubstr = countLetters(str).map(function(nLetter) {
        if (nLetter < n / 4) return 0;
        else return nLetter - n / 4;
    });

    var minLength = wantedSubstr.reduce(function(pv, cv) { return pv + cv; }, 0);
    
    var substr = interval(str);
    var e = substr.equals(wantedSubstr);
    while (!substr.equals(wantedSubstr)) {
        substr.moveEnd();
    }
    
    if (substr.end()) return n;
 
    var bestResult = substr.length();
    do {
        if (bestResult === minLength) {
            return minLength;
        }

        var letter = substr.moveStart();
        if (wantedSubstr[letters[letter]] !== 0) {
            if (!substr.equals(wantedSubstr))
                substr.adjustEnd(letter);
        }
        if (substr.length() < bestResult) {
            bestResult = substr.length();
        }
    } while (!substr.end());

    return bestResult;
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
