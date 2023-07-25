const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const mysql = require('sync-mysql');
const env = require('dotenv').config({ path: "../../../.env" });
const axios = require('axios');
const internal = require('stream');
const { Double } = require('bson');
const { stringify } = require('querystring');

var connection = new mysql({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

// ------------mongodb
// schema 정의
var preuser_schema = mongoose.Schema({
    no:Double,
    name:string,
    email:String
}, {
    versionKey: false
})

// 몽고디비의 콜렉션과 스키마로 모델 생성
var authusers=mongoose.model('etho',preuser_schema);

// ------------mongodb

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
    res.send('hello world!');
})

// 이름,이메일 넣고 sendemail 보냈을 때 mongodb(pre)와 매칭되는지
app.post('/matchauth', (req, res) => {
    var { USER_NAME, email } = req.body;
    var preuser = new authusers({'no':no,'name':prename,'email':preemail})
    const apiUrl = `http://192.168.1.187:3000/combined_frame3/${name}/${email}`;

    axios
        .get(apiUrl)
        .then(response => {
            const data = response.data;
            res.send(data);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
});

// 산불 결과 txt
app.get('/month_firemongo', (req, res) => {
    const { year1, year2 } = req.query;
    const apiUrl = `http://192.168.1.187:3001/result_fire?year1=${year1}&year2=${year2}`;

    axios
        .get(apiUrl)
        .then(response => {
            const data = response.data;
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

// 미세먼지 결과 txt
app.get('/month_ufmongo', (req, res) => {
    const { year1, year2 } = req.query;
    const apiUrl = `http://192.168.1.187:3000/result_uf?year1=${year1}&year2=${year2}`;

    axios
        .get(apiUrl)
        .then(response => {
            const data = response.data;
            res.json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});
module.exports = app;