const User = require('../models/user');


exports.getLogin = (req, res, next) => {
   // function getCookie(cookieName) {
   //    const cookie = req.get('Cookie');
   //    const cookieSearch = cookie.search(cookieName);
   //    const cookieValue = cookie.slice(cookieSearch).split('=')[1];
   //    return cookieValue;
   // }
   console.log('#################', req.session.isAuthenticated);

   try {

      res.render('auth/login', {
         path: '/login',
         pageTitle: 'Login',
         // isAuthenticated: req.session.isAuthenticated
         // isAuthenticated: req.isLoggedIn
         // isAuthenticated: getCookie('loggedIn')
      });
   } catch (error) {
      console.error(error);

   }
};

exports.getSignup = (req, res, next) => {
   res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
   });
};

exports.postLogin = async (req, res, next) => {
   try {
      const user = await User.findByPk(1);
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save(err => {
         // Using save method just to make sure that redirect is being
         // called only after data has been saved in database
         console.error(err);
         res.redirect('/');

      });

   } catch (error) {
      console.error("(((ERROR))): ", error);
   }
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
   try {
      req.session.destroy((error) => {
         console.error(error);

         res.redirect('/');

      });

   } catch (error) {
      console.error("(((ERROR))): ", error);
   }
};
