const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema(
    {
        title: {type : String, required: true},
        description: {type:String, required: true , min : 10},
        author: {type:String, required: true , min : 3},
        type: {type:String, required: true , min : 3},
        pages: {type:Number, required: true },
        imagePath: {type:String, default: "" }
    }
);

module.exports = mongoose.model('books', booksSchema);