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

    const selectData =  data.length;

    let startTimeMillis = +(data[lastData - selectData].startTimeMillis);
    let endTimeMillis = +(data[lastData - selectData].endTimeMillis);
    const startTimenanosecond = +(data[lastData - selectData].dataset[0].point[0].startTimeNanos);
    const endTimenanosecond = +(data[lastData - selectData].dataset[0].point[0].endTimeNanos);

    const userSteps = data[lastData - selectData].dataset[0].point[0].value[0].intVal;
    const distanceInKm = (data[lastData - selectData].dataset[2].point[0].value[0].fpVal / 1000).toFixed(2);
    const calories = Math.round(data[lastData - selectData].dataset[2].point[0].value[0].fpVal);

    const userWeeklySteps = [];

    for (let i = 0; i < data.length; i++) {
        userWeeklySteps.push(data[i].dataset[0].point[0].value[0].intVal)
      } 

    // data.forEach((index)=>{
    //     userWeeklySteps.push(data[index].dataset[0].point[0].value[0].intVal)
    // })

    console.log(userWeeklySteps)

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
    stepsEl ? (stepsEl.innerText = userSteps + '') : '';
    durationEl ? (durationEl.innerText = durationInHrs) : '';
    caloriesEl ? (caloriesEl.innerText = calories + ' kcal') : '';

    const targetSteps = document.querySelector('.targetValue');
    console.log(+(targetSteps.innerText));

    if(stepsElCount > 6000){

    } 

    ////Charts js

    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Steps',
                data: userWeeklySteps.reverse(),
                borderWidth: 1,
            }]
        },
        options: {
            
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

getData();

//BMI calculator

const btnEl = document.getElementById("btn");
const bmiInputEl = document.getElementById("bmi-result");
const pageBmi = document.getElementById("bmi");
const weightConditionEl = document.getElementById("weight-condition");
const weightConditionElPage = document.getElementById("w-condition");
let bmiImg = document.querySelector('#BIM-img img')?.getAttribute('src');
console.log(bmiImg);

function calculateBMI() {
    const heightValue = document.getElementById("height").value / 100;
    const weightValue = document.getElementById("weight").value;
    const bmiValue = weightValue / (heightValue * heightValue);
    const suggestions = document.querySelector('#suggestions');
    const suggestionsCards = [...(suggestions.querySelectorAll('.card'))];
    const removeClass = (id) => {
        suggestions.querySelector(`#${id}`).classList.remove('d-none');
    }

    suggestionsCards.forEach((el)=>{
        if(!el.classList.contains('d-none')){
            el.classList.add('d-none');
        }
    });

    const scrollto = () => {
        window.scrollTo({
            behavior: 'smooth',
            top: document.getElementById('BMI-container').getBoundingClientRect().top
                - document.body.getBoundingClientRect().top
                // - this.offset,
        });
    }

    // bmiInputEl.innerText = bmiValue.toFixed(2);
    pageBmi.innerText = bmiValue.toFixed(2);

    console.log(bmiValue)

    if (bmiValue < 18.5) {
        weightConditionElPage.innerText = "Underweight";
        document.querySelector('#BIM-img img').src = `./images/thin.png`;
        removeClass('underweight');
        scrollto();
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        weightConditionElPage.innerText = "Normal weight";
        document.querySelector('#BIM-img img').src = `./images/person.png`;
        removeClass('normalweight')
        scrollto();
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
        weightConditionElPage.innerText = "Overweight";
        document.querySelector('#BIM-img img').src = `./images/fat-man.png`;
        removeClass('overweight')
        scrollto();
    } else if (bmiValue >= 30) {
        weightConditionElPage.innerText = "Obese";
        document.querySelector('#BIM-img img').src = `./images/man.png`;
        removeClass('obese')
        scrollto();
    }
    const barValue = ((bmiValue - 15) * 100) / 25;
    console.log(barValue);

    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = `${barValue}%`
}

btnEl?.addEventListener("click", calculateBMI);

const heartCard = document.querySelector('.heartCard')
heartCard?.addEventListener('mouseenter', () => {
    heartCard.querySelector('img').src = "./images/heartbeat.gif"
})
heartCard?.addEventListener('mouseleave', () => {
    heartCard.querySelector('img').src = "./images/heartbeat.png"
})
console.log(heartCard);

