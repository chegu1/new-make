const express = require('express');
const routers = require('./app/routes/Routes');
const app = express();
require('./config/db');
const port = process.env.PORT || 5000;

app.use(express.json())
routers(app);


app.listen(port,(err)=>{
    if(err) return console.log(`unable to connect server`)
    console.log(`server running on port no ${port}`)
})