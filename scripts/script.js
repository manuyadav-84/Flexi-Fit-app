const users = [
    {
        user: 'janki',
        pass: '123'
    },
    {
        user: 'sharad',
        pass: '123'
    },
    {
        user: 'anil',
        pass: '321'
    },
    {
        user: 'archana',
        pass: '111'
    }
]

let user = "";
const login = function() {
    event.preventDefault()
    const newUser = document.querySelector('#user').value;
    const newPass = document.querySelector('#pass').value;

    users.forEach((i) => {
        if(i.user === newUser && i.pass === newPass){
            user = i.user;
            window.open("flexi-dashboard.html",'_self');
            localStorage.setItem("user", user);
        }
    })
    // if(user === newUser && pass === newPass){
    //     window.open("flexi-dashboard.html",'_self');
    // }else{
    //     alert("User or pasword is incorrect, please user correct user id and password for login");
    // }
}

user = localStorage.getItem("user");

console.log(user);

document.addEventListener('keyup', function(e){
    (e.keyCode === 13) ? login() : '';
})

const userWrapper = document.querySelector('#user');

userWrapper.innerText = user.toUpperCase();

async function getData() {
    // const response= await fetch('./data/fitbit_janki.json');
    const response= await fetch(`./data/fitbit_${user}.json`);
    const userData= await response.json();

    const data = userData.bucket;
    console.log(data)
    const lastData = data.length

    const selectData = 3;

    let startTimeMillis = +(data[lastData - selectData].startTimeMillis);
    let endTimeMillis = +(data[lastData - selectData].endTimeMillis);
    let startTimenanosecond = +(data[lastData - selectData].dataset[0].point[0].startTimeNanos);
    let endTimenanosecond = +(data[lastData - selectData].dataset[0].point[0].endTimeNanos);

    let userSteps = data[lastData - selectData].dataset[0].point[0].value[0].intVal;
    let distanceInKm = (data[lastData - selectData].dataset[2].point[0].value[0].fpVal / 1000).toFixed(2);
    let calories = Math.round(data[lastData - selectData].dataset[2].point[0].value[0].fpVal);

    console.log(distanceInKm, calories)

    let convertMilliSec = (x) => {
        const nanoToMilliSec = +(String(Math.ceil(x / 1000000)))
        function milliSecToDate(val) {
            let date = new Date(val);
            return date;
        }
        return milliSecToDate(nanoToMilliSec)
    };

    const milliSecToDate = (val) => {
        let date = new Date(val);
        return date;
    }

    const msToTime = (ms) => {
        let seconds = (ms / 1000).toFixed(1);
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (seconds < 60) return seconds + " Sec";
        else if (minutes < 60) return minutes + " Min";
        else if (hours < 24) return hours + " Hrs";
        else return days + " Days"
    }

    const durationInMs = convertMilliSec(endTimenanosecond) - convertMilliSec(startTimenanosecond)
    const durationInMnt = (durationInMs / 60000)
    const durationInHrs = msToTime(durationInMs);

    console.log("startTimenanosecond", convertMilliSec(startTimenanosecond));
    console.log("endTimenanosecond", convertMilliSec(endTimenanosecond));
    console.log(durationInMs);
    console.log(durationInMnt);
    console.log(durationInHrs);
    console.log(userSteps);

    const stepsEl = document.getElementById('steps');
    const distanceEl = document.getElementById('distance');
    const caloriesEl = document.getElementById('calories');
    const durationEl = document.getElementById('duration');

    distanceEl ? (distanceEl.innerText = distanceInKm + ' km') : '';
    stepsEl ? (stepsEl.innerText = userSteps + ' kcal') : '';
    durationEl ? (durationEl.innerText = durationInHrs) : '';
    caloriesEl ? (caloriesEl.innerText = calories + ' kcal') : '';
}

getData();

