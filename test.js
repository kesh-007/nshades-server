    const sql = require('mssql');

    const config = {
    server: 'nshades-server.database.windows.net',
    port: 1433,
    user: 'keshav',
    password: 'root@123',
    database: 'nshades-database',
    options: {
        encrypt: true, // Enable encryption if needed
        trustServerCertificate: true, // Change to 'false' if using a certificate
    },
    };

    // Create a connection pool
    const pool = new sql.ConnectionPool(config);

    // Connect to the database
    pool.connect().then((pool) => {
    console.log('Connected to Azure SQL Database');

    // Use the connection pool to execute queries
    pool.request().query('desc service_providers', (error, result) => {
        if (error) {
        console.error('Error executing query:', error);
        return;
        }

        console.log('Query results:', result.recordset);
    });
    }).catch((error) => {
    console.error('Error connecting to Azure SQL Database:', error);
    });
