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


app.get('/shippings',async (req, res) => {
 console.log("FETCHING SHIPPINGS!:")
try {
    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute("SELECT * FROM shipping");
    //await connection.end();
    console.log("ROWS: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error selecting shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })


  app.post('/shippings', async(req, res) => {

   console.log("req.body: "+req.body )
   const {User_email, location, date_created, quantity, price} = req.body

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const id = Math.floor(Math.random() * 100000);
      const [rows] = await connection.execute(
      //  "INSERT INTO uporabnik (id, ime, lokacija, geslo, odobreno) VALUES (?, ?, ?, ?, ?)",
         "INSERT INTO shipping (id, User_email, location, date_created,  quantity ,price ) VALUES (?, ?, ?, ?, ?, ?)",
         [id, User_email, location, date_created,quantity ,price]
      );
      console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

///

  app.put('/shippings/:id', async(req, res) => {
   id= parseInt(req.params.id)
   console.log("ID: ",id)

   const {location, date_created, quantity, price} = req.body
   console.log("REQ_BODY: ", req.body )
    try {
      const connection =(await mysql.createConnection(dbConfig));
   
      const [rows] = await connection.execute(

        `UPDATE shipping SET  location=? , date_created=?,  quantity=? ,price=? WHERE id= ?`,
        [ location, date_created,quantity ,price,id ]  
      );
      console.log("POST result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

app.delete('/shippings/:id', async(req, res) => {

  try {
  console.log(req.params)
  const {id } = req.params;

    const connection =(await mysql.createConnection(dbConfig));
    const [rows] = await connection.execute(
      `DELETE FROM shipping WHERE id=?`,
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
const port = process.env.PORT || 6004;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}