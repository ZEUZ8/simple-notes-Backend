import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()


app.use(express.json())
app.use(cors())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fingers@8590',
    database: 'notes'
  });
  // connect to the MySQL database
  try{
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
  }catch(err){
    console.log(err)
  }

  
// app.get("/",(req,res)=>{
//     res.json("hello this is backend")
// })

app.get("/notes",(req,res)=>{
    try{
        const q = `SELECT * FROM dataTable`
        connection.query(q,(err,data)=>{
            if(err){
                 return res.json(err)
            }
             return res.json(data)
        })
    }catch(error){
        console.log(error)
    }
})



app.post('/notes',(req,res)=>{
    const tableName = "dataTable"
    const q = "INSERT INTO dataTable (`id`,`title`,`note`,`date`) VALUES(?)"
    const selectQuery = "SELECT * FROM dataTable WHERE id = ?";
    try{
        const checkTableQuery = `SELECT 1 FROM ${tableName} LIMIT 1`;

        connection.query(checkTableQuery, (err, result) => {
          if (err) {
            // If an error occurs, the table likely doesn't exist
            // Create the table dynamically
            const createTableQuery = `
              CREATE TABLE ${tableName} (
                id BIGINT PRIMARY KEY,
                title VARCHAR(255),
                note VARCHAR(1000),
                date VARCHAR(255)
              )
            `;
    
            connection.query(createTableQuery, (err) => {
              if (err) return res.json(err);
    
              // Continue with the insertion logic after table creation
              continueInsertion();
            });
          } else {
            // The table exists, continue with the insertion logic
            continueInsertion();
          }
        });

        function continueInsertion(){
            const {title,note} = extractTitle(req.body.data)
            const currentTimestamp = Date.now();
            const currentDate = new Date(currentTimestamp);
        
            const id = Date.now().toString()
            const values = [id,title,note,currentDate.toLocaleString()]
        
            
            connection.query(q,[values],(err,data)=>{
                if(err) return res.json(err)
                connection.query(selectQuery, [id], (err, insertedData) => {
                    if (err) return res.json(err);
        
                    return res.json(insertedData);
                });
            })
        }
    }catch(err){
        console.log(err)
    }
})



app.put('/notes',(req,res)=>{
    const dltQuery = "DELETE FROM `notes`.`dataTable` WHERE id = ?;"
    const selectQuery = "SELECT * FROM dataTable";
    try{
        const id = req?.body?.id
        if(!id){
            return res.status(400).json({error: 'Invalid or missing id'})
        }
        connection.query(dltQuery,[id],(err,data)=>{
            if(err) return res.status(500).json({ error: 'Internal Server Error', details: err });

            connection.query(selectQuery, [id], (err, insertedData) => {
                if (err) return res.json(err);
                return res.json(insertedData);
            });
        })
    }catch(err){
        console.log(err)
    }
})




function extractTitle(sentence, titleLength = 14) {
    // Take the specified number of characters for the title
    const title = sentence.slice(0, titleLength).trim();
  
    // Take the rest of the sentence as data
    const note = sentence.slice(titleLength).trim();

    return { title, note };
}

// // close the MySQL connection
// connection.end();


