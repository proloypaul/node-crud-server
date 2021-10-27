const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const app = express();
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 4000;


// middleware
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3dsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)
async function run() {
    try {
      await client.connect();
      const database = client.db("firstMDProject");
      const collectUsers = database.collection("users");

    // Get method 
    app.get('/users', async(req, res) => {
        const cursor = collectUsers.find({});
        const users = await cursor.toArray();
        res.send(users)
    })

    // Get method collect id details
    app.get('/users/:id', async (req, res) => {
        const id = req.params.id
        const quary = {_id: ObjectId(id)}
        const user = await collectUsers.findOne(quary)
        console.log("Load user with id", id)
        res.send(user)

    })
     
    // Post method
    app.post('/users', async(req, res) => {
        // console.log("hitting the post", req.body)
        const newUser = req.body;
        const result = await collectUsers.insertOne(newUser)
        console.log("get new user", newUser);
        console.log("user database Id", result)
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result);
    })

    // DELETE user
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id
        const quary = {_id: ObjectId(id)}
        const result = await collectUsers.deleteOne(quary)
        console.log("delete user with id", result)
        res.json(result);
    })

    // PUT method to update user
    app.put('/users/:id', async (req, res) => {
        const id = req.params.id
        const updateUser = req.body
        const filter = {_id: ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: updateUser.name,
              email: updateUser.email
            },
          };
          const result = await collectUsers.updateOne(filter, updateDoc, options)
        console.log("Update user", req)
        res.json(result)

    })

    

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Here is my backend web")
});

app.get('/hellow', (req, res) => {
  res.send("Hey there i already deploy my server")
})
app.listen(port, (req, res) => {
    console.log("Running server  on port", port)
});


/*
deploy server to heroku

one time 
1.Heroku account open
2.heroku software install

Every project
1.git init
2. .gitignore(node_module, .env)
3. push evry thing to git
4.make sure you have this script: "start":"node index.js"
5.make sure process.env.PORT in front of your port number
6.heroku login
7.heroku create (only one time)
8. git push heroku main


update deploy link 
1. git add . , git commit -m "", git push
2. git push heroku main

*/