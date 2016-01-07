//generate array of fibonacci sequeunce
//iterate thru array and find odd numbers and delete thme form array
//find sum of array

var fibo = [1, 2];
function generateFibo(){
  nextNum = 0;
  x=0;
  y=1;
  while(nextNum < 3000000){
    nextNum= fibo[x] + fibo[y];
    fibo.push(nextNum);
    x++;
    y++;
  }
}

function removeEvens(){
  for (i = 0; i < fibo.lengh-1; i++){
    debugger;
    if (fibo[i] % 2 === 0){
      debugger;
      fibo.splice(i, 1);
    }else{
      debugger;
    }
  }
}
