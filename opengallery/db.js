// 1. open a database
// 2. create objectstore
// 3. make transaction (this thing we did in script.js file by settting up unique id) 


//open a database
let db;
let openRequest = indexedDB.open("myDataBase"); //we are requesting database to open named mydatabase
openRequest.addEventListener("success",(e)=>{
    console.log("DB SUCCESS");
    db= openRequest.result;
})
openRequest.addEventListener("error",(e)=>{
    console.log("DB ERROR");
})
openRequest.addEventListener("upgradeneeded",(e)=>{ //first upgrade database loaded that is, it initially upgraded its version to version 1 then success event listener called
    console.log("DB UPGRADED");
    db= openRequest.result;
    
    //create objectstore
    // create objectstore can be created only in upgradeneeded event

    db.createObjectStore("video", {keyPath:"id"});
    db.createObjectStore("image", {keyPath: "id"});
})
