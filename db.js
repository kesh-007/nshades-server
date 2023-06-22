const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'nshades-db.cmmkohbr79bs.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'awspassword',
  database:'nshades'
});


module.exports = connection