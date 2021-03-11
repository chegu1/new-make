const RssClient = require('./RssClient');

module.exports = class RssRequestHandler {
    static instance() {
        return new RssRequestHandler();
    }
    rssClient() {
        return RssClient.instance();
    }

    async fetchBatchRssFeedsRequest(url){
        console.log(url,"rssrequesthandler")
        try {
            const feeds = await this.rssClient().getRssData(url);
            return feeds;
        } catch (error) {
            throw error;
        }
    }
    async addURL(url) {
        console.log(url)
        const response = await this.rssClient().addURL(url);
        return response;
    }
}