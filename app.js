const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




var options = {
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'nodejs-shop'
};
const sessionStore = new MySQLStore(options);
const csrfProtection = csrf();

app.use(session({
   key: 'session_cookie_name',
   secret: 'session_cookie_secret',
   store: sessionStore,
   resave: false,
   saveUninitialized: false
}));

app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(csrfProtection);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   if (!req.session.user) {
      return next();
   }
   User.findByPk(req.session.user.id).then(user => {
      // 'user' is a Sequelize object
      req.user = user;
      next();
   })
})

app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isAuthenticated;
   res.locals.csrfToken = req.csrfToken();
   next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



app.use(errorController.get404);

Product.belongsTo(User, {
   constraints: true,
   onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User);
Cart.belongsToMany(Product, {
   through: CartItem
});
Product.belongsToMany(Cart, {
   through: CartItem
});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
   through: OrderItem
});
Product.belongsToMany(Order, {
   through: OrderItem
});

let loggedUser;
// Force overwrite of the tables. !Only in production!
sequelize
   // .sync({
   //    force: true
   // })
   .sync()
   .then(result => {

      app.listen(3000);
   })
   .catch(err => {
      console.error(err);
   });
// sequelize
//    // .sync({
//    //    force: true
//    // })
//    .sync()
//    .then(result => {
//       console.log(result);

//       // return User.findByPk(1);
//    })
//    .then(user => {
//       // if (!user) {
//       //    User.create({
//       //       email: 'liviu@email.com'
//       //    })
//       // }
//       // return user;
//    }).then(user => {
//       loggedUser = user;
//       return user.getCart();
//    }).then(cart => {
//       if (!cart) {
//          return loggedUser.createCart();
//       }
//    })
//    .then(user => {
//       app.listen(3000);
//    })
//    .catch(err => {
//       console.error(err);
//    });
