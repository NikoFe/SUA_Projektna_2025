const express = require('express')
const app = express()
const cors = require("cors");
const mysql = require("mysql2/promise");

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else {
  require('dotenv').config();
}


const dbConfig = {
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,
  decimalNumbers: true 
};
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/gamification',async (req, res) => {
 console.log("FETCHING USER EXPERIENCES!:")
try {
    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute("SELECT * FROM user_experience");
    //await connection.end();
    console.log("ROWS: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error selecting user_experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })


  app.post('/gamification', async(req, res) => {

   //console.log("req.body: "+req.body )
   const {User_email, level, total_experience_points} = req.body

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const id = Math.floor(Math.random() * 100000);
      console.log("id: ", id)
      console.log("User_email: ", User_email)
      console.log("level: ", level)
      console.log("total_experience_points: ", total_experience_points)
      const [rows] = await connection.execute(

        // "INSERT INTO user_experience (id, user_id, level, total_experience_points) VALUES (?, ?, ?, ?)",
        "INSERT INTO user_experience (id, User_email, level, total_experience_points) VALUES (?, ?, ?, ?)",
         [id, User_email, level,total_experience_points]
      );
      console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  })

///

  app.put('/gamification/:id', async(req, res) => {
   id= parseInt(req.params.id)
   console.log("ID: ",id)

   const {level, total_experience_points} = req.body
   console.log("REQ_BODY: ", req.body )
    try {
      const connection =(await mysql.createConnection(dbConfig));
   
      const [rows] = await connection.execute(

        `UPDATE user_experience SET  level=? , total_experience_points=? WHERE id=?`,
        [ level, total_experience_points,id ]  
      );
      console.log("POST result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  app.put('/gamification/reset/:id', async(req, res) => {
   id= parseInt(req.params.id)
   console.log("ID: ",id)

   console.log("REQ_BODY: ", req.body )
    try {
      const connection =(await mysql.createConnection(dbConfig));
   
      const [rows] = await connection.execute(

        `UPDATE user_experience SET  level=? , total_experience_points=? WHERE id=?`,
        [0,0,id ]  
      );
      console.log("update result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })



app.delete('/gamification/:id', async(req, res) => {

  try {
  console.log(req.params)
  const {id } = req.params;

    const connection =(await mysql.createConnection(dbConfig));
    const [rows] = await connection.execute(
      `DELETE FROM user_experience WHERE id=?`,
      [id]  
    );
      console.log("DELETE result: ",rows)
      res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})




module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 6005;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}