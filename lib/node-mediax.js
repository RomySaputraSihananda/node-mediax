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
            const $ = cheerio.load(pageContent);
            const imgs = $(".css-9pa8cd").toArray();
            imgs.shift();
            const links = imgs.map((e) => {
                let link = e.attribs.src.split("=");
                link.pop();
                link.push("4096x4096");
                return link.join("=");
            });
            yield page.close();
            return links;
        });
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
