   const mysql = require('mysql2');
   const pool = mysql.createPool({
      host: 'localhost',
      user: 'nodejs_shop',
      database: 'nodejs_shop',
      password: 'nodejs'
   })

   module.exports = pool.promise()
