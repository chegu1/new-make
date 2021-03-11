const request = require("request");
const HttpResponseHandler = require('../../../common/HttpResponseHandler')
const RssParser = require('./RssParser');
const FEEDS_NOT_FOUND = "feeds_not_found";
const DocumentUrls = require('../models/document');

module.exports = class RssClient {
    static instance() {
        return new RssClient();
    }

    getRssData(url) {
        return new Promise((resolve, reject) => {
            let data = null;
            const requestToUrl = request.get({
                "uri": url,
                "timeout": 6000
            }, (error, response, body) => {
                if (error) {
                    reject({ "message": "Request failed for " + url });
                }
                data = body;
            });
            requestToUrl.on('response', function (res) {
                if (res.statusCode === HttpResponseHandler.codes.OK) {
                    const rssParser = new RssParser(this);

                    rssParser.parse(url).then(feeds => {
                        // console.log(feeds.meta.title)
                        resolve({ "docs": feeds.items, "title": feeds.meta.title });
                    }).catch(error => {
                        reject({ "message": FEEDS_NOT_FOUND, "data": data });
                    });
                } else {
                    reject({ "message": "Bad status code" });
                }
            })
        })
    }

    async fetchRssFeeds(url) {
        try {
            return await this.getRssData(url)
        } catch (error) {
            console.log(error)
        }
    }
    async addURL(url) {
        const response = await this.fetchRssFeeds(url);
        const name = response.title;
        const document = { "name": name, "url": url, "docType": "source", "sourceType": "web",  "since":Math.floor(Date.now() / 1000) };
        // console.log(response,document,"respdoc")
        const existingUrl = await this.addUrlToCommon(document);
        // console.log(existingUrl)
    }

    async addUrlToCommon(document) {
        const url = document.url;
        let strippedUrl = url.replace(/.*:?\/\/(www.)?/, "")

        if (url.endsWith("/")) {
            strippedUrl = strippedUrl.slice(0, strippedUrl.length - 1); //eslint-disable-line no-magic-numbers
        }
        const urlCombinations = [`http://${strippedUrl}`, `http://${strippedUrl}/`, `http://www.${strippedUrl}`, `http://www.${strippedUrl}/`,
        `https://${strippedUrl}`, `https://${strippedUrl}/`, `https://www.${strippedUrl}`, `https://www.${strippedUrl}/`];
        const sourceDocuments = await DocumentUrls.find({url:urlCombinations});
        try {
            if(sourceDocuments.length === 0){
                const newDocument = await new DocumentUrls(document);
                newDocument.save()
            }else {
                throw "Url already existing in the database"; //eslint-disable-line no-throw-literal
            }
           
        } catch (error) {
            if(error.status !== HttpResponseHandler.codes.CONFLICT) {
                throw "Unable to add the url"; //eslint-disable-line no-throw-literal
            }
        }
    }
}