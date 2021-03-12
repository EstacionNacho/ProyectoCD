/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
const user = mongoose.model('user');


exports.signup = function (req, res){
    const todosParams = (req.body.username && req.body.name
        && req.body.email && req.body.password);
    if (!todosParams) {
        return res
            .status(400)
            .json({"message": "Some field is incomplete"});
    }
    const newUser = new user();
    newUser.username = req.body.username;
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.dadosPassword = {hash:'', salt:''};
    newUser.setDadosPassword(req.body.password);
    newUser.save((err) => {
        if (err) {
            res
                .status(404)
                .json(err);
        } else {
            const token = newUser.gerarJwt();
            res
                .status(200)
                .json({token});
        }
    });
};

exports.login = function(req, res){
    const todosParams = (req.body.username && req.body.password)
    if (!todosParams) {
        return res
            .status(400) // 400 Bad reques  An unsuccessful GET, POST, or PUT request, due to invalid content
            .json({"message": "Some field is incomplete"});
    }
    passport.authenticate('local', (err, user, info) => {
        let token;
        if (err) {
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            token = user.gerarJwt();
            res
                .status(200)
                .json({token});
        } else {
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};