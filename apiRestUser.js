const express = require('express')
const app = express();
const cors = require('cors')

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())


let mysql = require('mysql');
const { response } = require('express');
let connection = mysql.createConnection({
    database: "Anthill",
    host: "anthill-database.cxgso31trbdb.us-east-2.rds.amazonaws.com",
    user: "kurtybrown",
    password: "z1b23op9$"
})
connection.connect();

let port = process.env.PORT || 300
app.listen(port)
 
app.post("/productividad", function(request, response){
    let params = [request.body.id_employees, request.body.productivity, request.body.hours, request.body.date]
    let sql = "INSERT INTO productivity (id_employees, productivity, hours, date) VALUES (?, ?, ?, ?)"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send(res)
    })
})

app.post("/empresa/login", function(request, response){
    let params = [request.body.email, request.body.password]
    let sql = "SELECT * FROM companies WHERE email = ? AND password = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else {
            if (res.length > 0){
                response.send({"mensaje": "todo OK", codigo: 1})
            }
            else response.send({"mensaje": "acceso denegado", codigo: 0})
        } //Si devuelve un array vacio no se ha conectado
    })
})

app.post("/empleado/login", function(request, response){
    let params = [request.body.email, request.body.password]
    let sql = "SELECT * FROM employees WHERE email = ? AND password = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else {
            if (res.length > 0){
                response.send({"mensaje": "todo OK", codigo: 1})
            }
            else response.send({"mensaje": "acceso denegado", codigo: 0})
        } //Si devuelve un array vacio no se ha conectado
    })
})

app.get("/vacaciones/empleado", function(request, response){
    let params = [request.query.id_employees]
    let sql = "SELECT holidays.date FROM holidays_employees INNER JOIN holidays ON holidays_employees.id_holidays = holidays.id_holidays WHERE id_employees = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send(res)
    })
})

app.get("/stock", function(request, response){
    let params = [request.query.id_companies]
    let sql = "SELECT * FROM stock WHERE id_companies = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send(res)
    })
})

app.put("/stock", function(request, response){
    let params = [request.body.name, request.body.type, request.body.quantity, request.body.unit, request.body.date, request.body.place, request.body.minQuantity, request.body.id_stock]
    let sql = `UPDATE stock
                    SET name = COALESCE(?, name),
                        type = COALESCE(?, type),
                        quantity = COALESCE(?, quantity),
                        unit = COALESCE(?, unit),
                        date = COALESCE(?, date),
                        place = COALESCE(?, place),
                        minQuantity = COALESCE(?, minQuantity)
                    WHERE id_stock = ?`
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else {
            if (res.changedRows == 0){
                response.send({'mensaje': 'El cambio que solicita ya estaba en la base de datos', codigo: 0})
            }
            else{
                response.send({'mensaje': 'Articulo modificado', codigo: 1})
            }
        }
    })
})

app.delete("/empleado", function(request, response){
    let params = [request.body.id_employees]
    let sql = "DELETE FROM employees WHERE id_employees = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send({'mensaje': 'Empleado borrado', codigo: 1})
    })
})

app.delete("/vacaciones", function(request, response){
    let params = [request.body.id_employees, request.body.id_holidays]
    let sql = "DELETE FROM holidays_employees WHERE id_employees = ? AND id_holidays = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send({'mensaje': 'Dia de vacaciones eliminado', codigo: 1})
    })
})
//-----------------------------------Get-------------------------------------------------//

app.get("/empresa", function(request,response)
    {
        let params= [request.query.id_companies]  
        let sql = "SELECT * FROM companies WHERE id_companies =?"
        connection.query(sql,params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send(res)
            }
        })
    })

app.get("/empleado", function(request,response)
    {
        let params= [request.query.id_companies]  
        let sql = "SELECT * FROM employees WHERE id_companies =?"
        connection.query(sql,params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send(res)
            }
        })
    })

app.get("/empleado/empleado", function(request,response)
    {
        let params= [request.query.id_employees]  
        let sql = "SELECT * FROM employees WHERE id_employees = ?"
        connection.query(sql,params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send(res)
            }
        })
    })

app.get("/productividad/empleado", function(request,response)
    {
        let params= [request.query.id_employees]  
        let sql = "SELECT * FROM productivity WHERE id_employees = ?"
        connection.query(sql,params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send(res)
            }
        })
    })
    app.get("/productividad/fecha", function(request,response)
    {
        let params= [request.query.date]  
        let sql = "SELECT * FROM productivity WHERE date = ?"
        connection.query(sql,params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send(res)
            }
        })
    })

// ----------------------------------Post------------------------------------------------//

app.post("/vacaciones", function(request, response){

    let params = [request.body.date]
    let respuesta;
    let sql = "INSERT INTO holidays (date) VALUES (?)"

    connection.query(sql, params, function(err, res)
    {

          if (request.body.date == null)
            {
                respuesta={error:true, codigo:200, mensaje: "Faltan datos"}
            }
            else
            {
                respuesta={error: false, codigo:200, mensaje: "Vacaciones añadidas correctamente", res:res}
            }
            response.send(respuesta)           
    })
})

app.post("/turnos", function(request, response)
{
    let params = [request.body.employees,request.body.id_shifts, request.body.date]
    let respuesta;
    let sql = "INSERT INTO shifts_employees (id_employees, id_shifts, date) VALUES (?, ?, ?)"

    connection.query(sql, params, function(err, res)
    {

          if (request.body.id_employees== null || request.body.id_shifts == null || request.body.date == null )
            {
                respuesta={error:true, codigo:0, mensaje: "Faltan datos"}
            }
            else
            {
                respuesta={error: false, codigo:1, mensaje: "Vacaciones añadidas correctamente", res:res}
            }
            response.send(respuesta)           
    })
})

//--------------------------------------------------Post-----------------------------------------------------------------//

app.put("/productividad", function(request,response)
{
    let params=[request.body.id_employees, request.body.productivity, request.body.hours, request.body.date,request.body.id_productivity]
    let respuesta;
    let sql= `UPDATE productivity 
                    SET id_employees = COALESCE(?, id_employees),
                        productivity = COALESCE(?, productivity),
                        hours = COALESCE(?, hours),
                        date = COALESCE(?, date)
                    WHERE id_productivity = ?`
    connection.query(sql, params, function(err,res)
        {
            if(request.body.id_employees == null ||request.body.productivity == null || request.body.hours == null || request.body.date == null)
            {
                respuesta={error:true, codigo:0, mensaje: "Faltan datos"}
            }
            else          
            {    
                if(res.changedRows == 0)
                {
                    respuesta={error:true, codigo:0, mensaje: "Productividad existente"}
                }
                else
                {
                    respuesta={error: false, codigo:1, mensaje: "Artículo modificado", res:res}
                }
            }
            response.send(respuesta)
        })
})

//----------------------------------------------------------------Delete--------------------------------------------------------------------------------------//

app.delete("/turnos", function(request,response)
    {
        let params = [request.body.id_employees, request.body.id_shifts, request.body.date]
        let sql = "DELETE FROM shifts_employees WHERE id_employees =? AND id_shifts =? AND date=?"
        connection.query(sql, params, function(err,res)
            {
                if(err)
                {
                    response.send(err)
                }
                else
                {
                    response.send({error: false, codigo:1, mensaje: "Turno borrado", res:res})
                }
                
            })
    })

    
app.delete("/stock", function(request,response)
{
    let params = [request.body.id_stock]
    let sql = "DELETE FROM stock WHERE id_stock = ?"
    connection.query(sql, params, function(err,res)
        {
            if(err)
            {
                response.send(err)
            }
            else
            {
                response.send({error: false, codigo:1, mensaje: "Artículo borrado", res:res})
            }
        })
})