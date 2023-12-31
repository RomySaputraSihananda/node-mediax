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
import fs from "fs";
import path from "path";
class node_mediax {
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
    /**
     * This is a method for retrieving data from a Twitter URL.
     * @param {string} url - URL from Twitter that will be scrapped
     * @returns {Promise<Data>} Details of the URL that has been scrapped
     */
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browser) {
                throw new Error("Browser is not initialized. Call init() first.");
            }
            const page = yield this.browser.newPage();
            yield page.goto(url.replace(/\/photo.*/, ""));
            yield page.waitForSelector("img.css-9pa8cd", { timeout: 5000 });
            this.$ = cheerio.load(yield page.content());
            const { media, avatar } = this.getMedia();
            const tweet = this.getTweet();
            const { views, reposts, quotes, likes, bookmarks } = this.getInfo();
            const createAt = this.getCreateAt();
            const username = this.getUsername();
            const verified = this.getVerified();
            return {
                username,
                avatar,
                verified,
                createAt,
                tweet,
                media,
                views,
                reposts,
                quotes,
                likes,
                bookmarks,
            };
        });
    }
    /**
     * This is a method to grab an image from a Twitter URL and save it
     * @param {string} folder - The name of the folder that will be used to store photos
     * @param {string} url - URL from Twitter that will be scrapped
     */
    save(folder, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { media } = (yield this.get(url));
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder);
            media.forEach(({ url }) => __awaiter(this, void 0, void 0, function* () {
                const req = yield fetch(url);
                const res = yield req.arrayBuffer();
                fs.writeFileSync(path.join(folder, this.getName(url)), Buffer.from(res));
                console.log({
                    url,
                    message: `save on ${path.join(folder, this.getName(url))}`,
                });
            }));
            console.log("download complete");
        });
    }
    getName(url) {
        return url.split("/")[4].split("?")[0] + ".jpg";
    }
    getInfo() {
        const [views, reposts, quotes, likes, bookmarks] = this.$(".css-1dbjc4n.r-xoduu5.r-1udh08x").toArray();
        return {
            views: this.getText(views),
            likes: this.getText(likes),
            reposts: this.getText(reposts),
            quotes: this.getText(quotes),
            bookmarks: this.getText(bookmarks),
        };
    }
    getMedia() {
        const imgs = this.$(".css-9pa8cd").toArray();
        const avatar = imgs.shift().attribs.src.replace("_normal", "");
        const media = imgs.map((e) => {
            let link = e.attribs.src.split("=");
            link.pop();
            link.push("4096x4096");
            return { url: link.join("="), type: "image" };
        });
        return { media, avatar };
    }
    getTweet() {
        return this.getText(this.$(".css-1dbjc4n.r-1s2bzr4"));
    }
    getCreateAt() {
        return this.$("time").toArray()[0].attribs.datetime;
    }
    getUsername() {
        return this.getText(this.$(".css-901oao.css-1hf3ou5.r-18u37iz.r-37j5jr.r-1wvb978.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0"));
    }
    getVerified() {
        const verif = this.$(".r-1cvl2hr.r-4qtqp9.r-yyyyoo.r-1xvli5t.r-9cviqr.r-f9ja8p.r-og9te1.r-bnwqim.r-1plcrui.r-lrvibr");
        return verif.length < 1 ? false : true;
    }
    getText(element) {
        return this.$(element).text();
    }
    getNumber(element) {
        const number = this.getText(element).replace(/,/g, ".");
        return number.match("k") ? parseFloat(number) * 1000 : parseFloat(number);
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
}
class Mediax {
    /**
     * This is a method for retrieving data from a Twitter URL.
     * @param {string} url - URL from Twitter that will be scrapped
     * @returns {Promise<Data>} Details of the URL that has been scrapped
     */
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const x = new node_mediax();
            yield x.init();
            const data = yield x.get(url);
            yield x.close();
            return data;
        });
    }
    /**
     * This is a method to grab an image from a Twitter URL and save it
     * @param {string} folder - The name of the folder that will be used to store photos
     * @param {string} url - URL from Twitter that will be scrapped
     */
    save(folder, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const x = new node_mediax();
            yield x.init();
            yield x.save(folder, url);
            yield x.close();
        });
    }
}
export default new Mediax();
