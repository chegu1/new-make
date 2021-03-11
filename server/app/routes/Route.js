const HttpResponseHandler = require('../../../common/HttpResponseHandler')

module.exports = class Route {
    constructor(request,response,next){
        if(!request || !response) {
            throw new Error("request or response can not be empty");
        }
        this.request = request;
        this.response = response;
        this.next = next;
    }
    async process() {
        const routeClass = this.constructor.name;
        console.log(routeClass,"hello")
    }
    _handleFailure(error) {
        this.response.status(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
        this.response.json(error);
    }

    _handleFileNotFoundFailure(error) {
        this.response.status(HttpResponseHandler.codes.NOT_FOUND);
        this.response.json(error);
    }

    _handleInvalidRoute() {
        this.response.status(HttpResponseHandler.codes.BAD_REQUEST);
        this.response.json({ "message": "bad request" });
    }

    _handleBadRequest() {
        this._handleInvalidRoute();
    }

    _handleInvalidRequest(error) {
        this.response.status(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        this.response.json(error);
    }

    _handleLoginFailure() {
        this.response.status(HttpResponseHandler.codes.UNAUTHORIZED);
        this.response.json({ "message": "Incorrect user credentials" });
    }

    _handleSuccess(json) {
        this.response.status(HttpResponseHandler.codes.OK);
        this.response.json(json);
    }

    _handleError(message) {
        this.response.status(HttpResponseHandler.codes.BAD_REQUEST);
        this.response.json({ message });
    }
}