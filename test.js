const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'nshades-db.cmmkohbr79bs.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'awspassword',
  database:'nshades'
});

// Connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }

  console.log('Connected to MySQL database');
});

// Handle the connect event
connection.on('connect', () => {
  console.log('Connected event fired');
});

// Handle the error event
connection.on('error', (error) => {
  console.error('MySQL error:', error);
});

// Close the connection when done
connection.end();
