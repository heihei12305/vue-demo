let user  =require('./User');

console.log(`userName:${user.userName}`);
console.log(`${user.userName},${user.sayHello()}`);


let http =require('http');

http.createServer((req,res)=>{
    res.statusCode = 200;

    res.setHeader("Content-Type","text/plain;charset=utf-8");

    res.end("Hello,Node.js")
})
