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
async function toggle() {
    const email = document.getElementById('email')
    const Div = document.getElementById('inputDiv');
    const emailbut = document.getElementById('checkemail')

    if (Div.style.display == "none") {
        Div.style.display = "block";
        email.disabled = true; //toggle 되면 다시 토글 안되게, email inputbox가 비활성화 되도록.
        emailbut.style.display = "none";
    } else {
        Div.style.display = "none";
    }

}

// function checkEmail() {
//     const emailInput = document.getElementById('email');
//     const emailError = document.getElementById('emailerror');
//     const exptext = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (!exptext.test(emailInput.value.trim())) {
//         emailError.innerHTML = "Incorrect email address format";
//         return false;
//     } else {
//         emailError.innerHTML = "";
//         return true;
//     }
// }

// //verify 버튼 onclick
// function submitForm(event) {
//     event.preventDefault(); //form이 제출되기 전에 막아두기

//     if (checkEmail()) {
//         const emailInput = document.getElementById('email');
//         const email = emailInput.value.trim();

//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', '/postemail', true);
//         xhr.setRequestHeader('Content-Type', 'application/json');

//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     const data = JSON.parse(xhr.responseText);
//                     console.log(data);
//                     toggle();
//                     countdown();
//                 } else if (xhr.status === 409) {
//                     const errorResponse = JSON.parse(xhr.responseText);
//                     const errorMessage = errorResponse.error;
//                     alert(errorMessage);
//                 } else {
//                     console.error('Request failed with status:', xhr.status);
//                 }
//             }
//         };

//         const requestData = JSON.stringify({ email: email });
//         xhr.send(requestData);
//     }
// }

//verify 뿐만아니라 confirm 버튼도 마찬가지로 preventdefault를 추가하기위해서 각각이 눌러졌을 때, submitForm함수가 각각에 맞추어 실행되도록 만듬

// Verify 버튼 클릭 시
function verifyEmail(event) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailerror');
    const exptext = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!exptext.test(emailInput.value.trim())) {
        emailError.innerHTML = "Incorrect email address format";
        return false;
    } else {
        emailError.innerHTML = "";
        submitForm(event, '/postemail');//각각에 맞는 함수 실행
        return true;
    }
}

// Confirm 버튼 클릭 시
function confirmToken(event) {
    submitForm(event, '/checktoken');
}


// 폼 제출 함수
function submitForm(event, action) {
    event.preventDefault(); // form이 제출되기 전에 막아두기

    if (verifyEmail() !== false) {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    toggle();
                    countdown();
                } else if (xhr.status === 409) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            }
        };

        const requestData = JSON.stringify({ email: email });
        xhr.send(requestData);
    }
}



//코드입력창 옆 카운트다운
async function countdown() {
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
        endTime = (+new Date) + 1000 * 60; //600이 10분
        updateTimer();
}

// //토큰 확인과 함께 countdown 구성
// async function countdown() {
//     var element, endTime, hours, mins, msLeft, time;
//     var tokenConfirmed = false; // 토큰이 확인됬는지를 쫓기

//     const tokenInput = document.getElementsByName('token')[0];
//     const tokenResendButton = document.getElementById('tokenresend');
//     const tokenConfirmButton = document.getElementById('tokenconfirm');

//     // Confirm 버튼 활성화 여부를 체크하는 함수
//     function checkConfirmButton() {
//         tokenConfirmButton.disabled = tokenInput.value.length < 6;
//     }
    
//     // Confirm 버튼 활성화 여부 감시
//     tokenInput.addEventListener('input', checkConfirmButton);

//     // 타이머 기능
//     function updateTimer() {
//         msLeft = endTime - (+new Date);
//         if (tokenConfirmed== false && msLeft < 0) {
//             console.log('done');
//             // 10분안에 입력하지 않은 코드는 expired
//             alert('Code expired. Please resend Code.');
//             tokenResendButton.disabled = false;
//             tokenConfirmButton.disabled=true;
//             tokenInput.disabled=true;
//          } else { //timeout 안됬을때
//             time = new Date(msLeft);
//             hours = time.getUTCHours();
//             mins = time.getUTCMinutes();
//             element.innerHTML = (hours ? hours + ':' + ('0' + mins).slice(-2) : mins) + ':' + ('0' + time.getUTCSeconds()).slice(-2); 
            
//             // Confirm 버튼 눌렀는지 여부 감시
//             tokenConfirmButton.addEventListener('click', checktoken);


//             setTimeout(updateTimer, time.getUTCMilliseconds());
//         }
//     }
//     element = document.getElementById('timer');
//     endTime = (+new Date) + 1000 * 30; // 600이 10분 5는 5초
//     updateTimer();
// }

function resetCountdown() {
    const tokenResendButton = document.getElementById('tokenresend');
    const tokenInput = document.getElementsByName('token')[0];
    tokenInput.disabled = false;
    tokenResendButton.disabled = true;
    countdown(); // countdown을 다시 시작함
    tokenConfirmed = false; // 토큰 기준을 false로 둠.
    tokenInput.value = ""
}

// async function checktoken() {
//     const tokenInput = document.getElementsByName('token')[0];
//     console.log(tokenInput)
//     const email = document.getElementById('email').value
//     const token = tokenInput.value;
//     console.log(token)

//     // db에서 토큰일치 확인
//     const isTokenValid = await connection.query('select token from tryuser where email=?',[email]);

//     console.log(isTokenValid)

//     if (isTokenValid.length > 0) {
//         // 토큰 맞아 떨어지면, 토큰 기준 수정(true로 )
//         tokenConfirmed = true;
//         // return true
//     } else {

//         return false;
//     }
// }

app.post('/postemail', async (req, res) => {
    const email = req.body.email;
    console.log(email)

    const preemail = await connection.query("select email from realuser where email=?", [email]);
    console.log(preemail[0].length)

    if (preemail[0].length > 0) {
        const errorMessage = "This email address is already in use. Login with the email address, or try signing up with a different email address.";
        res.status(409).json({ error: errorMessage });
    } else {
        res.status(200).json({ message: 'Received email: ' + email });
    }
})

app.post('/checktoken', async (req, res) => {
    const {email, token} = req.body;
    console.log(email)
    console.log(token)

    // db에서 토큰일치 확인
    const isTokenValid = await connection.query('select token from tryuser where email=? and token', [email, token]);

    console.log(isTokenValid)

    if (isTokenValid.length > 0) {
        // 토큰 맞아 떨어지면, 토큰 기준 수정(true로 )
        console.log(ok)
        // tokenConfirmed = true;
        // return true
    } else {
        console.log(fail)
        // return false;
    }
})


module.exports = app;






// //이메일 유효성 검사(일치 시 토글과 카운트다운이 실행)
// async function checkEmail(email) {
//     // const emailInput = document.getElementsByName('email')[0];
//     const emailError = document.getElementById('emailerror');
//     const exptext = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (!exptext.test(email)) {
//         emailError.innerHTML = "Incorrect email address format";
//         return false;
//     } else {
//         emailError.innerHTML = "";
//         toggle();
//         countdown();
//         return true;
//     }
// }


// async function submitForm(event) {
//     event.preventDefault(); //form의 제출을 기본적으로 막아둠.

//     const emailInput = document.getElementById('email');
//     const email = emailInput.value.trim();

//     if (checkEmail(email)) {
//         const xhr = new XMLHttpRequest(); //xmlhr 객체 생성 -> 변수에 할당
//         xhr.open('POST', '/postemail', true); // open 메서드 사용해 요청타입과 주소 설정. true는 비동기 요청을 나타냄
//         xhr.setRequestHeader('Content-Type', 'application/json'); //set~메서드 사용해 요청의 헤더 설정. type은 요청 데이터 타입. json 형식으로 데이터 보낼 것을 나타냄
        
//         xhr.onreadystatechange = function () {
//             console.log('xhr state changed:', xhr.readyState);
//             if (xhr.readyState == XMLHttpRequest.DONE) { //ready~는 요청의 상태. xml~.done은 요청이 완료되었음. (즉 요청이 완료되었을 때 조건문)
//                 if (xhr.status == 200) {  //요청 상태코드 확인해 요청이 성공인지 여부 판단. 200 은 성공상태
//                     const data = JSON.parse(xhr.responseText);
//                     console.log(data);
//                 } else if (xhr.status === 409) {
//                     const errorResponse = JSON.parse(xhr.responseText);
//                     const errorMessage = errorResponse.error;
//                     alert(errorMessage); 
//                 } else {
//                     console.error('Request failed with status:', xhr.status);
//                 }
//             }
//         }; //onready~ 는 이벤트 핸들러를 설정 -> 요청의 상태 변화 감지 및 처리하는 코드 정의.
//         const requestData = JSON.stringify({ email: email }); //요청 데이터를 json 형식으로 문자열화. email값을 객체 형태로 감싸 json으로 변환
//         xhr.send(requestData);  // 생성한 요청 데이터를 실제 서버로 보냄.
//     }
// }

