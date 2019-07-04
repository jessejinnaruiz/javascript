const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    //grabs the video 
    navigator.mediaDevices.getUserMedia({ video: true, audio: false}) //grab video only and this returns a promise
        .then(localMediaStream => {
            //run the video stream through a url
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => { //thrown an error is someone doesnt allow camera access
            console.error(`Oh no!`, err);
        });
}

function paintToCanvas() {
    // take a video frame to edit by first creating the right size canvas
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.height = height;
    canvas.width = width;

    return setInterval(() => {
        //set the time interval to take images
        ctx.drawImage(video, 0, 0, width, height); //start at the top left hand corner of the canvas

        //get the pixels out of the canvas, edit them and then put them back in
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        ctx.putImageData(pixels, 0, 0);

    }, 16);

}

function takePhoto() {
    //takes a photo and plays a noise each time
    snap.currentTime = 0;
    snap.play(); //plays noise
    //takes the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data; //creates a download url of the photo
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome bunny"/>`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4 ) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
      }
      return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
    }
    return pixels;
  }
  
  function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

getVideo();

//listens to when the video is playing and start paintToCanvas function
video.addEventListener('canplay', paintToCanvas); 