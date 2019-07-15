let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]'); //select all the time buttons


// make a timer function
function timer(seconds) {
    clearInterval(countdown); //clear any existing timers
    const now = Date.now(); //figure out when the timer started
    const then = now + seconds * 1000; //now is in milliseconds
    displayTimeLeft(seconds);
    displayEndTime(then);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now())/1000);
        //before we display it, check if we should stop it
        if(secondsLeft < 0) { 
            clearInterval(countdown);
            return;
        }
        //display the secondsLeft
        displayTimeLeft(secondsLeft);
    }, 1000); //every second display the amount of time left
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display; //display the timer on the document title
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp) { //display the time to return/finish
    const end = new Date(timestamp); //turn timestamp into a date
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0': ''}${minutes}`;
}

function startTimer() { //start a timer for the time in the button
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer)); //listen for the clicking of any of the timer buttons and start the timer for that time

document.customForm.addEventListener('submit', function(e) { //start a timer for the user submitted minutes in the form element
    e.preventDefault();
    const mins = this.minutes.value;
    console.log(mins);
    timer(mins * 60);
    this.reset();
})
