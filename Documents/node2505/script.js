console.log("hllo");
"abc".toUpperCase();
[1, 2, 3].push(4);

function string(str){
    let vowels = "aeiouAEIOU";
    let count =0;
    for(let i= 0; i < str.length ; i++){
        if(vowels.includes(str[i])){
            count++;
        }
    }
    return count;
}
console.log(string("hello"));