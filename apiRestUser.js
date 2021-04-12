const express = require('express')
const app = express();
const cors = require('cors')

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())


let mysql = require('mysql');
let connection = mysql.createConnection({
    database: "Anthill",
    host: "anthill-database.cxgso31trbdb.us-east-2.rds.amazonaws.com",
    user: "kurtybrown",
    password: "z1b23op9$"
})
connection.connect();

let port = process.env.PORT || 300

app.listen(port)
