/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

module.exports = function(app){

    var user = require('../controllers/userController');

    app.route('/ProyeCD/signup')
        .post(user.signup);

    app.route('/ProyeCD/login')
        .post(user.login);

};