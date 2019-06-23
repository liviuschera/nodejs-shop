const User = require('../models/user');

const bcrypt = require('bcryptjs');


exports.getLogin = (req, res, next) => {
   // function getCookie(cookieName) {
   //    const cookie = req.get('Cookie');
   //    const cookieSearch = cookie.search(cookieName);
   //    const cookieValue = cookie.slice(cookieSearch).split('=')[1];
   //    return cookieValue;
   // }
   // console.log('#################', req.session.isAuthenticated);

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
      const email = req.body.email;
      const password = req.body.password;
      const findUser = await User.findAll({
         limit: 1,
         where: {
            email: email
         }
      });

      if (findUser.length < 1 || password.length < 1) {
         return res.redirect('/login');
      } else {
         const passwordsAreMatching = bcrypt.compare(password, findUser.password)
         if (passwordsAreMatching) {
            req.session.isAuthenticated = true;
            req.session.user = findUser[0];
            req.session.save(err => {
               // Using save method just to make sure that redirect is being
               // called only after data has been saved in database
               console.error('Session error: ', err);
               res.redirect('/');
            });
         } else {
            res.redirect('/login')
         }
      }
   } catch (error) {
      console.error(error);
   }

   // try {

   //    const user = await User.findByPk(1);
   //    req.session.isAuthenticated = true;
   //    req.session.user = user;
   //    req.session.save(err => {
   //       // Using save method just to make sure that redirect is being
   //       // called only after data has been saved in database
   //       console.error(err);
   //       res.redirect('/');

   //    });

   // } catch (error) {
   //    console.error("(((ERROR))): ", error);
   // }
};

exports.postSignup = async (req, res, next) => {
   const email = req.body.email;
   const password = await bcrypt.hash(req.body.password, 12);
   try {
      const findUser = await User.findAll({
         limit: 1,
         where: {
            email: email
         }
      });

      if (findUser.length > 0) {
         return res.redirect('/');
      } else {
         const user = await User.create({
            email,
            password,
            cart: {
               items: []
            }
         });

         user.save()
         res.redirect('/login')
      }
   } catch (error) {
      console.error(error);
   }

};

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
