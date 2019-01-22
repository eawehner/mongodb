var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    isExcited: {
        type: Boolean,
        default: false
    },
    excitement: {
        type: Schema.Types.ObjectId,
        ref: "Excitement"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;