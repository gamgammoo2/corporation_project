const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
// const mysql = require('sync-mysql');
const env = require('dotenv').config({ path: "../../.env" });


// nodemail
const nodemailer=require('nodemailer');
const senderInfo = require('../secret.json');
//nodemaile

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
// app.use(express.urlencoded({ extended: true }));

//nodemailer
// 메일발송 객체
let mailSender = {
    // 메일발송 함수
    sendGmail(param) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',   // 메일 보내는 곳
            port: 587,
            host: 'smtp.gmlail.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: senderInfo.user,  // 보내는 메일의 주소
                pass: senderInfo.pass   // 보내는 메일의 비밀번호
            }
        });

        // 메일 옵션
        let mailOptions = {
            from: senderInfo.user, // 보내는 메일의 주소
            to: param.toEmail, // 수신할 이메일
            subject: param.subject, // 메일 제목
            text: param.text // 메일 내용
        };

        // 메일 발송    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }
}
//nodemailer



app.get('/hello', (req, res) => {
    res.send('hello world!');
})

// 이름,이메일 넣고 보냈을 때 preuser와 매칭되는지(둘 다 매칭되야함) 비교 후 realuser에 넣기 or holduser에 넣기
app.post('/signup', async (req, res) => {
    const { name, email, nick, password, stgroup } = req.body;
    // 입력칸에서 빈 공백이 존재하는지 확인. -> HTML페이지에서 확인하는걸로 바꿈.
    // if (name == "" || email == "" || nick == "" || password == "" || stgroup == "") {
    //     return res.send("<script>alert('Please Complete Blank(s)'); location.href='history.back()';</script>")
    // }

    //preuser db에 이미 등록된 email인지 확인(사전 등록 확인)
    const [preuserresult] = await connection.query("select * from preuser where email=?", [email])
    if (preuserresult.length === 0) {
        // res.send("Email not found in preuser.")

        //닉네임이 이미 realuser과 holduser db에 입력되어있는지 확인
        const [nickcheckresult] = await connection.query("select * from realuser where nick=? UNION select * from holduser where nick=?", [nick, nick]);
        if (nickcheckresult.length > 0) {
            return res.send("<script>alert('This nickname is already registered!'); history.go(-1);</script>");
        }

        //realuser 또는 holduser db에 email이 이미 등록되어있는지 확인
        const [emailcheckresult] = await connection.query("select * from realuser where email=? UNION select * from holduser where email=?", [email, email]);
        if (emailcheckresult.length > 0) {
            return res.send("<script>alert('This email is already registered!'); history.go(-1);</script>");
        }

        //holduser db에 data 집어넣깅
        try {
            await connection.query("INSERT INTO holduser (name, email, nick, password, stgroup) VALUES (?, ?, ?, ?, ?)", [name, email, nick, password, stgroup]);
            console.log("Name:", name, "Email:", email + " => Holding!");
            return res.send("<script>alert('Sign UP HOLDING'); location.href='/index3.html'; </script>");
        } catch (error) {
            console.error("Error:", error);
            return res.send("<script>alert('Error processing the request.'); history.go(-1);;</script>");
        }
    } else {
        //닉네임이 이미 realuser과 holduser db에 입력되어있는지 확인
        const [nickcheckresult] = await connection.query("select * from realuser where nick=? UNION select * from holduser where nick=?", [nick, nick]);
        if (nickcheckresult.length > 0) {
            return res.send("<script>alert('This nickname is already registered!'); history.go(-1);;</script>");
        }

        //realuser 또는 holduser db에 email이 이미 등록되어있는지 확인
        const [emailcheckresult] = await connection.query("select * from realuser where email=? UNION select * from holduser where email=?", [email, email]);
        if (emailcheckresult.length > 0) {
            return res.send("<script>alert('This email is already registered!'); history.go(-1);</script>");
        }

        //이메일 보내는 작업 위해 mailer 엔드포인트로 post요청 axios 모듈 사용해서 요청 (두개의 엔드포인트(signup, mailer)가 동시 실행이 아니라, 하나의 엔드포인트에서 다른 엔드포인트를 호출하고, 이후 결과를 얻어서 응답을 보낼 수 있게 됌.
        const axios = require('axios');
        const mailerEnd = 'https://43.200.210.69:8000/mailer'
        //try-catch 문은 비동기 작업에서 예외 처리를 효과적으로 처리하는데 도움.
        try {
            await axios.post(mailerEnd, {email});
        } catch (error) {
            console.error("Error for sending email:", error);
            return res.send("<script>alert('Error processing the request.'); history.go(-1);</script>");
        }
        
        //signup 핸들러 함수에서 응답 보내기
        return res.send("<script>alert('Sign UP Completed!'); location.href='/index2.html';</script>");
    });





//일단 주석
//         //realuser db에 data 집어넣깅
//         try {
//             await connection.query("INSERT INTO realuser (name, email, nick, password, stgroup) VALUES (?, ?, ?, ?, ?)", [name, email, nick, password, stgroup]);
//             console.log("Name:", name, "Email:", email + " => Now Registered!");
//             return res.send("<script>alert('Sign UP Completed!'); location.href='/index2.html';</script>");
//         } catch (error) {
//             console.error("Error:", error);
//             return res.send("<script>alert('Error processing the request.'); history.go(-1);;</script>");
//         }
//     }
// });




// // preuser에 name과 email을 넣기
// app.post("/insertpre", (req, res) => {
//     const { name, email } = req.body;
//     const result = connection.query("INSERT INTO preuser (name,email) VALUES (?,?)", [name, email], (error, result) => {
//         if (error) {
//             console.error("Error inserting row:", error);
//             return res.status(500).send("Error inserting row into the database.");
//         }
//         console.log("Row inserted successfully:", result);
//     });
// });


// preuser에 name과 email을 넣기
app.post("/insertpre", async (req, res) => {
    const { name, email } = req.body;
    const result = await connection.query("INSERT INTO preuser (name,email) VALUES (?,?)", [name, email]);
    if (result.length >0) {
        return res.send('Inserted in preuser database: '+ email);
    } else {
        return res.send("Error inserting row into the database.");
    }
});


// realuser에 회원정보을 넣기
app.post("/insertreal", (req, res) => {
    const { name, email, nick, password, stgroup } = req.body;
    const result = connection.query("INSERT INTO realuser (name,email,nick,password,stgroup) VALUES (?,?,?,?,?)", [name, email, nick, password, stgroup], (error, result) => {
        if (error) {
            console.error("Error inserting row:", error);
            return res.status(500).send("Error inserting row into the database.");
        }
        console.log("Row inserted successfully:", result);
    });
});

module.exports = app;