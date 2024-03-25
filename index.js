const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();
const DB_USER = process.env.DB_USER || 'defaultuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'defaultpassword';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/save', async (req, res) => {
    const url = 'mongodb+srv://' + DB_USER + ':' + DB_PASSWORD + '@cluster0.unua2ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    try {
        const db = client.db('omsmerndb');
        const coll = db.collection('orders');
        const record = { 'name': req.body.name, 'phone': req.body.phone, 'email': req.body.email, 'delivery': req.body.delivery, 'items': req.body.items, 'date': req.body.dt };
        const count = await coll.countDocuments({ "name": req.body.name });
        if (count === 0) {
            const result = await coll.insertOne(record);
            res.send(result);
        }
        else {
            res.json({ message: 'Name already exists in the database' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

})

app.get('/show', (req, res) => {
    const url = 'mongodb+srv://' + DB_USER + ':' + DB_PASSWORD + '@cluster0.unua2ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    const db = client.db('omsmerndb');
    const coll = db.collection('orders');
    coll.find({}).toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
})

app.delete('/remove', (req, res) => {
    const url = 'mongodb+srv://' + DB_USER + ':' + DB_PASSWORD + '@cluster0.unua2ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    const db = client.db('omsmerndb');
    const coll = db.collection('orders');
    coll.deleteOne({ 'name': req.body.name })
        .then(result => res.send(result))
        .catch(error => res.send(error));
})

app.post('/login', (req, res) => {
    const url = 'mongodb+srv://' + DB_USER + ':' + DB_PASSWORD + '@cluster0.unua2ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    const db = client.db('omsmerndb');
    const coll = db.collection('admin');
    coll.find({ username: req.body.username, password: req.body.password }).toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
})

app.listen(9001, () => { console.log('server ready @ 9001'); });