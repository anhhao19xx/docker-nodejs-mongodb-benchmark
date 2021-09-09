const DB_URI = "mongodb://root:secret@mongodb:27017";
const PORT = 3000;

const app = require('express')();
const prettyBytes = require('pretty-bytes');
const morgan = require('morgan');
const randomstring = require('randomstring');
const { MongoClient } = require("mongodb");
const unirest = require('unirest');

let db;
let reqCounter = 0;
const sessions = [];

const wait = (ms) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  })
}

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.get('/', async (req, res) => {
  // simulate handle
  let str = randomstring.generate(1024 * 1024);
  sessions.push(str);
  if (db)
    await db.collection('logs').insertOne({ log: str });

  // analytic
  reqCounter++;

  // response
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

let ltime = Date.now();
let lCounter = 0;

const loop = async () => {
  let ctime = Date.now();
  let duration = (ctime - ltime)/1000;
  ltime = ctime;

  console.log(`--- REPORT was generated at ${new Date()} ---`);
  console.table([
    { name: 'memory', value: prettyBytes(process.memoryUsage().heapUsed) },
    { name: 'total request', value: reqCounter },
    { name: 'requests/second', value: Math.floor((reqCounter-lCounter)/duration) },
    { name: 'total documents', value: db ? await db.collection('logs').countDocuments() : 0 }
  ]);

  lCounter = reqCounter;

  setTimeout(() => {
    loop();
  }, 10000);
}

const attack = async () => {
  await unirest.get(`http://127.0.0.1:${PORT}`);

  attack();
}

attack();

;(async () => {
  const client = new MongoClient(DB_URI);
  await client.connect();

  db = client.db('demo');

  await db.collection('logs').createIndex({ 'log': 1 });
  
  await loop();
  await attack();
})();
