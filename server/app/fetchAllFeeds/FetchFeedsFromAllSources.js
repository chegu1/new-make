const Route = require('../routes/Route')
const RssRequestHandler = require('../rss/RssRequestHandler');
const DocumentUrls = require('../models/document');
const FeedDocuments = require('../models/feedDocuments');

module.exports = class FetchFeedsFromAllSources extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.DOCSLIMIT = 25;
    }
    async fetchFeeds() {
        try {
            const feeds = await this.fetchFeedsFromAllSources();
            console.log(feeds)
            let response = { "status": false, "message": "No new feeds" };
            if(feeds.length) {
                await this.saveFeedDocumentsToDb(feeds);
                response = { "status": true };
            }
            this._handleSuccess(response);
        } catch(err) {
            this._handleBadRequest();
        }
    }

    async fetchFeedsFromAllSources(){
        const urlDocuments = await DocumentUrls.find();
        const mapUrlDocuments = urlDocuments.map(async (url)=>{
            const currentTime = Math.floor(Date.now() / 1000);
            if(!url.since ||
                currentTime - url.since > 420){
                    console.log('hello')
                    const feeds = await this.fetchFeedsFromSource(url);
                    return feeds;
                }
                return []
           
        })
        const feedArrays = await Promise.all(mapUrlDocuments);
        return feedArrays.reduce((acc, feedsObjArray) => acc.concat(feedsObjArray));
    }

    async fetchFeedsFromSource(item){
        let feeds = null;
        let type = "posts";
        const defaultResponse = { "docs": [] };
        try {
            feeds = await RssRequestHandler.instance().fetchBatchRssFeedsRequest(item.url);
            return feeds.docs;
        } catch (err) {
            return defaultResponse;
        }
        
    }

    async saveFeedDocumentsToDb(feeds){
        return feeds.forEach((feed)=>{
            let title = feed.title;
            let link = feed.link;
            let description = feed.description;
            let pubDate = feed.pubDate;
            let docType = feed.docType;
            let sourceType = feed.sourceType;
            let sourceId = feed.sourceId;
            // let tags = feed.tags;
            let savefeedDocuements = new FeedDocuments({title,link,description,pubDate,docType,sourceId,sourceType});
            savefeedDocuements.save()
        })
        
    }
}
