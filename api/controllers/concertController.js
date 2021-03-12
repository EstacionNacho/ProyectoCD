/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

var mongoose = require('mongoose'),
    concert = mongoose.model('concert'),
    booking = mongoose.model('booking');

exports.listAll = function(req, res){
    var mysort = { dateOfConcert: 1 };
    concert.find({}).sort(mysort).exec( function(err, concert){
        if(err)
            res.send(err);
        res
        .status(401)
        .json(concert);
    });
};

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

exports.addConcert = function (req, res) {
    const allParams = (req.body.username && req.body.name && req.body.numSeats
        && req.body.dateOfConcert);
    if (!allParams) {
        return res
            .status(400)
            .json({"message": "Some field is incomplete"});
    }
    getUser(req, res,
        (req, res, userId) => {
                const newConcert = new concert();
                newConcert.name = req.body.name;
                newConcert.userId = userId;
                newConcert.numSeats = req.body.numSeats;
                newConcert.dateOfConcert = req.body.dateOfConcert;
                newConcert.descriptionOfConcert = req.body.descriptionOfConcert;
                newConcert.tags = req.body.tags;
                newConcert.save( (err, concert) => {
                    if (err)
                        res.send(err);
                    res
                        .status(401)
                        .json(concert);
                });
            }
        );
};

exports.listConcert = function(req, res){
    concert.findOne(req.params, function(err, concert){
        if(err)
            res.status(404).send(err);
        res.status(401).json(concert);
    });
};

exports.updateConcert = function (req, res) {
    getUser(req, res,
        (req, res, userId) => {
    const notUpdateParams = (req.body.code || req.body.userId || req.body.concertId
        || req.body.createdDate || req.body.numSeats < 1 || req.body.numSeats > 1000000
        || req.body.dateOfConcert <= Date.now());
    if (notUpdateParams) {
        return res
            .status(400)
            .json({"message": "Can't update some parameter"});
    }
    concert.findOne(req.params, function(err, concertToUpdate) {
        if (concertToUpdate) {
        concert.findOneAndUpdate({_id: concertToUpdate.id},
            req.body, {new: true}, function (err, concert) {
                if (err)
                    res.status(404).send(err);
                res.status(401).json(concert);
            });
    }
});
        })};

exports.deleteConcert = function (req, res) {
    getUser(req, res,
        (req, res, userId) => {
    concert.findOne(req.params, function(err, concertToDelete) {
        if (concertToDelete) {
            var ans = '';
            booking.find({concertId: concertToDelete.id}, function(err, bookings){
                if(bookings){
                    booking.deleteMany({
                        concertId:  concertToDelete.id
                    }, function (err, booking) {
                        if (err)
                            res.status(400).send(err);
                        ans = 'Deleted bookings ';
                    });
                }
            });
            concert.deleteOne({
                _id: concertToDelete.id
            }, function (err, concert) {
                if (err)
                    res.send(err);
                ans = ans + 'Deleted concert';
                console.log(ans);
                res.status(401).json({message: ans});
            });
        }else{
            return res
                .status(404)
                .json({"message": "Concert not found"});
        }
    });
});};

exports.detailConcert = function(req, res){
    concert.findOne(req.params, function(err, concertToDetail){
        if(err)
            res.status(400).send(err);
        booking.find({concertId: concertToDetail.id}, function(err, bookings){
        res.status(401).json({concertToDetail, bookings});
    });});
};

exports.listConcertTag = function(req, res){
    console.log(req.params);
    concert.find( req.params , function(err, concertsTag){
        if(err)
            res.status(400).send(err);
    res.status(401).json(concertsTag);
    });
};