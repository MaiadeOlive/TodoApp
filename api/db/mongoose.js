// Conexão com o MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao MongoDB com sucesso! :3");
}).catch((e) => {
    console.log("Erro ao tentar conectar com o MongoDB");
    console.log(e);
});

// Previne avisos de deprecated (do MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
};