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
 
// -------------------GET------------------------ //

app.get("/vacaciones/fecha", function(req, res)
{
    let sql = "SELECT employees.name, holidays.date FROM holidays_employees JOIN employees ON(holidays_employees.id_employees = employees.id_employees) JOIN holidays ON(holidays_employees.id_holidays = holidays.id_holidays)"

    connection.query(sql, function(error, response)
    {
        if (error) 
        {
            res.send(error);
        } else 
        {
            res.send(response);
        }
    })
})

app.get("/vacaciones/empleado", function(request, response){
    let params = [request.query.id_employees]
    let sql = "SELECT holidays.date FROM holidays_employees INNER JOIN holidays ON holidays_employees.id_holidays = holidays.id_holidays WHERE id_employees = ? ORDER BY holidays.date"
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

app.get("/productividad", function(request,response)
{

    let params = [request.query.id_companies]

    let sql = "SELECT employees.name, SUM (productivity.productivity) AS sum_productivity, SUM (productivity.hours) AS sum_hours FROM productivity JOIN employees ON (productivity.id_employees = employees.id_employees) WHERE productivity.id_companies = ? GROUP BY employees.name"
    connection.query(sql, params, function(err,res)
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

    let params = [request.query.id_companies]

    let sql = "SELECT SUM(productivity.productivity) AS sum_productivity, MONTH(date) AS mes  FROM productivity WHERE productivity.id_companies = ? AND YEAR(date)=2021 GROUP BY MONTH(date)"
    connection.query(sql, params, function(err,res)
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
    let params = [request.query.id_employees, request.query.id_companies]  
    let sql = "SELECT employees.name, productivity.productivity, productivity.hours, productivity.date FROM productivity JOIN employees ON (productivity.id_employees = employees.id_employees) WHERE productivity.id_employees = ? AND productivity.id_companies = ?"
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

app.get("/productividad/empleado/fecha", function(request,response)
{
    let params=[request.query.id_employees, request.query.id_companies];
    let sql = "SELECT SUM(productivity.productivity) AS sum_productivity, MONTH(date) AS mes FROM productivity WHERE id_employees=? AND id_companies=? AND YEAR(date)=2021 GROUP BY MONTH(date)";
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



app.get("/turnos/fecha", function(req, res)
{
    let sql = "SELECT employees.name, shifts.turno, shifts_employees.date FROM shifts_employees JOIN employees ON(shifts_employees.id_employees = employees.id_employees) JOIN shifts ON(shifts_employees.id_shifts = shifts.id_shifts)"

    connection.query(sql, function(error, response)
    {
        if (error) 
        {
            res.send(error);
        } else 
        {
            res.send(response);
        }
    })
})

app.get("/turnos/empleado", function(req, res)
{
    let id_employees = req.query.id_employees;
    let params = [id_employees];

    let sql = "SELECT employees.name, shifts.turno, shifts_employees.date FROM shifts_employees JOIN employees ON(shifts_employees.id_employees = employees.id_employees) JOIN shifts ON(shifts_employees.id_shifts = shifts.id_shifts) WHERE employees.id_employees =?"

    connection.query(sql, params, function(error, response)
    {
        if (error) 
        {
            res.send(error);
        } else 
        {
            res.send(response);
        }
    })
})


// ---------------------POST------------------------ //

app.post("/productividad", function(request, response){
    let params = [request.body.id_employees, request.body.productivity, request.body.hours, request.body.date, request.body.id_companies]
    let sql = "INSERT INTO productivity (id_employees, productivity, hours, date, id_companies) VALUES (?, ?, ?, ?, ?)"
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

app.post("/vacaciones", function(request, response){

    let params = [request.body.date]
    let sql = "SELECT id_holidays FROM holidays WHERE date = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else {
            if (res.length == 0){
                params = [request.body.date]
                sql = "INSERT INTO holidays (date) VALUES (?)"
                connection.query(sql, params, function(err, res){
                    if (err) response.send(err)
                    else{
                        params = [request.body.id_employees, res.insertId]
                        sql = "INSERT INTO holidays_employees (id_employees, id_holidays) VALUES (?,?)"
                        connection.query(sql, params, function(err, res){
                            if (err) response.send(err)
                            else {
                                if (res.affectedRows == 1){
                                    response.send({mensaje: "Vacaciones añadidas", codigo: 1})
                                }
                                else response.send(res)
                            }

                        })
                    }
                })
            }
            else{
                params = [request.body.id_employees, res[0].id_holidays]
                sql = "INSERT INTO holidays_employees (id_employees, id_holidays) VALUES (?,?)"
                connection.query(sql, params, function(err, res){
                    if (err) response.send(err)
                    else {
                        if (res.affectedRows == 1){
                            response.send({mensaje: "Vacaciones añadidas", codigo: 1})
                        }
                        else response.send(res)
                    }
                })
            }
        }
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

<<<<<<< HEAD
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
            if( res.affectedRows == 0)
            {
                response.send({error: false, codigo:0, mensaje: "Artículo no existe", res:res})
            }
            else
            {          
                if(err)
                {
                    response.send(err)
                }
                else
                {
                    response.send({error: false, codigo:1, mensaje: "Artículo borrado", res:res})
                }
            }    
        })
})

=======
>>>>>>> 90a3e15cb605b8404fb8c223361c05af7cc55178
app.post("/empresa", function (req, res) 
{

    let name = req.body.name;
    let address = req.body.address;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    let picture = req.body.picture;

    let params = [name, address, email, phone, password, picture]
    let sql = "INSERT INTO companies (name, address, email, phone, password, picture) VALUES (?,?,?,?,?,?)"
    connection.query(sql, params, function (error, response) 
    {
        if (error) 
        {
            res.send({error: true, codigo:0})
        } else 
        {
            res.send({'mensaje': 'Nueva compañía añadida', codigo: 1})
        }
    })
})

app.post("/empleado", function (req, res) 
{
    let id_companies = req.body.id_companies;
    let name = req.body.name;
    let surname = req.body.surname;
    let age = req.body.age;
    let position = req.body.position;
    let phone = req.body.phone;
    let shiftMorning = req.body.shiftMorning;
    let shiftAfternoon = req.body.shiftAfternoon;
    let shiftEvening = req.body.shiftEvening;
    let email = req.body.email;
    let password = req.body.password;
    let description = req.body.description;
    let picture = req.body.picture;

    let params = [id_companies, name, surname, age, position, shiftMorning, shiftAfternoon, shiftEvening, email, phone, password, description, picture]
    let sql = "INSERT INTO employees (id_companies, name, surname, age, position, shiftMorning, shiftAfternoon, shiftEvening, email, phone, password, description, picture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
    connection.query(sql, params, function (error, response) 
    {
        if (error) 
        {
            res.send({error: true, codigo:0})
        } else 
        {
            res.send({'mensaje': 'Nuevo empleado añadido', codigo: 1})
        }
    })
})

app.post("/stock", function (req, res) 
{
    let id_companies = req.body.id_companies;
    let name = req.body.name;
    let type = req.body.type;
    let quantity = req.body.quantity;
    let unit = req.body.unit;
    let date = req.body.date;
    let place= req.body.place;
    let minQuantity = req.body.minQuantity;

    let params = [id_companies, name, type, quantity, unit, date, place, minQuantity]
    let sql = "INSERT INTO stock (id_companies, name, type, quantity, unit, date, place, minQuantity) VALUES (?,?,?,?,?,?,?,?)"
    connection.query(sql, params, function (error, response) 
    {
        if (error) 
        {
            res.send({error: true, codigo:0})
        } else 
        {
            res.send({mensaje: 'Nuevo producto añadido', codigo: 1})
        }
    })
})

// -----------------------------PUT-------------------------------------------- //

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

app.put("/empresa", function(req, res)
{
    let id_companies = req.body.id_companies;
    let name = req.body.name;
    let address = req.body.address;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;
    let picture = req.body.picture;

    let params = [name, address, email, phone, password, picture, id_companies]
    let sql = "UPDATE companies SET name = COALESCE(?, name), address = COALESCE(?, address), email = COALESCE(?, email), phone = COALESCE(?, phone), password = COALESCE(?, password), picture = COALESCE(?, picture) WHERE id_companies = ?"

    connection.query(sql, params, function(error, response)
    {
        if(error)
        {
            res.send(error);
        }
        else 
        {
            if(response.changedRows == 0)
            {
                res.send("No ha cambiado nada")
            }
            else
            {
                res.send({message: "Campo modificado con éxito", codigo: 1})
            }
        }  
    })

})

app.put("/empleado", function(req, res)
{
    let id_employees = req.body.id_employees
    let name = req.body.name;
    let surname = req.body.surname;
    let age = req.body.age;
    let position = req.body.position;
    let phone = req.body.phone;
    let shiftMorning = req.body.shiftMorning;
    let shiftAfternoon = req.body.shiftAfternoon;
    let shiftEvening = req.body.shiftEvening;
    let email = req.body.email;
    let password = req.body.password;
    let description = req.body.description;
    let picture = req.body.picture;

    let params = [name, surname, age, position, shiftMorning, shiftAfternoon, shiftEvening, email, phone, password, description, picture, id_employees]
    let sql = "UPDATE employees SET name = COALESCE(?, name), surname = COALESCE(?, surname), age = COALESCE(?, age), position = COALESCE (?, position), shiftMorning = COALESCE(?, shiftMorning), shiftAfternoon = COALESCE(?, shiftAfternoon), shiftEvening = COALESCE(?, shiftEvening), email = COALESCE(?, email), phone = COALESCE(?, phone), password = COALESCE(?, password), description = COALESCE(?,description), picture = COALESCE(?, picture) WHERE id_employees = ?"

    connection.query(sql, params, function(error, response)
    {
        if(error)
        {
            res.send(error);
        }
        else 
        {
            if(response.changedRows == 0)
            {
                res.send("No se ha cambiado nada")
            }
            else
            {
                res.send({message: "Campo modificado con éxito", codigo: 1})
            }
        }  
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



app.delete("/empresa", function(req, res)
{
    let id_companies = req.body.id_companies

    let param = [id_companies]

    let sql = "DELETE FROM companies WHERE id_companies = ?"

    connection.query(sql, param, function(error,response)
    {
        if(error)
        {
            res.send(error)
        }
        else
        {
            res.send({message: "Empresa borrada", codigo: 1})
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
    let params = [request.body.id_employees, request.body.date]
    let sql = "DELETE holidays_employees FROM holidays_employees JOIN holidays ON holidays.id_holidays = holidays_employees.id_holidays WHERE id_employees = ? AND holidays.date = ?"
    connection.query(sql, params, function(err, res){
        if (err) response.send(err)
        else response.send({'mensaje': 'Dia de vacaciones eliminado', codigo: 1})
    })
})

app.use(function(request, response, next){
    respuesta = {codigo: 404, mensaje: "URL no encontrado"}
    response.status(404).send(respuesta)
})


// function datosAleatorios()
// {
    
//     for(let i=0; i<365; i++)
//     {
//         let date = new Date(2021,0,1)
//         let productivity = Math.round(Math.random()*100);
//         let hours = Math.round(Math.random()*10);
//         date.setDate(date.getDate() + i);

//         let params = [2, productivity, hours, date, 1]
//         let sql = "INSERT INTO productivity (id_employees, productivity, hours, date, id_companies) VALUES (?, ?, ?, ?, ?)"
//         connection.query(sql, params, function(err, res){
//             if (err) console.log(err)
//             else console.log({'mensaje': 'Empleado borrado', codigo: i})
//         })
//     }
    
// }

// datosAleatorios()