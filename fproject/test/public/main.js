const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');
// const mysql = require('sync-mysql');
const env = require('dotenv').config({ path: "../../.env" });

const connection = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    port: process.env.port,
    password: process.env.password,
    database: process.env.database
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//inputbox 토글
function toggleButton() {
    const emailInput = document.getElementById('email');
    const emailbut = document.getElementById('checkemail');

    if (emailInput.value.trim() !== '') {
        emailbut.disabled = false;
    } else {
        emailbut.disabled = true;
    }
}

//verify 버튼 토클
function toggle() {

    const Div = document.getElementById('inputDiv');
    const emailInput = document.getElementsByName('email')[0];
    const emailbut = document.getElementById('checkemail')

    if (Div.style.display == "none") {
        Div.style.display = "block";
        emailInput.disabled = true; //toggle 되면 다시 토글 안되게, email inputbox가 비활성화 되도록.
        emailbut.style.display = "none";
    } else {
        Div.style.display = "none";
    }

}

//이메일 유효성 검사(일치 시 토글과 카운트다운이 실행)
async function checkEmail() {
    const emailInput = document.getElementsByName('email')[0];
    const emailError = document.getElementById('emailerror');
    const email = emailInput.value.trim();
    const exptext = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!exptext.test(email)) {
        emailError.innerHTML = "Incorrect email address format";
        return;
    } else {
        emailError.innerHTML = "";
        toggle();
        countdown()
    }
}

//코드입력창 엽 카운트다운
function countdown() {
        var element, endTime, hours, mins, msLeft, time;

        function updateTimer() {
            msLeft = endTime - (+new Date);
            if (msLeft < 0) {
                console.log('done');
            } else {
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                element.innerHTML =  (hours ? hours + ':' + ('0' + mins).slice(-2) : mins) + ':' + ('0' + time.getUTCSeconds()).slice(-2);
                setTimeout(updateTimer, time.getUTCMilliseconds());
            }
        }

        element = document.getElementById('timer');
        endTime = (+new Date) + 1000 * 600;
        updateTimer();
    }



app.post('/postemail', async (req,res)=>{
    const email=req.body.email;
    console.log(email)


})


module.exports = app;