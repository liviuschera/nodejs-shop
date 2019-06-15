exports.getLogin = async (req, res, next) => {
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
   // res.setHeader('Set-Cookie', 'loggedIn=true');
   // res.cookie('loggedIn', true);
   req.session.isAuthenticated = true;
   res.redirect('/');
};

