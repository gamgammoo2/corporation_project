const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
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
// app.use(express.urlencoded({ extended: true }));

function token() {
    result = Math.random().toString(36).substring(2, 11);
}



app.post('/nickcheck', async (req,res) => {
    const nick = req.body;
    const [nickcheckresult] = await connection.query("select * from user where nick=? UNION select * from realuser where nick=?",[nick, nick]);
    if (nickcheckresult.length > 0) {
        return res.send("<script>alert('This nickname is already registered!'); history.go(-1);</script>");
    } else {
        return res.send("<script>alert('You can use this Nickname!!');</script>")
    }
})


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

        //realuser db에 data 집어넣깅
        try {
            await connection.query("INSERT INTO realuser (name, email, nick, password, stgroup) VALUES (?, ?, ?, ?, ?)", [name, email, nick, password, stgroup]);
            console.log("Name:", name, "Email:", email + " => Now Registered!");
            return res.send("<script>alert('Sign UP Completed!'); location.href='/index2.html';</script>");
        } catch (error) {
            console.error("Error:", error);
            return res.send("<script>alert('Error processing the request.'); history.go(-1);;</script>");
        }
    }
});




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