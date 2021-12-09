const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlwoa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Hello i am working');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("volunteer-network").collection("volunteer");
    const eventCollection = client.db("volunteer-network").collection("event");

    // perform actions on the collection object


    app.post('/addEvent', (req, res) => {
        const event = req.body;
        volunteerCollection.insertMany(event)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/event', (req, res) => {
        volunteerCollection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.get('/register', (req, res) => {
        eventCollection.find()
            .toArray((err, document) => {
                res.send(document)
            })
    })


    app.post('/addVolunteer', (req, res) => {
        const volunteer = req.body;
        eventCollection.insertOne(volunteer)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/register/:key', (req, res) => {
        const regId = parseInt(req.params.key)
        volunteerCollection.find({ key: regId })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.get('/involvedUser', (req, res) => {
        // console.log(req.query.email);
        eventCollection.find({ email: req.query.email })
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        eventCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })









    console.log('database connected');
});



app.listen(5000);