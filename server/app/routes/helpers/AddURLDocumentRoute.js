const Route = require('../Route');
const RssRequestHandler = require('../../rss/RssRequestHandler');

module.exports= class AddURLDocumentRoute extends Route {
    constructor(request,response,next){
        super(request, response, next);
        this.url = this.request.body.url;
    }
    async handle(){
        // console.log(request)
        try {
            const rssRequestHandler = RssRequestHandler.instance();
            const response = await rssRequestHandler.addURL(this.url);
            return this._handleSuccess(response);
        } catch (error) {
            throw this._handleInvalidRequest({ "message": error.message || error });
            
        }
    }
}