var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ExcitementSchema = new Schema({
    isExcited: Boolean
});

var Excitement = mongoose.model("Excitement", ExcitementSchema);

module.exports = Excitement;