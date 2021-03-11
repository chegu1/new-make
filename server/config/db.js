const mongoose = require('mongoose');

const DBCONNECTION = mongoose.connect("mongodb://localhost/makenews_newsclick_in",{useNewUrlParser:true,useUnifiedTopology:true})
.then(res=>console.log(`database connected successfully`))
.catch(err=>console.log(`unable to connect database ${err}`))

module.exports = DBCONNECTION;