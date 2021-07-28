var mongoose = require("mongoose");

var SessionSchema = new mongoose.Schema(
    {
        ses : String, // Session
        uid : String, // User ID
        mxa : Date
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Session", SessionSchema);