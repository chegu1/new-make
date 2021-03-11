
const AddURLDocumentRoute = require('./helpers/AddURLDocumentRoute')

module.exports = (app) => {
    app.post('/add-url',(request,response,next)=>{
        new AddURLDocumentRoute(request,response,next).handle();
    })
}