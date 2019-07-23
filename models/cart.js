const db = require('../util/database');

module.exports = class Cart {

   constructor(userId) {
      this.userId = userId;
   }

   static async findAll() {
      try {
         const [result, _] = await db.query("SELECT * FROM carts JOIN cartitems ON carts.id = cartitems.cartId;");
         return result;
      } catch (error) {
         console.error(error);
      }
   }

   static async addProduct(prodId) {
      // db.query("")

   }


}
