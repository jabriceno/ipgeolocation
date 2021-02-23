const express = require('express');
const http = require('http');
const app = express();
const dbConnection = require('./db');
const distanceStats = require('./controllers/distanceStats');
const db = require('./db');

dbConnection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    req.database = dbConnection.database;
    next();
})
app.set('trust proxy', true);
app.set('port', 4000);

app.get('/distance/nearest', distanceStats.getNearest);
app.get('/distance/farthest', distanceStats.getFarthest);
app.get('/distance/average', distanceStats.getDistanceAverage);

app.get('*', (req, res) => {
  res.json({foo:'Hello WOrld!'})
});

const server = http.createServer(app);

server.listen({ port: 4000 }, () => console.log(`Now browse to http://localhost:4000`));
