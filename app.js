const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');
const db = require('./util/database');
const User = require('./models/user');

// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const PORT = 3000;

// db.query("DROP TABLE IF EXISTS `products`;");
// db.query("DROP TABLE IF EXISTS `users`;");

// db.query("CREATE TABLE IF NOT EXISTS `products` (`id` int(11) NOT NULL AUTO_INCREMENT,   `title` varchar(255) COLLATE utf8_bin NOT NULL,   `price` double NOT NULL,   `imageUrl` varchar(255) COLLATE utf8_bin NOT NULL,   `description` varchar(255) COLLATE utf8_bin NOT NULL,   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,   `updatedAt` datetime DEFAULT NULL,   `userId` int(11) DEFAULT NULL,   PRIMARY KEY (`id`),   KEY `userId` (`userId`) ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;").then(result => {
//    console.log(result);

// }).catch(err => console.error(err));

// db.query("CREATE TABLE IF NOT EXISTS `users` (   `id` int(11) NOT NULL AUTO_INCREMENT,   `email` varchar(255) COLLATE utf8_bin NOT NULL,   `password` varchar(255) COLLATE utf8_bin NOT NULL,   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,   `updatedAt` datetime DEFAULT NULL,   PRIMARY KEY (`id`),   UNIQUE KEY `email` (`email`) ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;").then(result => {
//    console.log(result);

// }).catch(err => console.error(err));

// db.query("SELECT * FROM products").then(result => {
//    console.log(result);

// }).catch(err => console.error(err));


// }).catch(err => console.error(err));




const options = {
   host: 'localhost',
   user: 'root',
   password: 'r',
   database: 'nodejs_shop'
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
      console.log(`user not found: ${req.session.user}`);
      return next();
   }
   const user = User.findById(req.session.user.id);
   req.user = user;
   // console.log(`user in app: ${user[0]}`);

   next();
})

app.use((req, res, next) => {
   // res.locals.isAuthenticated = false;
   res.locals.isAuthenticated = req.session.isAuthenticated;
   res.locals.csrfToken = req.csrfToken();
   next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
