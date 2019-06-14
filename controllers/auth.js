exports.getLogin = async (req, res, next) => {
   try {
      res.render('auth/login', {
         path: '/login',
         pageTitle: 'Login'
      });
   } catch (error) {
      console.error(error);

   }
};
exports.postLogin = async (req, res, next) => {
   req.isLoggedIn = true;
   res.redirect('/');
};

