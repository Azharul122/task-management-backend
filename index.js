const express = require("express");
require('dotenv').config()
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000


const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions))
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_KEY);




app.get('/', (req, res) => {
    res.send("running")
})

app.listen(port, () => {
    console.log(`running on port :${port}`)
})


// MongoDB


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.q7fc5xn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const userCollecion = client.db("ass12DB").collection("users")
        const tasksCollection = client.db("ass12DB").collection("tasks")


        // User
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUsers = await userCollecion.findOne(query)
            if (existingUsers) {
                return res.send({ message: "user already exiists" })
            }
            const result = await userCollecion.insertOne(user)
            res.send(result)//i
        })

        app.get("/users", async (req, res) => {
            const result = await userCollecion.find().toArray();
            res.send(result)
        })

        //   Task
        app.post("/tasks", async (req, res) => {
            const item = req.body
            const result = await tasksCollection.insertOne(item)
            res.send(result)
        })

        app.get("/tasks", async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result)
        })


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })


        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = { upsert: true }
            const toy = req.body;

            const updateTask = {
                $set: {
                    taskTitle: toy.taskTitle,
                    TaskDescription: toy.TaskDescription,

                }
            }
            const result = tasksCollection.updateOne(query, updateTask);
            res.send(result)

        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
