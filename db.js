const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Naveena:20ITR074@cluster0.c9kdotj.mongodb.net/';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connect() {

  try {

    await client.connect();

    database = client.db('shop');

    console.log('Connected to the database');

  } catch (error) {

    console.error('Error connecting to the database:', error);

  }

}

function getDatabase() {

  return database;

}

module.exports = { connect, getDatabase, ObjectID: MongoClient.ObjectID };
