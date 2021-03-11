const FetchFeedsFromAllSources = require('./FetchFeedsFromAllSources')

module.exports = (app) => {
    app.post("/fetch-feeds", (request, response) => {
        new FetchFeedsFromAllSources(request, response).fetchFeeds();
    });
}