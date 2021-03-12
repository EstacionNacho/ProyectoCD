/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueRandom = require('unique-random');

var bookingSchema = new Schema({

    concertName: {
        type: String,
        required: [true, 'Name of the concert required']
    },
    concertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'concert'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String,
        default: uniqueRandom(10000000,99999999),
        unique: true
    },
    numSeats: {
        type: Number,
        required: [true, 'Number of seats required']
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('booking', bookingSchema);