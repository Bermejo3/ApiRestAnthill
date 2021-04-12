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