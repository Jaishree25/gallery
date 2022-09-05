let video = document.querySelector("video");
let recordbtncont= document.querySelector(".record-btn-cont");
let recordbtn = document.querySelector(".record-btn");
let caturebtncont= document.querySelector(".capture-btn-cont");
let capturebtn = document. querySelector(".capture-btn");
let recorder;
let recordflag = false;
let chunks=[];

let constraints={
    video:true,
    audio:true
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start" ,(e)=>{
        chunks =[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //conversion of media chunks data to video
        let blob= new Blob(chunks ,{type:"video/mp4"});

        if (db){
            let videoID = shortid();
            let dbTransaction = db.transaction("video" , "readwrite"); //first we make transaction with objectstore object that is video which is in db.js
            let videoStore = dbTransaction.objectStore("video"); // in videoStore variable we storing the accessed objectstore that is video
            let videoEntry={
                id :`vid-${videoID}`,  // id must be same as keypath which we declared in db.js file
                blobData: blob
            }
            videoStore.add(videoEntry);
        }

        // we are doing this thing to download video in laptop 
        // same thing goes with capturebtn that is for image thing
        //(video record ko stop ke tym bottom mai ke notification aa jaati thi
        // video downloaded and vo video hume my computer ke download folder mai
        // milti thi toh ab ye wala kaam nahi krna hai ) 
        //but now we dont want to download instead of that
        //we want to store it in gallery using database

        // let a= document.createElement("a");
        // a.href= videoURL;
        // a.download="stream.mp4";
        // a.click();
    })
})
recordbtncont.addEventListener("click", (e) => {
    if(!recorder)
    {
      return;
    }

    recordflag=!recordflag;
    if(recordflag) //starts recording
    {
        recorder.start();
        recordbtn.classList.add("animate__bounceOut");
        starttimer();
    }
    else //stop the recording
    {
        recorder.stop();
        recordbtn.classList.remove("animate__bounceOut");
        stoptimer();
    }
})

caturebtncont.addEventListener("click", (e) => {
    capturebtn.classList.add("animate__bounceIn");
    let canvas= document. createElement("canvas"); // we are creating a canvas to capture image
    canvas.width= video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height); // to draw image on canvas

    let imageurl= canvas.toDataURL();

    if (db){
        let imageID = shortid();
        let dbTransaction = db.transaction("image" , "readwrite"); //first we make transaction with objectstore object that is video which is in db.js
        let imageStore = dbTransaction.objectStore("image"); // in videoStore variable we storing the accessed objectstore that is video
        let imageEntry={
            id : `img-${imageID}`,  // id must be same as keypath which we declared in db.js file
            url: imageurl
        }
        imageStore.add(imageEntry);
    }
    capturebtn.classList.add("animate__bounceIn");

    //to download the captured im
    //let a= document.createElement("a");
    //a.href = imageurl;
    //a.download = "image.jpg";
    //a.click();
})

let timerid;
let counter = 0; //represents total seconds
let timer = document.querySelector(".timer");
function starttimer(){
    timer.style.display ="block";
    function displaytimer(){
        let totalseconds = counter;

        let hours= Number.parseInt(totalseconds/3600);
        totalseconds= totalseconds % 3600; //remaining value

        let minutes= Number.parseInt(totalseconds/60);
        totalseconds= totalseconds % 60; //remainimg value

        let seconds= totalseconds;
        //for representation of recording time in 2 digit format
        minutes= (minutes< 10)? `0${minutes}` :minutes;
        seconds =(seconds < 10)? `0${seconds}` : seconds;

        timer.innerText =`${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerid= setInterval(displaytimer,1000); 
}
function stoptimer(){
    timer.style.display="none";
    clearInterval(timerid);
    timer.innerText="00:00:00";
}