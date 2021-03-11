const mongoose = require('mongoose');

const feedDocuments = mongoose.Schema({
    title:{
        type: String,
        trim:true
    },
    link:{
        type: String
    },
    description:{
        type: String
    },
    pubDate:{
        type: String
    },
    docType:{
        type: String,
        trim:true
    },
    sourceType:{
        type: String
    },
    sourceId:{
        type: String
    },
    tags:{
        type: String
    }
},{timestamps:true})

module.exports = mongoose.model('feedDocuments', feedDocuments)