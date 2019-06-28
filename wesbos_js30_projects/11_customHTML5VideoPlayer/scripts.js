/* Get our elements*/

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');


/* Build out functions */

function togglePlay( ) {
    // function that plays the video or pauses the video
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() {
    //listen to the video for whenever it is paused and update the button accordingly
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    //skip according to the skip buttons (either backward or forward)
    video.currentTime += parseFloat(this.dataset.skip);
}


function handleRangeUpdate() {
    // using the sliderbars to adjust the volume and the playback speed
    video[this.name] = this.value;
}

function handleProgress () {
    //update the progress bar in real time
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    // scrubbing on the progress bar when clicking or clicking and dragging
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}



/* Hook up the event listeners */

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('movemouse', handleRangeUpdate));

let mousedown = false; // create a flag for scrubbing
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);