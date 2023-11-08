var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
class Mediax {
    constructor() {
        this.browser = null;
        this.$ = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({
                headless: "new",
            });
        });
    }
    get(tweetUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browser) {
                throw new Error("Browser is not initialized. Call initialize() first.");
            }
            const page = yield this.browser.newPage();
            yield page.goto(tweetUrl);
            yield page.waitForSelector("img.css-9pa8cd", { timeout: 5000 });
            const pageContent = yield page.content();
            this.$ = cheerio.load(pageContent);
            const media = this.getMedia();
            const tweet = this.getText(".css-901oao.r-1nao33i.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0");
            const info = this.getInfo();
            const createAt = this.getCreateAt();
            return Object.assign({ createAt, tweet, media }, info);
        });
    }
    getInfo() {
        const [views, repost, likes, bookmarks] = this.$(".css-1dbjc4n.r-xoduu5.r-1udh08x").toArray();
        return {
            views: this.getText(views),
            repost: this.getText(repost),
            likes: this.getText(likes),
            bookmarks: this.getText(bookmarks),
        };
    }
    getMedia() {
        const imgs = this.$(".css-9pa8cd").toArray();
        imgs.shift();
        const medias = imgs.map((e) => {
            let link = e.attribs.src.split("=");
            link.pop();
            link.push("4096x4096");
            return link.join("=");
        });
        return medias;
    }
    getCreateAt() {
        return this.$("time").toArray()[0].attribs.datetime;
    }
    getText(element) {
        return this.$(element).text();
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
}
export default Mediax;
