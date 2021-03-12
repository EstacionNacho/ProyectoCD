/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

module.exports = function(app) {

    var booking = require('../controllers/bookingController');

    app.route('/ProyeCD/booking')
        .post(booking.addBooking);

    app.route('/ProyeCD/booking/:code')
        .get(booking.listBooking)
        .put(booking.updateBooking)
        .delete(booking.deleteBooking);

};