/* 
21601802 Diogo Familiar 
21810011 Ignacio Rodriguez
*/

'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        unique: true,
        required: [true, 'Username required']
    }, 
    name: {
        type: String,
        required: [true, 'Name of user required']
    },
    email: {
        type: String,
        unique: true, 
        required: [true, 'Email required']
    },
    dadosPassword : {
         type : { hash: String,
                  salt: String }, 
        required: [true, 'Password required'] }
} , {collection: 'users'}   );
// --------------------------------------------------
// - definition of Schema Methods

// ------------------------------
// - setDadosPassword(password): Schema method to calcule the hash for a given password, and save
// -
const crypto = require('crypto');
userSchema.methods.setDadosPassword = function (textoPassword){
    const saltUtilizado = crypto.randomBytes(16).toString('hex'); 
    this.dadosPassword.salt = saltUtilizado;
   this.dadosPassword.hash = crypto.pbkdf2Sync(textoPassword, saltUtilizado, 1000, 64,'sha512').toString('hex');
   // console.log('hash: ', this.dadosPassword.hash);
}; 

// --------
// - validarPassword(password): Schema method to validade a given password
userSchema.methods.validarPassword = function (password) {
    const hash =  crypto.pbkdf2Sync(password, this.dadosPassword.salt, 1000, 64,'sha512').toString('hex');
    return this.dadosPassword.hash === hash; ;
};

// --------
// - gerarJwt(): Schema method to generate a JWT (Json web token)
const jwt = require('jsonwebtoken');
userSchema.methods.gerarJwt = function () {
    const validade = new Date();
    validade.setDate(validade.getDate() + 7); 
    return jwt.sign({ 
            _id: this._id, 
            username: this.username,
            email: this.email, 
            name: this.name, 
            exp: parseInt(validade.getTime() / 1000, 10), 
            }, 'esteEoSegredo' ); 
};

// --------------------------------------------------
// - export the Utilizador Schema 
module.exports = mongoose.model('user', userSchema);