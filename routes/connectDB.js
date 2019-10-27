let mongoose = require('mongoose');

let username = "YutingJing_24";
let password = "cindyJing97";

let mongodbUri="mongodb+srv://"+username + ":" + password +"@cluster0-evhrz.mongodb.net/artifactsdb";

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


module.exports = mongoose;
// module.exports = db;

