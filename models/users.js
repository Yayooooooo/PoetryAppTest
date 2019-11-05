let mongoose = require("../routes/connectDB");
var bcrypt = require("bcrypt");

let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    gender:String,
    likes: [{type: Schema.Types.ObjectId, ref: "poems"}]
},
{ collection: "users"}
);

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email})
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            }
            else if (!user) {
                err = new Error("User not found.");
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};


//hashing a password before saving it to the database
UserSchema.pre("save", function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});


var User = mongoose.model("User", UserSchema);
module.exports = User;