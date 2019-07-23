   const mysql = require('mysql2');
   const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'nodejs_shop',
      password: 'r'
   })

   module.exports = pool.promise()
