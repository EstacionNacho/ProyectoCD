
const mongoose = require('mongoose');
const urlBaseDados = 'mongodb://localhost:5000/ProyeCD';

mongoose.connect(urlBaseDados, {useMongoClient: true});

mongoose.connection.on('connected', () => { 
         console.log(`Mongoose ligado a ${urlBaseDados}`);
    });
mongoose.connection.on('error', err => {
        console.log('Mongoose erro ao conectar: ', err);
    });
mongoose.connection.on('disconnected', () => { 
        console.log('Mongoose: foi desligada a ligação. '); 
    });
