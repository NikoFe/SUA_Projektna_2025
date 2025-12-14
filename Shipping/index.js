const express = require('express')
const app = express()
const cors = require("cors");
const mysql = require("mysql2/promise");
const setupSwagger = require('./swagger');

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



/**
 * @swagger
 * /shippings:
 *   get:
 *     summary: Gets all shippings 
 *     responses:
 *       200:
 *         description:  Gets all shippings 
 */

app.get('/shippings',async (req, res) => {
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


/**
 * @swagger
 * /shippings/{id}:
 *   get:
 *     summary: Gets all shippings 
 *     responses:
 *       200:
 *         description:  Gets all shippings 
 */

app.get('/shippings/:id',async (req, res) => {
   console.log("FETCHING SHIPPINGS!:")
   id= parseInt(req.params.id)
   console.log("ID: ",id)
try {
    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute(
      
      `SELECT * FROM shipping WHERE id=?`,
      [id] );
    //await connection.end();
    console.log("ROWS: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error selecting shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })

/**
 * @swagger
 * /shippings:
 *   post:
 *     summary: Create shipping
 *     responses:
 *       200:
 *         description: Create shipping
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - User_email
 *               - location
 *               - date_created
 *               - quantity
 *               - price
 *             properties:
 *               User_email:
 *                 type: string
 *                 example: user@example.com
 *               location:
 *                 type: string
 *                 example: loc1
 *               date_created:
 *                 type: string
 *                 example: 2015-10-5 10:12:56 
 *               quantity:
 *                 type: decimal
 *                 example: 5.6
 *               price:
 *                 type: decimal
 *                 example: 3.5
 */

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

/**
 * @swagger
 * /shippings/date_now:
 *   post:
 *     summary: Create shipping with current datetime
 *     responses:
 *       200:
 *         description: Create shipping with current datetime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - User_email
 *               - location
 *               - quantity
 *               - price
 *             properties:
 *               User_email:
 *                 type: string
 *                 example: user@example.com
 *               location:
 *                 type: string
 *                 example: loc1
 *               quantity:
 *                 type: decimal
 *                 example: 5.6
 *               price:
 *                 type: decimal
 *                 example: 3.5
 */



  app.post('/shippings/date_now', async(req, res) => {

   console.log("req.body: "+req.body )
   const {User_email, location,quantity, price} = req.body

    var m = new Date();

   var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2) + " " +
    ("0" + m.getUTCHours()).slice(-2) + ":" +
    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    ("0" + m.getUTCSeconds()).slice(-2);

    console.log("DATE STRING: ", dateString);

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const id = Math.floor(Math.random() * 100000);
      const [rows] = await connection.execute(
      //  "INSERT INTO uporabnik (id, ime, lokacija, geslo, odobreno) VALUES (?, ?, ?, ?, ?)",
         "INSERT INTO shipping (id, User_email, location, date_created, quantity ,price ) VALUES (?, ?, ?, ?, ?, ?)",
         [id, User_email, location,  dateString  ,quantity ,price]
      );
      console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

///

/**
 * @swagger
 * /shippings/{id}:
 *   put:
 *     summary: Update shipping with specified id
 *     responses:
 *       200:
 *         description: Update shipping with specified id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - date_created
 *               - quantity
 *               - price
 *             properties:
 *               location:
 *                 type: string
 *                 example: loc1
 *               date_created:
 *                 type: string
 *                 example: 2015-10-5 10:12:56 
 *               quantity:
 *                 type: decimal
 *                 example: 5.6
 *               price:
 *                 type: decimal
 *                 example: 3.5
 */
 

  app.put('/shippings/:id', async(req, res) => {
   id= parseInt(req.params.id)
   console.log("ID: ",id)

   const { location, date_created, quantity, price} = req.body
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


/**
 * @swagger
 * /shippings/update_date/{id}:
 *   put:
 *     summary: Update the date of creation of shipping to match the current datetime
 *     responses:
 *       200:
 *         description: Update the date of creation of shipping to match the current datetime
 */

  app.put('/shippings/update_date/:id', async(req, res) => {
   id= parseInt(req.params.id)
   console.log("ID: ",id)

   //const {location, quantity, price} = req.body

   //console.log("REQ_BODY: ", req.body )
    try {
      const connection =(await mysql.createConnection(dbConfig));
   

      //date_created=
      var m = new Date();

      var dateString =
        m.getUTCFullYear() + "-" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

        console.log("DATE STRING: ", dateString);
      const [rows] = await connection.execute(

       /* `UPDATE shipping SET  location=? , date_created=?,  quantity=? ,price=? WHERE id= ?`,
        [ location, dateString,quantity ,price,id ]  */
       `UPDATE shipping SET   date_created=? WHERE id= ?`,
        [ dateString,id ]

      );
      console.log("POST result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })


/**
 * @swagger
 * /shippings/{id}:
 *   delete:
 *     summary: Delete shipping with specified id
 *     responses:
 *       200:
 *         description: Delete shipping with specified id
 */


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
    console.error("Error deleting  posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


/**
 * @swagger
 * /shippings:
 *   delete:
 *     summary: Delete all shippings
 *     responses:
 *       200:
 *         description: Delete all shippings
 */

app.delete('/shippings', async(req, res) => {
  try {

    const connection =(await mysql.createConnection(dbConfig));
    const [rows] = await connection.execute(
      `DELETE FROM shipping`
      
    );
      console.log("DELETE result: ",rows)
      res.json("DELETED ALL");
  } catch (error) {
    console.error("Error deleting  posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

setupSwagger(app);

module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 6004;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}