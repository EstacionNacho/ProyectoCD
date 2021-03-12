/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueRandom = require('unique-random');

var concertSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name of concert required']
    },
    descriptionOfConcert: {
        type: String,
        default: '',
        maxlength: [500, 'Description too long']
    },
    code: {
        type: String,
        default: uniqueRandom(10000000,99999999),
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID required']
    },
    numSeats: {
        type: Number,
        required: [true, 'Number of seats required'],
        min: [1, 'Number os seats too low'],
        max: [1000000, 'Number of seats too high']
    },
    dateOfConcert: {
        type: Date,
        validate: {
            validator: function(dateOfConcert) {
              return Date.now() < dateOfConcert;
            },
            message: 'Date of concert not accepted'
          },
        required: [true, 'Date of the concert required']
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    tags: {
        type: [String],
        default: undefined
    }

});

module.exports = mongoose.model('concert', concertSchema);