const FeedParser = require('feedparser');

module.exports = class RssParser {
    constructor(response) {
        this.response = response;
        this.feedParser = new FeedParser();
    }
    parse(url) {
        return new Promise((resolve, reject) => {
            const items = [];
            this.response.pipe(this.feedParser);
            this.feedParser.on("error", function(error){
                reject("Not a feed");
            });
            this.feedParser.on("readable", function() {
                const meta = this.meta;
                let feed = this.read();
                if(feed){
                    const feedObject = {
                        // "_id": guid,
                        // "guid": guid,
                        "title": feed.title,
                        "link": feed.link,
                        "description": feed.description,
                        "pubDate": feed.pubDate,
                        "enclosures": feed.enclosures,
                        "docType": "feed",
                        "sourceType": "web",
                        "sourceId": url,
                        "tags": [meta.title],
                        "images": []
                    }
                    if (feed.enclosures && feed.enclosures.length) {
                        feed.enclosures.forEach((item, index) => { //eslint-disable-line no-loop-func
                            if (!item.type || item.type.indexOf("image") !== NEGATIVE_INDEX) {
                                const image = feed.enclosures[index];
                                image.thumbnail = image.url;
                                feedObject.images.push(image);
                            } else if (item.type.indexOf("video") !== NEGATIVE_INDEX) {
                                feedObject.images.push({ "type": "video", "url": feed.image.url, "thumbnail": feed.image.url });
                            }
                        });
                    }
                    items.push(feedObject)
                    feed = this.read()
                }
                
                
            })
            this.feedParser.on("end", function() {
                resolve({ "items": items, "meta": this.meta });
            });
        })
    }
}