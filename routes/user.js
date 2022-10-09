var express = require('express');
var router = express.Router();
const controller = require('../controller/user_controller')


/* GET home page. */
router.get('/',controller.home);



router
  .route('/register')
  .get(controller.signup)
  .post(controller.postSignup)

router
  .route('/login')
  .get(controller.login)
  .post(controller.postLogin)



module.exports = router;
