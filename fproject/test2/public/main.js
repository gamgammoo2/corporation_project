const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');
const { group } = require('console');

const env = require('dotenv').config({ path: "../../.env" });



function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const{ SendEmailCommand, SESClient } = require('@aws-sdk/client-ses');


class EmailService {
    constructor() {
        this.sesClient = new SESClient({
            region: 'ap-northeast-2', // AWS Region 서울로 설정
        });
    }

    async sendSimpleMail(to, token) {
        const command = new SendEmailCommand({
            Destination: {
                //목적지
                CcAddresses: [],
                ToAddresses: [to], // 받을 사람의 이메일
            },
            Message: {
                Body: { // 이메일 본문 내용
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                        <head>
                        </head>
                        <body>
                        <div style="width: 500px;">
                            <div style="width:500px; height:150px; background-color: #1B1F38; ">
                            <br>
                                <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F3qPvf%2Fbtsr3b2mlHw%2FSQoHJDA4beqCPVDLFGwLZk%2Fimg.png" alt="securityground image"/ style="width : 200px; height:25px; margin-left:20px;" >
                                <br>
                                <br>
                                <h2 style="color: white; margin-left: 20px;">Verification Code</h2>
                            </div>
                            <br></br>
                            <div style="text-align: center; align-items:center; min-height: 200px;">
                                <h3>Enter below verification code to sign up.</h3>
                                <div style="display: inline-block; background-color: #f8f9fa; text-align: center; padding:20px;">
                                    <h3>Verification Code</h3>
                                    <h1>`+ [token] +`</h1>
                                </div>
                                <br/>
                                <p style="color:gray;">Code expires in 10 minutes. <br/>Do not share verification code.</p>
                            </div>
                            <div style="margin-top: 50px; text-align: right; background-color: #f8f9fa;">
                                <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F0KvwT%2Fbtsr4L96257%2FDni79Cb6V58uALKPtq1Jo1%2Fimg.png" alt="nshc image" />
                                <p>NSHC<br />
                                186, Gasan digital 1-ro, Geumcheon-gu, Seoul, Republic of Korea, 08502<br />
                                email: support@securityground.net</p>
                            </div>
                            <br/>
                            <div style="border-top: 1px solid black;"></div>
                        </div>

                        </body>`

                    }
                    // Text: {
                    //     Charset: 'UTF-8',
                    //     Data:"[SecurityGround] Verification Code"+[token]+,
                    // },
                },
                Subject: { // 이메일 제목
                    Charset: 'UTF-8',
                    Data: '[SecurityGround] Verification Code',
                },
            },
            Source: 'support@securityground.net', // 보내는 사람의 이메일 - 무조건 Verfied된 identity여야 함
            ReplyToAddresses: [],
        });

        try {
            const response = await this.sesClient.send(command);
            console.log("sending email success\n", response.$metadata);
        } catch (error) {
            console.log(error);
        }
    }
}
//

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


function signupbutton() {
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('password2');
    var nicknam = document.getElementById('nickname');
    var signupbut= document.getElementById('signup')

    if (pass1.value.trim() !==''&& pass2.value.trim()!=='' && nicknam.value.trim()!=='') {
        signupbut.disabled = false;
    } else {
        signupbut.disabled = true;
    }
}

//verify 버튼 토클
async function toggle1() {
    const email = document.getElementById('email')
    const Div = document.getElementById('inputDiv');


    if (Div.style.display == "none") {
        Div.style.display = "block";
        email.disabled = true; //toggle 되면 다시 토글 안되게, email inputbox가 비활성화 되도록.
       
    } else {
        Div.style.display = "none";
    }

}

//verify 버튼 토클
async function toggle2(name,group,team) {
    const Div1 = document.getElementById('inputDiv');
    const Div2 = document.getElementById('preinformation');
    const span1=document.getElementById('h3_1')
    const span2 = document.getElementById('h3_2')

    const namebox = document.getElementById('name');
    const groupbox = document.getElementById('group');
    const teambox = document.getElementById('team');

    if (Div2.style.display == "none") {
        Div2.style.display = "block";
        Div1.style.display = "none";
        span1.style.display="none";
        span2.style.display="block"

        namebox.value = name;
        groupbox.value = group;
        teambox.value = team;
    } else {
        Div2.style.display = "none";
    }

}

//preuser continue 버튼 이후, notpreuser confirm 이후
async function toggle3() {
    const Div1 = document.getElementById('inputDiv');
    const Div2 = document.getElementById('preinformation');
    const Div3 = document.getElementById('realinformation');
    const span1 = document.getElementById('h3_1')
    const span2 = document.getElementById('h3_2')
    const span3 = document.getElementById('h3_3')

    // const passbox = document.getElementById('password');
    // const pass2wbox = document.getElementById('password2');
    // const nickbox = document.getElementById('nickname');

    if (Div3.style.display == "none") {
        Div3.style.display = "block";
        Div2.style.display = "none";
        Div1.style.display = "none";
        span1.style.display = "none";
        span2.style.display = "none";
        span3.style.display = "block"

    } else {
        Div3.style.display = "none";
    }

}

//verify 뿐만아니라 confirm 버튼도 마찬가지로 preventdefault를 추가하기위해서 각각이 눌러졌을 때, submitForm함수가 각각에 맞추어 실행되도록 만듬

// Verify 버튼 클릭 시
function verifyEmail(event) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailerror');
    const emailbut = document.getElementById('checkemail')
    const exptext = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!exptext.test(emailInput.value.trim())) {
        emailError.innerHTML = "Incorrect email address format";
        // return false;
    } else {
        emailError.innerHTML = "";
        submitForm(event, '/postemail');//각각에 맞는 함수 실행
         emailbut.style.display = "none";
        // return true;
    }
}

// Confirm 버튼 클릭 시
function confirmToken(event) {
    submitForm(event, '/checktoken');
}

function informcontinue(){
    toggle3()
}

function signUp(event){
    submitForm(event,'/realsignup')
} 

function login() { //login page 이동
    location.href='./login.html';
}


//팝업창
/* 바디 영역 투명도 표시 이벤트 함수 정의 */
function bodyFull() {
    /* display 값 확인 */
    var tagId = document.getElementById("body_full");
    var display = window.getComputedStyle(tagId).display;

    if (display == "none") {
        console.log("bodyFull : debug [2]");
        tagId.style.display = "block";
    }
    else {
        console.log("bodyFull : debug [3]");
        tagId.style.display = "none";
    }
};


/* 팝업창 호출 이벤트 함수 정의 */
function call_popup(up,down) {
    /* display 값 확인 */
    var tagId = document.getElementById("popup_container");
    var display = window.getComputedStyle(tagId).display;

    if (display == "none") {
        document.getElementById('up_text').innerHTML = up;
        document.getElementById('down_text').innerHTML = down;
        tagId.style.display = "block";
    }
    else {
        tagId.style.display = "none";
    }

    /* body 영역 투명도 표시 함수 호출 */
    bodyFull();
};


// 폼 제출 함수 - verify email, token check,realsignup
function submitForm(event, action) {
    event.preventDefault(); // form이 제출되기 전에 막아두기

    if (action == '/postemail') { //email form 처리
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    const token = data.token
                    toggle1();
                    countdown();
                    // sendEmail(email,token)

                }else if (xhr.status == 408) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    call_popup('Warning!',errorMessage) //holding 유저가 가입하려할때
                } else if (xhr.status == 409) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else if (xhr.status == 407) {
                    console.error('insert Token failed in DB', xhr.status);
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            }
        };

        const requestData = JSON.stringify({ email: email });
        xhr.send(requestData);
    } else if (action =='/checktoken'){ //token form 처리 확인
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        const tokenInput = document.getElementById('token');
        const token = tokenInput.value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        console.log('true')
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log({'preuser_ok_xhr':data});
                    nocountdown()
                    alert('Email Confirmed!')
                    toggle2(data.username[0][0].name,data.usergroup[0][0].stgroup,data.userteam[0][0].team)
                    
                } else if (xhr.status == 201) {
                    const dataresponse = JSON.parse(xhr.responseText);
                    const message = dataresponse.message 
                    console.log({ 'nopreuser_ok_xhr': dataresponse });
                    nocountdown()
                    if(confirm(message)==true){
                        toggle3()
                    } else {
                        location.reload();
                    }
                } else if (xhr.status == 409) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            }
        };

        const requestData = JSON.stringify({ email: email, token: token });
        xhr.send(requestData);
        console.log(requestData)
    } else if (action =='/realsignup') { //signup form
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        const password = document.getElementById('password').value;
        const password2 = document.getElementById('password2').value;
        const nickname = document.getElementById('nickname').value;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    const successResponse = JSON.parse(xhr.responseText);
                    const successmessage = successResponse.success;
                    alert(successmessage);
                    login()
                }else if (xhr.status == 201) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    const successResponse = JSON.parse(xhr.responseText);
                    const successmessage = successResponse.success;
                    alert(successmessage);
                    login()
                }else if (xhr.status == 407) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                }else if (xhr.status == 408) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else if (xhr.status == 409) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else if (xhr.status == 410) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage);
                } else if (xhr.status == 501){
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    alert(errorMessage); 
                } else {
                    console.error('Request failed with status:', xhr.status);
                }
            }
        };

        const requestData = JSON.stringify({ email: email, password:password,password2:password2, nickname:nickname}); //여기서 보내줘야 post의 body로 보내질 수 있음(8/21 하루종일 못찾은 오류...)
        xhr.send(requestData);
    } else { //resend token update
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', action, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const requestData = JSON.stringify({ email: email});
        xhr.send(requestData);
        console.log(requestData)
    }
}

//countdown() 함수 수정 (confirm 되면 countdown이 멈출 수 있게)
var timeout;

//토큰 확인과 함께 countdown 구성
async function countdown() {
        
        var element, endTime, hours, mins, msLeft, time;
        // var timerid //confirm시 countdown 중지를 위한 변수
        var tokenConfirmed = false

        const tokenInput = document.getElementsByName('token')[0];
        const tokenResendButton = document.getElementById('tokenresend');
        const tokenConfirmButton = document.getElementById('tokenconfirm');

        // Confirm 버튼 활성화 여부를 체크하는 함수
        function checkConfirmButton() {
            tokenConfirmButton.disabled = tokenInput.value.length < 6;
        }
        
        // Confirm 버튼 활성화 여부 감시
        tokenInput.addEventListener('input', checkConfirmButton);

        // 타이머 기능
        function updateTimer() {
            msLeft = endTime - (+new Date);
            if (tokenConfirmed== false && msLeft < 0) {
                console.log('done');
                // 10분안에 입력하지 않은 코드는 expired
                alert('Code expired. Please resend Code.');
                tokenResendButton.disabled = false;
                tokenConfirmButton.disabled=true;
                tokenInput.disabled=true;

            } else { //timeout 안됬을때,token 일치 안함 => 시간 계속 흐름
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                element.innerHTML = (hours ? hours + ':' + ('0' + mins).slice(-2) : mins) + ':' + ('0' + time.getUTCSeconds()).slice(-2); 

               timeout = setTimeout(updateTimer, time.getUTCMilliseconds());
            }
        }
        element = document.getElementById('timer');
        endTime = (+new Date) + 1000 * 120; // 600이 10분 5는 5초
        updateTimer();
    
}

async function nocountdown() { //confirm 되면 countdown이 멈추기 0:00 표시
    var element, msLeft, endTime
    var tokenConfirmed = true

    var tokenConfirmButton = document.getElementById('tokenconfirm');

    // 타이머 기능
    function updateTimer2() {
        if (tokenConfirmed == true) {
            tokenConfirmButton.disabled = true;
            element.innerHTML = '0:00'
            clearTimeout(timeout)
        } 
    }
    element = document.getElementById('timer');
    updateTimer2();

}

function resetCountdown(event) { //resend 버튼 누르면 실행되는 동작
    const tokenResendButton = document.getElementById('tokenresend');
    const tokenInput = document.getElementsByName('token')[0];
    tokenInput.disabled = false;
    tokenResendButton.disabled = true;
    countdown(); // countdown을 다시 시작함
    submitForm(event,'/updatetoken')
    tokenInput.value = ""
}



app.post('/postemail', async (req, res) => {
    const email = req.body.email;
    console.log(email)

    const alreadyemail = await connection.query("select email from realuser where email=?", [email]);
    const holdemail = await connection.query("select email from holding where email=?",[email])
    const token=rand(100000,999999)//숫자 6자리 랜덤 생성 ->이메일에 보낼 것 rand함수는 위에 있음.
    const now = new Date()
    now.setMinutes(now.getMinutes() +10)
    const expired = new Date(now)  //expired 넣을껀데 10분 + 헤서 넣을 것.

    if (alreadyemail[0].length > 0) {
        const errorMessage = "This email address is already in use. Login with the email address, or try signing up with a different email address.";
        res.status(409).json({ error: errorMessage });
    }else if (alreadyemail[0].length ==0 && holdemail[0].length >0) {
        const holdingMessage = "Administrator is checking about your signup form. We will send an email to you after checking it.";
        res.status(408).json({error : holdingMessage})
    } else {
        const insertingcheck = await connection.query('select token from tryuser where email=? and state=?', [email, 'tokensend'])
        console.log(insertingcheck.length)

        if (insertingcheck.length > 1) {
            connection.query('delete from tryuser where email=? and state=?',[email,'tokensend'])
            connection.query('delete from tryuser where email=? and state=?', [email, 'correct'])
            connection.query('delete from tryuser where email=? and state=?', [email, 'correct_h'])

            // setTimeout(async () =>{
                connection.query('insert into tryuser values (?,?,?,?,?)', [, email, token, expired, 'tokensend'])

                // setTimeout(async () => {
                const insertingcheck2 = await connection.query('select token from tryuser where email=? and state=?', [email, 'tokensend'])

                if (3 > insertingcheck2.length > 0) {
                    let ses = new EmailService()
                    ses.sendSimpleMail(email,token)
                    res.status(200).json({ message: 'Received email: ' + email,token:token })
                } else {
                    res.status(407).json({ error: "db token insert error" })
                }
            // },5);

            // },5)
        } else {
            connection.query('update tryuser set token=? where email=?',[token,email])
            setTimeout(async () => {
                const insertingcheck3 = await connection.query('select token from tryuser where email=? and state=?', [email, 'tokensend'])

                if (3 > insertingcheck3.length > 0) {
                    // sendEmail({toAddress:email},{fromAddress:"no1470741@gmail.com"})
                    res.status(200).json({ message: 'Received email: ' + email })
                } else {
                    res.status(407).json({ error: "db token insert error" })
                }
            },5);
        }
    }
})

app.post('/checktoken', async (req, res) => {
    const {token,email}= req.body;

    // db에서 토큰일치 확인
    const isTokenValid = await connection.query('select token from tryuser where email=? and token=?', [email, token]);
    const preuser = await connection.query('select email from preuser where email=?', [email]);

    console.log(isTokenValid[0].length)

    if (isTokenValid[0].length > 0 && preuser[0].length >0) {
        await connection.query('update tryuser set state=? where email=?',['correct',email])

        //db 정보 가져오기
        const username = await connection.query('select name from preuser where email=?', [email])
        const usergroup = await connection.query('select stgroup from preuser where email=?', [email])
        const userteam = await connection.query('select team from preuser where email=?', [email])

        res.status(200).json({ message: 'Received token: ' + token , username : username, usergroup:usergroup, userteam:userteam });

    } else if (isTokenValid[0].length > 0 && preuser[0].length == 0) { //사전 미 등록자\
        await connection.query('update tryuser set state=? where email=?', ['correct_h', email])

        const warning="Unregistered Email Address. You may verify this email address, but it requires approval before activation."
        res.status(201).json({message: warning});
    } else {
        // console.log('fail')
        const errorMessage = "Incorrect verification code. Please try again.";
        res.status(409).json({ error: errorMessage });
    }
})


app.post('/updatetoken', async (req, res) => {
    const email = req.body.email;


    var token2=rand(100000,999999).toString()//숫자 6자리 랜덤 생성 ->이메일에 보낼 것 rand함수는 위에 있음.
    var now = new Date()
    now.setMinutes(now.getMinutes() +10)
    var expired = new Date(now)
    // const email = document.forms["postemail"].element["email"].value;
    console.log(email)
    console.log(token2)
    console.log(now)

    // db에서 토큰일치 확인
    await connection.query('update tryuser set expired=? where email=?', [expired, email]); //expired time이 왜인지...영국 기준으로 되어있는 것 같다.
    await connection.query('update tryuser set token=? where email=?', [token2, email]) //set expired and token 두개로 뒀는데 token이 입력이 안되서 따로 만듬
    let ses = new EmailService()
    ses.sendSimpleMail(email,token2)
})

app.post('/realsignup', async (req, res) => {
    const {email,password,password2,nickname} = req.body;

    console.log(email)
    console.log(password)
    console.log(password2)
    console.log(nickname)

    //db에서 토큰인증이 된 유저만 고르기 -> preuser인지의 유무
    const states=await connection.query('select state from tryuser where email=?', [email]); //expired time이 왜인지...영국 기준으로 되어있는 것 같다.

    //nickname 중복체크
    const nickdouble1=await connection.query('select nick from realuser where nick=?',[nickname])
    const nickdouble2=await connection.query('select nick from holding where nick=?',[nickname])

    const usergroup = await connection.query('select stgroup from preuser where email=?', [email])
    const userteam = await connection.query('select team from preuser where email=?', [email])

    if (nickdouble1[0]=="" || nickdouble2[0]== "") {

        if (password==password2 ) { //다 만족
            if ( states[0][0].state=='correct') { //preuser
                await connection.query('insert into realuser values (?,?,?,?,?,?)',[,email,nickname,password,usergroup[0][0].stgroup,userteam[0][0].team])
                const successmessage = "Thank you for signing up! You are signed up.Try login now";
                await connection.query('update tryuser set state=? where email=?', ["done", email]);
                res.status(200).json({ success:successmessage , username : nickname, usergroup:usergroup, userteam:userteam });
            } else if (states[0][0].state =='correct_h') { //not preuser
                await connection.query('insert into holding values (?,?,?,?)',[,email,nickname,password])
                await connection.query('update tryuser set state=? where email=?', ["done", email]);
                const successmessage2 = "Thank you for signing up! You are signed up. You may login after approval.";
                res.status(201).json({ success:successmessage2 , username : nickname});
            } else {
                const errorMessage4 = "Sorry. There is something missing.";
                res.status(410).json({ error: errorMessage4 });
            } 
        } else if (password != password2 && 13>nickname.length >=2) { //패스워드 불일치
            const errorMessage1 = "Please Check Forms(passwords)";
            res.status(407).json({ error: errorMessage1 });
        } else if (password == password2 && nickname.length <2 ||nickname.length >12){
            //닉네임 길이
            const errorMessage2 = "Please Check Forms(nickname)";
            res.status(408).json({ error: errorMessage2 });
        }else {
            const errorMessage3 = "Please Check Forms";
            res.status(409).json({ error: errorMessage3 });
        }
    }else {
        const nickerror="This nickname already exists."
        res.status(501).json({error : nickerror})
    }
})

module.exports = app;


