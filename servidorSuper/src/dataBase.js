const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1/morel";

mongoose.connect(uri,{
<<<<<<< HEAD
    useNewUrlParser:true,
    useUnifiedTopology:true
=======
    useUnifiedTopology:true,
    useNewUrlParser:true
>>>>>>> frontend
});

const conection = mongoose.connection;

conection.once('open',()=>{
    console.log("Base de datos conectada")
})