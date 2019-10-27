let mongoose = require('../routes/connectDB');
// mongoose.Promise = require('bluebird');

let Schema = mongoose.Schema;
let AuthorSchema = new Schema({
        name: String,
        introduction: String,
        works: [{type: Schema.Types.ObjectId, ref: 'poems'}],
        likes: [{type: Schema.Types.ObjectId, ref: 'users'}]
    },
    { collection: 'author'}
);

module.exports = mongoose.model('Author', AuthorSchema);
