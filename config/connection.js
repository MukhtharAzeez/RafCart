const mongoose = require('mongoose');


module.exports.database=() => {

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology : true,
    };

    try {
        mongoose.connect('mongodb+srv://MukhtharAzeez:zPJm0DWYQP8iBJbC@cluster0.gtk0l6y.mongodb.net/rafCart?retryWrites=true&w=majority'),
        connectionParams,
        console.log("Database connected");
    }catch(e) {
        console.log("Databases connection failed");
    }

};
