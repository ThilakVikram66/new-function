let limit = 5;
let arr_length = 21;

let trunc = Math.trunc(arr_length/5);
let actual = arr_length/5;

let loop = actual%trunc !== 0?trunc+1:trunc;
console.log(loop);
