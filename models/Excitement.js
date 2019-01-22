var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ExcitementSchema = new Schema({
    title: String,
    body: String
});

var Excitement = mongoose.model("Excitement", ExcitementSchema);

module.exports = Excitement;