const express = require('express')
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json())

let mysql = require('mysql');
let connection = mysql.createConnection({
    database: "Usuarios",
    host: "anthill-database.cxgso31trbdb.us-east-2.rds.amazonaws.com",
    user: "kurtybrown",
    password: "z1b23op9$"
})
connection.connect();

let port = process.env.PORT || 300

app.listen(port)

app.get("/usuarios", function(request, response){
           let sql = "SELECT * FROM Usuarios"
        connection.query(sql, function(err, res){
        if (err) response.send(err)
        else response.send(res)
        })
})