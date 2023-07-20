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
];

let user = "";
const login = function() {
    event.preventDefault()
    const newUser = document.querySelector('#user').value;
    const newPass = document.querySelector('#pass').value;
    const error = document.querySelector('#error')

    document.querySelector('#pass').addEventListener('change', () => {
        console.log('yes', error.classList)
        if(error.classList.contains('d-none')){
            console.log('uyfga fidgsiuy');
        }
    })

    users.forEach((i) => {
        if(i.user === newUser){
            user = i.user;
            if( i.pass === newPass){
                window.open("flexi-dashboard.html",'_self');
                localStorage.setItem("user", user);
            } else {
                error.classList.remove('d-none');
            }
        } 
    })
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

//BMI calculator

const btnEl = document.getElementById("btn");
const bmiInputEl = document.getElementById("bmi-result");
const pageBmi = document.getElementById("bmi");
const weightConditionEl = document.getElementById("weight-condition");
const weightConditionElPage = document.getElementById("w-condition");

function calculateBMI() {
    const heightValue = document.getElementById("height").value / 100;
    const weightValue = document.getElementById("weight").value;

    const bmiValue = weightValue / (heightValue * heightValue);

    bmiInputEl.innerText = bmiValue.toFixed(2);
    pageBmi.innerText = bmiValue.toFixed(2);

    console.log(bmiValue)

    if (bmiValue < 18.5) {
        weightConditionEl.innerText = "Under weight";
        weightConditionElPage.innerText = "Under weight";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        weightConditionEl.innerText = "Normal weight";
        weightConditionElPage.innerText = "Normal weight";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
        weightConditionEl.innerText = "Overweight";
        weightConditionElPage.innerText = "Overweight";
    } else if (bmiValue >= 30) {
        weightConditionEl.innerText = "Obesity";
        weightConditionElPage.innerText = "Obesity";
    }
    const barValue = ((bmiValue - 15) * 100) / 25;
    console.log(barValue);

    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${barValue}%`
}

btnEl.addEventListener("click", calculateBMI);

