/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

var mongoose = require('mongoose'),
    booking = mongoose.model('booking'),
    concert = mongoose.model('concert');


const Utilizador = mongoose.model('user');
// função auxiliar para obter o _id do utilizador a partir do JWT enviado no pedido
const getUser = (req, res, callback) => {
    if (req.body && req.body.username) { // validar que os dados do JWT estão no request
        Utilizador
            .findOne({ username: req.body.username }) // procurar um utilizador pelo seu "username"
            .exec((err, utilizador) => {
                if (!utilizador) {
                    return res
                        .status(404)
                        .json({ "message": "User not found" });
                } else if (err) {
                    console.log(err);
                    return res
                        .status(404)
                        .json(err);
                }
                // executar o "callback", indicando qual é o utilizador
                callback(req, res, utilizador._id);
            });
    } else {
        return res
            .status(404)
            .json({ "message": "User not found"  });
    }
};

exports.addBooking = function (req, res){
    const allParams = (req.body.username && req.body.concertName && req.body.numSeats
        && req.body.code && req.body.numSeats > 1);
    if (!allParams) {
        return res
            .status(400)
            .json({"message": "Some field is incomplete"});
    }
    getUser(req, res,
        (req, res, userId) => {
            concert.findOne({code: req.body.code}, function (err, concertToUpdate) {
                if (concertToUpdate){
                if(concertToUpdate.numSeats < req.body.numSeats){
                    return res
                        .status(400)
                        .json({"message": "Not enough seats"});
                }
                if(concertToUpdate.name != req.body.concertName){
                    return res
                        .status(400)
                        .json({"message": "The name of the concert and the code doesn't match"});
                }
                const numSeatsUpdate = concertToUpdate.numSeats - req.body.numSeats;
                concertToUpdate.updateOne({ $set: { numSeats: numSeatsUpdate } }, function(err, concert) {
                    if (err) throw err;
                });
                const newBooking = new booking();
                newBooking.concertName = req.body.concertName;
                newBooking.userId = userId;
                newBooking.numSeats = req.body.numSeats;
                newBooking.concertId = concertToUpdate._id;
                newBooking.save( (err, booking) => {
                    if (err)
                        res.send(err);
                    res
                        .status(401)
                        .json(booking);
                });
            }else{
                    res.send(err);
                }});
        }
    );
};

exports.listBooking = function(req, res){
    booking.findOne(req.params, function(err, booking){
        if(err)
            res.send(err);
        res.json(booking);
    });
};

exports.updateBooking = function (req, res) {
    getUser(req, res,
        (req, res, userId) => {
    booking.findOne(req.params, function (err, bookingToUpdate) {
        if (bookingToUpdate) {
            concert.findOne({_id: bookingToUpdate.concertId}, function (err, concertToUpdate) {
                if (concertToUpdate) {
                    const notUpdateParams = (req.body.code || req.body.userId || req.body.concertId
                        || req.body.createdDate || req.body.concertName
                        || req.body.numSeats < 1 || req.body.numSeats > concertToUpdate.numSeats);
                    if (notUpdateParams) {
                        return res
                            .status(400)
                            .json({"message": "Can't update some parameter"});
                    }
                    const numSeatsUpdate = req.body.numSeats;
                    const numSeatsDiff = concertToUpdate.numSeats + (bookingToUpdate.numSeats - numSeatsUpdate);
                    concertToUpdate.updateOne({ $set: { numSeats: numSeatsDiff } }, function(err, concert) {
                        if (err) throw err;
                    });
                    bookingToUpdate.updateOne({ $set: { numSeats: numSeatsUpdate } }, function(err, booking) {
                        if (err) throw err;
                        res.json({"message": "Booking update"});
                    });

                }else{
                    res.send(err);
                }
        });}else{
            res.send(err);
        }
    });
    });
};

exports.deleteBooking = function (req, res) {
    getUser(req, res,
        (req, res, userId) => {
        booking.findOne(req.params, function (err, bookingToDelete) {
            if (bookingToDelete) {
                concert.findOne({_id: bookingToDelete.concertId} , function(err,concertToUpdate){
                    const numSeatsToUpdate = bookingToDelete.numSeats + concertToUpdate.numSeats;
                    if (concertToUpdate) {
                        concert.findOneAndUpdate({_id: concertToUpdate.id},
                            {$set: {numSeats: numSeatsToUpdate}}, {new: true}, function (err, concert) {
                                if (err)
                                    res.send(err);
                            });
                    }else{
                        res.send(err);
                    }
                });
                booking.deleteOne({
                    _id: bookingToDelete.id
                }, function (err, booking) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Deleted booking'});
                });
            }else{
                res.send(err);
            }
        });});
    };
