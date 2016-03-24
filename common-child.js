function processData(input) {
    var res = maxSubArray(input[0].split(""), input[1].split(""))
    console.log(res);
} 

var partialResult = function(y) {
  var current = [], previous = [];
  
  for (var j = 0 ; j < y ; j++) {
      current[j] = 0;
  }
    
  return {
      getPrevious: function(j) {
          return previous[j]
      },
      getCurrent: function(j) {
          return current[j]
      },
      set: function(j, value) {
          current[j] = value;
      },
      swapRows: function() {
          var temp = previous;
          previous = current;
          current = temp;
          current[0] = 0;
      },
      print: function () {
          console.log(previous);
          console.log(current);
      }
  }
};

function maxSubArray(str1, str2) {
    var partResults = partialResult(str2.length + 1),
        i, j;

    for (i = 1 ; i <= str1.length ; ++i) {
        partResults.swapRows();
        for (j = 1 ; j <= str2.length ; ++j) {
            var c1 = str1[i - 1], c2 = str2[j - 1], res = 0;
            if (c1 == c2) {
                res = partResults.getPrevious(j - 1) + 1;
            } else {
                res = Math.max(
                    partResults.getPrevious(j),
                    partResults.getCurrent(j - 1)
                );
            }
            partResults.set(j, res);
        }
    }

    return partResults.getCurrent(str2.length);
}


function maxSubArrayHelper(str1, l1, str2, l2, partResults) {

    if (l1 == 0 || l2 == 0) {
        return 0;
    }

    var res = partResults.get(l1, l2);
    
    if (res) {
        return res;
    }
    
    var c1 = str1[l1 - 1], c2 = str2[l2 - 1];
    
    if (c1 == c2) {
        res = maxSubArrayHelper(str1, l1 - 1, str2, l2 - 1, partResults) + 1;
    } else {
        res = Math.max(
            maxSubArrayHelper(str1, l1, str2, l2 - 1, partResults),
            maxSubArrayHelper(str1, l1 - 1, str2, l2, partResults)
        );
    }
    
    partResults.set(l1, l2, res);
    return res;
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
