const db = require('../util/database');

module.exports = class User {

   constructor(email, password) {
      this.email = email;
      this.password = password;
   }
   static async findAll() {
      try {
         const [result, _] = await db.query('SELECT * FROM users');
         return result;
      } catch (error) {
         console.error('Product findAll', error);
      }
   }

   static async findById(id) {
      try {
         const [result, _] = await db.query('SELECT * FROM products WHERE id = ?;', [id]);
         return result[0];
      } catch (error) {
         console.error('Product findById: ', error);
      }
   }

   static async findByEmail(email) {
      try {
         const [result, _] = await db.query('SELECT * FROM users WHERE email = ?;', [email]);
         return result[0];
      } catch (error) {
         console.error('Product findByEmail: ', error);
      }
   }

   async create() {
      try {
         const createUser = await db.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [this.email, this.password]
         );
         return createUser;
      } catch (error) {
         console.error('User createUser: ', error);
      }
   }
}
