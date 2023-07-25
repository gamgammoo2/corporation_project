const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('sync-mysql');
const env = require('dotenv').config({ path: "../../../../.env" });
const axios = require('axios');

var connection = new mysql({
    host: process.env.host,
    user: process.env.user,
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

app.get('/combined_frame3/:year1/:year2', (req, res) => {
    const { year1, year2 } = req.params;
    const apiUrl = `http://192.168.1.187:3000/combined_frame3/${year1}/${year2}`;

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