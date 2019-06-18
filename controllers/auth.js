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
exports.postLogin = async (req, res, next) => {
   // try {
   //    const user = await User.findByPk(1);
   //    req.session.isAuthenticated = true;
   //    req.session.loggedInUser = user;
   //    res.redirect('/');

   // } catch (error) {
   //    console.error("(((ERROR))): ", error);
   // }
   User.findByPk(1).then(user => {
      req.session.isAuthenticated = true;
      req.session.user = user;
      res.redirect('/');
   }).catch(error => console.error(error));

};

