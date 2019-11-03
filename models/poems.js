let mongoose = require('../routes/connectDB');
// mongoose.Promise = require('bluebird');

let Schema = mongoose.Schema;
let PoemSchema = new Schema({
        title: String,
        author: String,
        // likes:{Number,default:0}
        likes: [{type: Schema.Types.ObjectId, ref: 'users'}]
    },
    { collection: 'poetry'}
);


var Poem = mongoose.model('Poem', PoemSchema);
module.exports = Poem;