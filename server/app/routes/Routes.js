const rssReaderRoutes = require('./RssRoutes')
const fetchAllFeedsRoutes = require('../fetchAllFeeds/FetchFeedsFromAllSourcesRoutes')

module.exports = (app) => {
    rssReaderRoutes(app)
    fetchAllFeedsRoutes(app)
}