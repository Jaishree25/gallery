//here bacically we want to retrieve our images and video from indexdb and want both thing
// in gallery that is inside media-cont
setTimeout(()=>{
    if(db){
        let videodbtransaction = db.transaction("video", "readonly");
        let videostore = videodbtransaction.objectStore("video");
        let videoRequest = videostore.getAll() // event driven
        videoRequest.onsuccess = (e) =>{
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id", videoObj.id);
            
                let url= URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML =
              ` <div class ="medias">
                    <video autoplay loop src ="${url}"></video>
                </div>
                <div class="delete">DELETE</div>
                <div class ="download">DOWNLOAD</div>`;

                galleryCont.appendChild(mediaElem);

                let deletebtn = mediaElem.querySelector(".delete");
                deletebtn.addEventListener("click", deleteListener);
                let downloadbtn= mediaElem.querySelector(".download");
                downloadbtn.addEventListener("click", downloadListener);
            })
        }
        
        // image retrieval
        let imagedbtransaction = db.transaction("image", "readonly");
        let imagestore = imagedbtransaction.objectStore("image");
        let imageRequest = imagestore.getAll() // event driven
        imageRequest.onsuccess = (e) =>{
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);
            
                let url= imageObj.url;

                mediaElem.innerHTML =
              ` <div class ="medias">
                    <img src ="${url}"/>
                </div>
                <div class="delete">DELETE</div>
                <div class ="download">DOWNLOAD</div>`;

                galleryCont.appendChild(mediaElem);

                let deletebtn = mediaElem.querySelector(".delete");
                deletebtn.addEventListener("click", deleteListener);
                let downloadbtn= mediaElem.querySelector(".download");
                downloadbtn.addEventListener("click", downloadListener);
            })
        } 
    }
},100)

function deleteListener(e){
    //removal from database
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type == "vid"){
        let videodbtransaction = db.transaction("video","readwrite");
        let videoStore = videodbtransaction.objectStore("video");
        videoStore.delete(id);

    }
    else if(type =="img"){
        let imagedbtransaction = db.transaction("image","readwrite");
        let imageStore = imagedbtransaction.objectStore("image");
        imageStore.delete(id);
    }
    // ui removal
    e.target.parentElement.remove();

}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if (type =="vid"){
        let videodbtransaction = db.transaction("video","readwrite");
        let videoStore = videodbtransaction.objectStore("video");
        let videoRequest= videoStore.get(id);
        videoRequest.onsuccess=(e) =>{
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href= videoURL;
            a.download ="strem.mp4";
            a.click();
        }
    }
    else if (type =="img"){
        let imagedbtransaction = db.transaction("image","readwrite");
        let imageStore = imagedbtransaction.objectStore("image");
        let imageRequest= imageStore.get(id);
        imageRequest.onsuccess=(e) =>{
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href= imageResult.url;
            a.download ="image.jpg";
            a.click();
        }
    }
}