img = "";
status = "";
objects = [];
alarm = "";
pa = "";

function preload(){
    alarm = loadSound("music.mp3");
}

function setup(){
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
    object_Detector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Checking for baby";
}

function modelLoaded(){
    console.log("Model has been loaded");
    status = true;
}

function gotResult(error, results){
    if(error){
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw(){
    image(video, 0, 0, 380, 380);
    pa = alarm.isPlaying();
    if(status != ""){
        r = random(255);
        g = random(255);
        b = random(255);
        object_Detector.detect(video, gotResult);
        for(i = 0; i < objects.length; i++){
            if(objects[i].label == "person"){
                document.getElementById("status").innerHTML = "Status : Baby is in the room";
                if(pa == true){
                    alarm.stop();
                }
                fill(r,g,b);
                percent = floor(objects[i].confidence*100);
                text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
                noFill();
                stroke(r,g,b);
                rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            }
            else{
                document.getElementById("status").innerHTML = "Status : Baby is not in the room";
                if(pa == false){
                    alarm.play();
                }
            }
        }
        if(objects.length <= 0){
            document.getElementById("status").innerHTML = "Status : Baby is not in the room";
            if(pa == false){
                alarm.play();
            }
        }
    }
}