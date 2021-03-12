/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

module.exports = function(app){

    var concert = require('../controllers/concertController');

    app.route('/ProyeCD/concert')
        .get(concert.listAll)
        .post(concert.addConcert);

    app.route('/ProyeCD/concert/:code')
        .get(concert.listConcert)
        .put(concert.updateConcert)
        .delete(concert.deleteConcert);

    app.route('/ProyeCD/concert/booking/:code')
        .get(concert.detailConcert);

    app.route('/ProyeCD/concert/tag/:tags')
        .get(concert.listConcertTag);

};