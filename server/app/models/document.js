const mongoose = require('mongoose');

const documentUrls = mongoose.Schema({
    name:{
        type: String,
        trim:true
    },
    url:{
        type: String
    },
    sourceType:{
        type: String,
        default: "web"
    },
    docType:{
        type: String,
        default: "source"
    },
    since:{
        type:Number
    }
},{timestamps:true})

module.exports = mongoose.model('rssurls', documentUrls)