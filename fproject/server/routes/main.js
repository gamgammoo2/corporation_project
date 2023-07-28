const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('sync-mysql');
const env = require('dotenv').config({ path: "../../.env" });

var connection = new mysql({
    host: process.env.host,
    user: process.env.user,
    port: process.env.port,
    password: process.env.password,
    database: process.env.database
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
    res.send('hello world!');
})

// 이름,이메일 넣고 보냈을 때 preuser와 매칭되는지(둘 다 매칭되야함) 비교 후 realuser에 넣기 or holduser에 넣기
app.post('/match', (req, res) => {
    const {name,email,id,password,stgroup} = req.body;
    const result = connection.query("select * from preuser where name=? and email=?",[name,email])
    // 입력칸에서 빈 공백이 존재하는지 확인. ===로 더 정확히 확인.
    if (name==="" || email==="" || id==="" || password==="" || stgroup==="") {
        res.send("Please Complete Blank(s)")
    }

    // 닉네임이 이미 등록되어있는지 확인
    connection.query("select * from realuser where id=?",[id],(nickcheckerror,nickcheck) => {
        if (nickcheckerror) {
            console.error("Error for checking nickname:", nickcheckerror);
            return res.status(500).send("Error for checking nickname");
        }

        if (nickcheck.length > 0) {
            return res.send("This nickname is already registered!");
        }

        // 이메일이 이미 존재하는지 확인.
        connection.query("select * from realuser where email=?",[email],(emailcheckerror,emailcheck) => {
            if (emailcheckerror) {
                console.error("error for checking email:", emailcheckerror);
            }
            if (emailcheck.length > 0) {
                return res.send("This email is already registered!")
            }

            // DB에 data 넣기.
            connection.query("insert into realuser (name, email, id,password,stgroup) values (?,?,?,?,?)",[name,email,id,password,stgroup], (inserterror,result)=>{
                if (inserterror) {
                    console.error("error in inserting row:", inserterror);
                    return res.status(500).send("error in inserting row into the database.");
                }
                console.log("Name:",name,"Email:",email + " => Now Registered!");
                return res.send("registrered successfully!!")
            })
        })
    })










    //     if (result.length == 0) {
    //         connection.query("select realuser.*, holduser.* from (realuser,holduser) where realuser.id=? or holduser.id=?",[id,id])
    //         if (result.length == 0) {
    //             res.send("Nickname already registered")
    //         } else {
    //             connection.query("select realuser.*,holduser.* from (realuser,holduser) where realuser.email=? or holduser.email=?", [email,email])
    //             if (result.length == 0) {
    //                 res.send("Email already registered")
    //             } else {
    //                 connection.query("insert into holduser (name,email,id,password,stgroup) values (?,?,?,?,?)", [name, email, id, password, stgroup], (error, result) => {
    //                     if (error) {
    //                         console.error("Error inserting row:", error);
    //                         return res.status(500).send("Error inserting row into the database.");
    //                     }
    //                 })
    //                 console.log("Name :",name,",Email :",email+" => Holding")
    //             }
    //         }
    //     }
    //  else {
    //         if (result.length == 0) {
    //             connection.query("select realuser.*, holduser.* from (realuser,holduser) where realuser.id=? or holduser.id=?", [id, id])
    //             if (result.length == 0) {
    //                 res.send("Nickname already registered")
    //             } else {
    //                 connection.query("select realuser.*,holduser.* from (realuser,holduser) where realuser.email=? or holduser.email=?", [email, email])
    //                 if (result.length == 0) {
    //                     res.send("Email already registered")
    //                 } else {
    //                     connection.query("insert into realuser (name,email,id,password,stgroup) values (?,?,?,?,?)", [name, email, id, password, stgroup], (error, result) => {
    //                         if (error) {
    //                             console.error("Error inserting row:", error);
    //                             return res.status(500).send("Error inserting row into the database.");
    //                         }
    //                         console.log("Row inserted successfully:", result);
    //                     })
    //                     console.log("Name :", name, ",Email :", email + " => Now Registered!")
    //                 }
    //             }
    //         }
    //     }
    });


// preuser에 name과 email을 넣기
app.post("/insert", (req, res) => {
    const {name,email} = req.body;
    const result = connection.query("INSERT INTO preuser (name,email) VALUES (?,?)", [name,email], (error, result) => {
        if (error) {
            console.error("Error inserting row:", error);
            return res.status(500).send("Error inserting row into the database.");
        }
        console.log("Row inserted successfully:", result);
        // res.redirect('/match');
    });
});


// app.post("/insert", (req, res) => {
//     const {num, email, id, password,staging} = req.body
//     const query = "INSERT INTO preuser VALUES (?,?,?,?,?)"; // 수정된 SQL 쿼리

//     connection.query(query, [email, id, password,staging], (err, result) => {
//         if (err) {
//             console.error("Error executing query:", err);
//             return res.status(500).send("An error occurred while inserting data.");
//         }

//         console.log("Data inserted successfully!");
//         res.redirect('/match');
//     });
// });

module.exports = app;