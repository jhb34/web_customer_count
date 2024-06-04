const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: '.env' });
const sql = require('mssql');
const app = express();
const path = require('path');

app.use(morgan('dev'));

app.use(express.json());
app.use(cookie());
app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 1,
    },
  })
);

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PW,
  server: '192.168.1.10',
  database: 'USA_ERP',
  port: 1433,
  options: {
    encrypt: false,
  },
};

sql
  .connect(config)
  .then(console.log('mssql연결됨'))
  .catch((err) => console.log(err));

// app.use(
//   cors({
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
app.use(express.static(path.join(__dirname, 'public')));
// app.listen(3000, function () {
//   console.log('listening on 3000');
// });
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/api/get', (req, res) => {
  const r = req.session;
  console.log(r);
  // const user = req.session.user;
  // if (user) {
  //   res.status(200).json(user);
  // } else {
  //   res.status(401).send('Unauthorized');
  // }
});
app.get('/api/getlines', (req, res) => {
  const request = new sql.Request();
  request.query('select top 100 * from LINE_MST', (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.send(result);
  });
});

module.exports = app;
