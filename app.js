import express from "express"
import mysql from "mysql2"
import { cloneElement } from "react";

const app = express()

// const db = mysql.createPool({
//     host:"localhost",
//     user:"root",
//     password:"Fingers@8590",
//     database:"notes",
//     debug: true,
// })

app.use(express.json())
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fingers@8590',
    database: 'notes'
  });
  // connect to the MySQL database
  connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
        app.listen(3000,()=>{
            console.log("Connected to Backend")
        })
      console.log('Connected to MySQL database!');
    }
  });

  
app.get("/",(req,res)=>{
    res.json("hello this is backend")
})

app.get("/notes",(req,res)=>{
    const q = `SELECT * FROM dataTable`
    connection.query(q,(err,data)=>{
        if(err){
            console.log(' erro at the connection',err)
             res.json(err)
        }
         res.json(data)
    })
})

app.post('/notes',(req,res)=>{
    const q = "INSERT INTO dataTable (`name`,`place`) VALUES(?)"
    const values = [req.body.name,req.body.place]
    connection.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
        return res.json("peson data data is inserted succesfully")
    })
})

// // close the MySQL connection
// connection.end();


