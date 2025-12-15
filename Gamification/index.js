const express = require('express')
const app = express()
const cors = require("cors");
const mysql = require("mysql2/promise");
const setupSwagger = require('./swagger');
/////
//const { jwtRequired } = require("./auth");
/////

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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns Hello World
 *     responses:
 *       200:
 *         description: A simple greeting
 */
app.get('/', (req, res) => {
  res.send('Hello World!')
})


/**
 * @swagger
 * /gamification:
 *   get:
 *     summary: Gets all user experience points and levels
 *     responses:
 *       200:
 *         description: A simple greeting
 */

app.get('/gamification',async (req, res) => {
try {
    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute("SELECT * FROM user_experience");
    //await connection.end();
   
    res.json(rows);
  } catch (error) {
    console.error("Error selecting user_experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })


/**
 * @swagger
 * /gamification/{id}:
 *   get:
 *     summary: Get user experience and level for user with specified id
 *     responses:
 *       200:
 *         description: Get user experience and level for user with specified id
 *
 */


app.get('/gamification/:id',async (req, res) => {
id= parseInt(req.params.id)
console.log("ID: ",id)


try {
    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    //await connection.end();
      const [rows] = await connection.execute(

       ` SELECT * FROM  user_experience WHERE id=?`,
        [id ]  
      );

      console.log("POST result: ",rows)
      res.json(rows);
  } catch (error) {
    console.error("Error selecting single user_experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })


/**
 * @swagger
 * /gamification:
 *   post:
 *     summary: Create user experience and level
 *     responses:
 *       200:
 *         description: Create user experience and level
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - User_email
 *               - level
 *               - total_experience_points
 *             properties:
 *               User_email:
 *                 type: string
 *                 example: user@example.com
 *               level:
 *                 type: integer
 *                 example: 5
 *               total_experience_points:
 *                 type: integer
 *                 example: 1200
 * 
 * 
 */

  app.post('/gamification', async(req, res) => {
   //console.log("req.body: "+req.body )
   const {User_email, level, total_experience_points} = req.body

    try {

      id= Math.floor(Math.random() * 999999);
      const connection =(await mysql.createConnection(dbConfig));
      console.log("User_email: ", User_email)
      console.log("level: ", level)
      console.log("total_experience_points: ", total_experience_points)
      const [rows] = await connection.execute(


        "INSERT INTO user_experience (id, User_email, level, total_experience_points) VALUES (?, ?, ?, ?)",
         [ id,User_email, level,total_experience_points]
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
 * /gamification/start:
 *   post:
 *     summary: Initialize user experience
 *     responses:
 *       200:
 *         description: Initialize user experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - User_email
 *             properties:
 *               User_email:
 *                 type: string
 *                 example: user@example.com
 * 
 */

  app.post('/gamification/start', async(req, res) => {

   //console.log("req.body: "+req.body )
   const {User_email, level, total_experience_points} = req.body

    try {
      id= Math.floor(Math.random() * 999999);
      const connection =(await mysql.createConnection(dbConfig));
      console.log("User_email: ", User_email)
      console.log("level: ", level)
      console.log("total_experience_points: ", total_experience_points)
      const [rows] = await connection.execute(

        // "INSERT INTO user_experience (id, user_id, level, total_experience_points) VALUES (?, ?, ?, ?)",
        "INSERT INTO user_experience (id, User_email, level, total_experience_points) VALUES (?, ?, ?, ?)",
         [id, User_email, 0,0]
      );
      //console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

  /**
 * @swagger
 * /gamification/{id}:
 *   put:
 *     summary: Update user experience and level for user with specified id
 *     responses:
 *       200:
 *         description: Update user experience and level for user with specified id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - total_experience_points
 *             properties:
 *               level:
 *                 type: integer
 *                 example: 5
 *               total_experience_points:
 *                 type: integer
 *                 example: 1200
 */
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

  /**
 * @swagger
 * /gamification/reset/{id}:
 *   put:
 *     summary: Reset user experience and level for user with specified id
 *     responses:
 *       200:
 *         description: Reset user experience and level for user with specified id
 */
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

  /**
 * @swagger
 * /gamification/{id}:
 *   delete:
 *     summary: Delete user experience and level for user with specified id
 *     responses:
 *       200:
 *         description: Delete user experience and level for user with specified id
 */

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

/**
 * @swagger
 * /gamification:
 *   delete:
 *     summary: Delete all user experiences
 *     responses:
 *       200:
 *         description: Delete all user experience
 *
 */

app.delete('/gamification', async(req, res) => {
  try {

    const connection =(await mysql.createConnection(dbConfig));
    const [rows] = await connection.execute(
      `DELETE FROM user_experience`
      
    );
      console.log("DELETE result: ",rows)
      res.json("DELETED ALL");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

setupSwagger(app);

module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 6005;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}