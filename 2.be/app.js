const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: '.env' });
const sql = require('mssql');
const app = express();
const path = require('path');
const { log } = require('console');

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

app.use(
  cors({
    origin: 'http://172.20.2.122:8080',
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
// app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, function () {
  console.log('listening on 3000');
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
app.post('/api/getlist', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const date = params.date;
  const customer = params.customer;
  const query = `select top 100 * from TB_CUST_SCAN where SCAN_DATE='${date}' and CUST_CD='${customer}'`;
  console.log(query);
  const request = new sql.Request();
  request.query(
    `select top 100 * from TB_CUST_SCAN where SCAN_DATE='${date}' and CUST_CD='${customer}'`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send(result);
    }
  );
});
app.post('/api/getsummary', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const date = params.date;
  const customer = params.customer;
  const request = new sql.Request();
  request.query(
    `select top 100 SCAN_DATE,CUST_CD,ITMNO, sum(TAG_QTY) as TAG_QTY from TB_CUST_SCAN  where SCAN_DATE='${date}' and CUST_CD='${customer}' group by SCAN_DATE,CUST_CD,ITMNO`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send(result);
    }
  );
});
app.post('/api/chkdup', (req, res) => {
  const stagno = req.body.params;
  console.log(stagno);
  // const date = params[0].trim();
  // const cust = params[1].trim();
  const request = new sql.Request();
  request.query(
    `select top 100 * from  TB_CUST_SCAN where STAG_NO='${stagno}'
        `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send(result);
    }
  );
});
app.post('/api/chkitmno', (req, res) => {
  const a = req.body.params;
  console.log(a);
  // const date = params[0].trim();
  // const cust = params[1].trim();
  const request = new sql.Request();
  request.query(
    `select top 100 * from ITM_MST where ITMNO='${a}'
        `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(result);
      res.send(result);
    }
  );
});
app.post('/api/insertdata', (req, res) => {
  const { params } = req.body;
  console.log('inserthist', params);
  const date = params.date;
  const customer = params.customer;
  const itmno = params.itmno;
  const qty = params.qty;
  const tagno = params.tagno;
  const time = params.time;
  const request = new sql.Request();
  const query = `insert into TB_CUST_SCAN values('${date}','${tagno}','${customer}','${itmno}',${qty},${time})
      `;
  console.log(query);
  request.query(
    `insert into TB_CUST_SCAN values('${date}','${tagno}','${customer}','${itmno}',${qty},'${time}')
      `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send(result);
    }
  );
});
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// module.exports = app;
