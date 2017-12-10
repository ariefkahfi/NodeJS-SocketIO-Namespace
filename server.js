let express = require("express");
let fs = require("fs");
let url = require("url");
let path  = require("path");
let socketIO = require("socket.io");
let http = require("http");

let app = express();

app.use(express.static(__dirname+"/public_html"));


app.get("/",(req,res)=>{
    res.send(`
        <a href='http://localhost:9600/room1.html'>Room1</a>
        <a href='http://localhost:9600/room2.html'>Room2</a>
    `);
});

app.get("/room1.html",(req,res)=>{
    res.sendFile("room1.html");
});
app.get("/room2.html",(req,res)=>{
    res.sendFile("room2.html");
});




let httpServer = http.createServer(app).listen(9600,()=>{
    console.log("listening on port 9600");
});



let io = new socketIO(httpServer);


let room1NS = io.of("/room1");
let room2NS = io.of("/room2");

room1NS.on("connection",(socket)=>{
    console.log("connected to room1");
    socket.on("send_msg_to_room1",(data)=>{
        room1NS.emit("on_msg_from_room1",{msg:data,room:"Room-1"});
    });
});

room2NS.on("connection",(socket)=>{
    console.log("connected to room2");
    socket.on("send_msg_to_room2",(data)=>{
        room2NS.emit("on_msg_from_room2",{msg:data,room:"Room-2"});
    });
});


