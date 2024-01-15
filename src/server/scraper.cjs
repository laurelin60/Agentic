const { Builder, By, logging } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const jsdom = require("jsdom");
const { get } = require("http");
const { getEventListeners } = require("events");
const { JSDOM } = jsdom;
const DDG = require("duck-duck-scrape");
const { Utils } = require("./utils.cjs");

async function webSearch(query) {
    const rawSearchResults = await DDG.search(query, {
        safeSearch: DDG.SafeSearchType.OFF,
    });
    let searchResults = rawSearchResults.results.slice(0, 7).map((result) => {
        return {
            title: result.title,
            url: result.url,
            description: result.description,
        };
    });
    return searchResults;
}

class BrowserInterface {
    constructor() {
        this.selectors = [];
    }

    quit() {
        this.driver.quit();
    }

    async init() {
        const logPrefs = new logging.Preferences();
        logPrefs.setLevel(logging.Type.BROWSER, logging.Level.OFF);
        logPrefs.setLevel(logging.Type.DRIVER, logging.Level.OFF);
        logPrefs.setLevel(logging.Type.CLIENT, logging.Level.OFF);
        logPrefs.setLevel(logging.Type.SERVER, logging.Level.OFF);

        let options = new chrome.Options();
        //options.excludeSwitches('enable-logging');
        //options.addArguments('--headless=new', '--disable-logging', '--log-level=3');
        //options.addArguments(`--user-data-dir=${process.env.APPDATA}\\Agentic\\chrome-profile`);
        options.setLoggingPrefs(logPrefs);
        this.driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    }

    async visitUrl(url) {
        await this.driver.get(url);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        Utils.debugLog("Page loaded");

        return await this.getPageContents();
    }

    async grabScreenshot() {
        return await this.driver.takeScreenshot();
    }

    async getPageContents() {
        this.selectors = [];
        let pageSource = await this.driver.getPageSource();

        const virtualConsole = new jsdom.VirtualConsole();
        //virtualConsole.on("log", () => {});   // Suppresses console.log
        //virtualConsole.on("info", () => {});  // Suppresses console.info
        //virtualConsole.on("warn", () => {});  // Suppresses console.warn
        //virtualConsole.on("error", () => {}); // Suppresses console.error

        let dom = new JSDOM(pageSource, { virtualConsole });
        let document = dom.window.document;

        const elements = await this.driver.findElements(By.css("*"));
        await this.checkVisibility();
        Utils.debugLog("Visibility assigned");
        pageSource = await this.driver.getPageSource();
        dom = new JSDOM(pageSource, { virtualConsole });
        document = dom.window.document;
        const textObject = await this.transformToTextObject(
            document.documentElement
        );
        Utils.debugLog("Text transform done");
        return textObject;
    }

    async checkVisibility() {
        let attempts = 0;
        while (attempts < 3) {
            attempts++;
            try {
                await this.driver.executeScript(
                    async (elements) => {
                        console.log(
                            "Processing visibility for " +
                                elements.length +
                                " elements"
                        );
                        let res = await Promise.all(
                            elements.map(async (element) => {
                                try {
                                    if (element) {
                                        const style =
                                            window.getComputedStyle(element);
                                        const good =
                                            element.children.length > 0 ||
                                            !style ||
                                            (style &&
                                                style.display !== "none" &&
                                                style.visibility !== "hidden" &&
                                                element.offsetWidth > 0 &&
                                                element.offsetHeight > 0);
                                        if (good) {
                                            element.classList.add(
                                                "epic-good-element-thingy-yay"
                                            );
                                            if (
                                                getEventListeners(element).click
                                            ) {
                                                element.classList.add(
                                                    "epic-good-element-thingy-clickable"
                                                );
                                            }
                                        } else {
                                            //element.textContent = "";
                                            //element.remove();
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                            })
                        );
                        console.log("Processing finished!");
                        return res;
                    },
                    await this.driver.findElements(By.css("*"))
                ); // Make sure elements are passed as arguments
                break;
            } catch (e) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                //console.error(e);
            }
        }
        if (attempts >= 3) throw new Error("Failed to process visibility");
    }

    async clickElement(selector) {
        await this.driver.executeScript(
            async (selector, driver) => {
                let element = document.querySelector(selector);
                if (element && element.click) {
                    element.click();
                }
            },
            selector,
            this.driver
        );
    }

    async enterText(selector, text) {
        // Clear the text field first
        await this.driver.executeScript(
            async (selector, text) => {
                let element = document.querySelector(selector);
                if (element) {
                    element.value = "";
                }
            },
            selector,
            text
        );
        // Direct input
        let element = await this.driver.findElement(By.css(selector));
        if (element) {
            try {
                await element.sendKeys(text);
            } catch (e) {
                //console.error(e);
            }
        }
        /*
        await this.driver.executeScript(async (selector, text) => {
            let element = document.querySelector(selector);
            if (element) {
                element.value = text;
                if (element.focus) {
                    element.focus();
                }
            }
        }, selector, text);
        */
    }

    getSelectorFromIndex(index) {
        if (index < 0 || index >= this.selectors.length) return null;
        return this.selectors[index];
    }

    generateUniqueSelector(element) {
        if (!element) return null;

        const path = [];
        while (element.nodeType === element.ELEMENT_NODE) {
            let selector = element.localName;

            if (element.id) {
                selector += `#${element.id}`;
                path.unshift(selector);
                break;
            } else {
                let siblings = Array.from(element.parentNode.children);
                const index = siblings.indexOf(element) + 1;
                selector += `:nth-child(${index})`;
            }

            path.unshift(selector);
            element = element.parentNode;
        }

        this.selectors.push(path.join(" > "));
        return this.selectors.length - 1;
    }

    isInteractable(element) {
        if (!element) return false;
        const interactableTags = ["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"];
        return (
            interactableTags.includes(element.tagName) ||
            (element.classList &&
                element.classList.contains(
                    "epic-good-element-thingy-clickable"
                ))
        );
    }

    async isSelectorInteractable(selector) {
        if (!selector) return false;
        return await this.driver.executeScript(async (selector) => {
            let element = document.querySelector(selector);
            if (!element) return false;
            const interactableTags = [
                "BUTTON",
                "INPUT",
                "SELECT",
                "TEXTAREA",
                "A",
            ];
            return (
                interactableTags.includes(element.tagName) ||
                (element.classList &&
                    element.classList.contains(
                        "epic-good-element-thingy-clickable"
                    ))
            );
        }, selector);
    }

    async transformToTextObject(element) {
        const nonContentTags = [
            "SCRIPT",
            "STYLE",
            "NOSCRIPT",
            "BR",
            "HR",
            "HEAD",
            "LINK",
            "META",
            "TITLE",
        ];
        const minimalAttributes = [
            "href",
            "name",
            "type",
            "placeholder",
            "value",
            "aria-label",
        ];

        if (nonContentTags.includes(element.tagName)) {
            return undefined;
        }

        if (!element.classList.contains("epic-good-element-thingy-yay")) {
            return undefined;
        }

        let elementDetails = { s: this.generateUniqueSelector(element) };
        let isInteractable = this.isInteractable(element);
        elementDetails.i = isInteractable ? 1 : 0;

        if (isInteractable) {
            elementDetails.g = element.tagName;
            let elementAttributes = {};
            Array.from(element.attributes).forEach((attr) => {
                if (minimalAttributes.includes(attr.name)) {
                    elementAttributes[attr.name] = attr.value;
                }
            });
            if (Object.keys(elementAttributes).length > 0) {
                elementDetails.a = elementAttributes;
            }
        }

        let hasSignificantChildren = false;
        if (element.childNodes && element.childNodes.length > 0) {
            let currChildren = [];
            for (const child of Array.from(element.childNodes)) {
                if (child.nodeType === 1) {
                    // ELEMENT_NODE
                    let childDetails = await this.transformToTextObject(child);
                    if (childDetails) {
                        currChildren.push(childDetails);
                        hasSignificantChildren = true;
                    }
                }
            }
            if (currChildren.length > 0) {
                elementDetails.c = currChildren;
            }
        }

        if (!hasSignificantChildren) {
            let textContent = element.textContent
                ? element.textContent.trim()
                : "";
            if (textContent && textContent.length > 0) {
                elementDetails.t = textContent;
            }
        }

        if (!elementDetails.i && !elementDetails.t && !hasSignificantChildren) {
            return undefined;
        }

        if (
            elementDetails.t &&
            (elementDetails.t.length > 15000 ||
                (elementDetails.t.length >= 5 &&
                    elementDetails.t.substr(0, 5) == "html:"))
        ) {
            return undefined;
        }

        // Reduce the final size by removing classes that have no text and no interactability but have one child
        // We replace the class with the child
        if (
            !elementDetails.i &&
            !elementDetails.t &&
            elementDetails.c &&
            elementDetails.c.length == 1 &&
            hasSignificantChildren
        ) {
            let childDetails = elementDetails.c[0];
            return Object.keys(childDetails).length > 0
                ? childDetails
                : undefined;
        }

        return Object.keys(elementDetails).length > 0
            ? elementDetails
            : undefined;
    }
}

module.exports = {
    BrowserInterface,
    webSearch,
};
