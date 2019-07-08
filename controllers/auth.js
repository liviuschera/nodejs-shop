const User = require('../models/user');

const bcrypt = require('bcryptjs');


exports.getLogin = (req, res, next) => {
   res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
   });
};

exports.getSignup = (req, res, next) => {
   res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
   });
};

exports.postLogin = async (req, res, next) => {
   try {
      const email = req.body.email;
      const password = req.body.password;
      const findUser = await User.findByEmail(email);

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
      console.error("postLogin error: ", error);
   }
};

exports.postSignup = async (req, res, next) => {
   const email = req.body.email;
   const password = await bcrypt.hash(req.body.password, 12);

   try {
      const userExists = await User.findByEmail(email);


      if (userExists) {
         return res.redirect('/');
      } else {
         const newUser = new User(email, password);
         newUser.create();
         res.redirect('/login')
      }
   } catch (error) {
      console.error("postSignup error: ", error);
   }

};

exports.postLogout = (req, res, next) => {
   try {
      req.session.destroy((error) => {
         console.error("session destroy error: ", error);
         res.redirect('/');
      });

   } catch (error) {
      console.error("postLogout error: ", error);
   }
};
