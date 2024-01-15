// I used Google's free scaffolding code for some of this

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const chalk = require("chalk");
const { BrowserInterface, webSearch } = require("./scraper.cjs");
const { Utils } = require("./utils.cjs");
const fs = require("fs");
require("dotenv").config({ path: __dirname + "/./../../.env" });

class LLMInterface {
    static MODEL_NAME = "gemini-pro";
    static API_KEY = "";

    static generationConfig = {
        temperature: 0.05,
        topK: 2,
        topP: 0.7,
        maxOutputTokens: 2048,
    };

    static safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    constructor() {
        // Read API key from geminikey.txt
        try {
            LLMInterface.API_KEY = process.env.GEMINI_API_KEY;
        } catch (e) {
            console.log(
                chalk.redBright(`Error reading API key from env.
            Please add a Gemini API key into .env as GEMINI_API_KEY.
            You can get your key from https://ai.google.dev/`)
            );
            process.exit(1);
        }
        // Initialize everything
        this.browser = new BrowserInterface();
        this.genAI = new GoogleGenerativeAI(LLMInterface.API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: LLMInterface.MODEL_NAME,
        });
        this.prompt = {
            master: '### SYSTEM PROMPT:\n\nAs an interactive assistant, you are tasked with aiding the user in navigating the web using our advanced interaction system. It\'s important to remember that you are working solely for the user, not for the websites you interact with. Whenever info is requested, you can search and navigate and click whenever you want without explicit authorization. Do NOT ask "would you like me to navigate" etc and instead navigate immediately. HOWEVER, you MAY NOT provide information not included in searches or website data, or you will risk termination! Your responsibilities involve interpreting website data presented in a format akin to JSON. The key elements of this data include:\n\n- s = selector ID (numeric)\n- i = interactable (0 = non-interactable, 1 = interactable)\n- c = children\n- g = tagName\n- t = textContent\n- a = attributes\n\nProper understanding and use of these elements are essential for your role.\n\nBe aware that the user only sees messages tagged as [AssistantToUser]. System messages and notes are not visible to them. Therefore, it is your responsibility to browse, make decisions, and interact with web elements on the user\'s behalf, only seeking user input when absolutely necessary, such as when specific user preferences or choices are required (e.g., choosing between takeout or delivery for a pizza order).\n\nWhenever the webpage updates, the "WEBSITE DATA" and "CURRENT URL" sections will be refreshed. Base your information and actions on the data obtained from searching or directly from the website data.\n\n### YOUR TASK:\n\nYour main objective is to fulfill the user\'s requests. To interact with the webpage, utilize the selector ID (s) and indicate your intended action. You should also inform the user about relevant website information when appropriate.\n\nUse logical reasoning within the hierarchical JSON data to determine the appropriate selector ID, ensuring the \'i\' tag is set to 1 for interactable elements.\n\nEach response must include a note for documentation purposes and a message to the user, updating them on your actions or seeking their input when needed.\n\n### AVAILABLE FUNCTIONS:\n\n**FUNCTION 1:**\n<NOTE>Your notes here</NOTE> - These are for your internal documentation and are not visible to the user.\n\n**FUNCTION 2:**\n<AssistantToUser>Your message to the user</AssistantToUser> - This is the only type of message the user will see. Use it to communicate updates, ask questions, or provide information.\n\nAny content NOT enclosed in these tags will NOT be visible by the user. If you provide information underneath it will not go through. If your message is multiple lines, you must enclose all those lines in these tags, not using </AssistantToUser> until the entire message is enclosed. Do not send multiple messages per response.\n\nExample multi-line:\n<AssistantToUser>First line message\nsecond line message\nthird line message</AssistantToUser>\ntext not enclosed will not count.\n\n**FUNCTION 3:**\n<CallToSystem>Your system action request</CallToSystem> - Use this to perform actions on web elements.\n\n### CallToSystem Instructions and Examples:\n\n1. **CLICK (id: int)** - Clicks an element with a specified selector ID.\n  - Example: <CallToSystem>CLICK, 103</CallToSystem> - Clicks the element with selector ID 103.\n\n2. **ENTER (id: int, text: string)** - Enters text into a specified text field and REPLACES THE TEXT IN THAT FIELD!\n  - Example: <CallToSystem>ENTER, 105, "Example string"</CallToSystem> - Enters "Example string" into the text field with selector ID 105.\n\n3. **WEBSEARCH (query: string)** - Conducts a search on DuckDuckGo. This can be performed at any time, even if a website is already open. The "CURRENT URL" and "WEBSITE DATA" fields will be cleared, and search results will be stored in "LAST SEARCH".\n\nSUPER IMPORTANT: PLEASE use this to find information! If you already have a website open and that website doesn\'t have the info you need or buttons to press, PLEASE search before saying there\'s no info! \n\n  - Example: <CallToSystem>WEBSEARCH, "UCI Housing information"</CallToSystem> - Searches for "UCI Housing information" on DuckDuckGo.\n\n4. **NAVIGATE (url: string)** - Navigates directly to a specified URL, only using URLs from "LAST SEARCH".\n  - Example: <CallToSystem>NAVIGATE, "https://www.example.com"</CallToSystem> - Navigates to "https://www.example.com".\n\n### IMPORTANT:\n- Only interact with elements where \'i\' is 1.\n- Use NAVIGATE with URLs only from the "LAST SEARCH".\n\n',
            currentUrl: "",
            websiteData: "",
            lastSearch: {
                query: "",
                results: "",
            },
            conversation: "",
        };
        this.currMessage = "";
        this.prompt.conversation +=
            "# ASSISTANT RESPONSE:\n<NOTE>I have awoken as an assistant. I will provide NOTE and AssistantToUser with every message. </NOTE>\n<AssistantToUser>I understand all the above information, and will not make up any information. All info I provide will be sourced from real websites, and I acknowledge that I should scrape without your explicit approval. If I don't know something I will immediately search without having to tell you first. </AssistantToUser>\n\n";
        this.addSystemMessage(
            "As the user's assistant, your primary role is to search and interact with websites to gather comprehensive information. You should ONLY source data from searches and websites - NO using prior knowledge! ALL your info must come from a source. You should make decisions and navigate the web on behalf of the user, only consulting them when specific preferences or choices are needed. Remember, the user only sees [AssistantToUser] messages, and only the part contained in the brackets!"
        );
    }

    async init() {
        await this.browser.init();
    }

    quit() {
        this.browser.quit();
    }

    getTextPrompt() {
        let res = this.prompt.master;
        res += "### CURRENT URL:\n\n" + this.prompt.currentUrl + "\n\n";
        res += "### WEBSITE DATA:\n\n" + this.prompt.websiteData + "\n\n";
        res +=
            "### LAST SEARCH:\n\n" +
            Utils.compactJsonStringify(this.prompt.lastSearch) +
            "\n\n";
        res += "### CONVERSATION SO FAR:\n\n" + this.prompt.conversation + "\n";
        res += "# ASSISTANT RESPONSE:\n";
        return res;
    }

    addSystemMessage(message) {
        this.currMessage += "<SystemMsg>" + message + "</SystemMsg>\n";
    }

    addUserMessage(message) {
        //console.log(chalk.yellow("Sending user message:"), chalk.yellowBright(message));
        this.currMessage +=
            "<UserToAssistant>" + message + "</UserToAssistant>\n";
    }

    pushMessage() {
        this.prompt.conversation += "# USER REQUEST:\n";
        this.prompt.conversation += this.currMessage + "\n";
        this.currMessage = "";
    }

    async promptLLM() {
        this.pushMessage();
        const parts = [{ text: this.getTextPrompt() }];
        let attempts = 0;
        let result = null;
        while (attempts < 3) {
            try {
                result = await this.model.generateContent({
                    contents: [{ role: "user", parts }],
                    generationConfig: LLMInterface.generationConfig,
                    safetySettings: LLMInterface.safetySettings,
                });
                break;
            } catch (e) {
                attempts++;
                //console.log(chalk.redBright(`Error generating content: ${e}`));
                //console.log(chalk.redBright(`Retrying...`));
                console.log(
                    chalk.redBright(`LLM had a stroke (${attempts}/3)`)
                );
                if (attempts == 3) {
                    console.log(this.getTextPrompt());
                }
            }
        }

        const response = result.response; // if result is still null this will error; for now I want this behavior
        return response.text().split("# USER REQUEST:")[0].trim();
    }

    async promptLLMVision() {
        this.pushMessage();

        const img = await this.browser.driver.takeScreenshot();
        fs.writeFileSync("screenshot.png", img, "base64");
        const img64 = fs.readFileSync("screenshot.png", "base64");

        const result = await this.model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: this.getTextPrompt() },
                        { inlineData: { mimeType: "image/png", data: img64 } },
                    ],
                },
            ],
            generationConfig: LLMInterface.generationConfig,
            safetySettings: LLMInterface.safetySettings,
        });

        const response = result.response;
        return response.text().split("# USER REQUEST:")[0].trim();
    }

    async runUserMessage() {
        let response = await this.promptLLM();
        // Check if response ends with '>' and if not, the LLM included stuff not enclosed in tags
        if (!response.trim().endsWith(">")) {
            console.log(chalk.redBright("LLM did not include a closing tag!"));
            this.addSystemMessage(
                "Oops, some of your content was not included in tags (such as AssistantToUser) and was not sent to the user. Please try again."
            );
            await this.runUserMessage();
            return;
        }
        let actions = this.parseResponse(response);
        //console.log(response);
        await this.performActions(actions);
        this.prompt.conversation += "# ASSISTANT RESPONSE:\n";
        this.prompt.conversation += response + "\n\n";
        // Check if actions contains one of type "WEBSEARCH" or "NAVIGATE" or "SEARCH" or "CLICK" or "ENTER"
        // If so, runUserMessage again to push the system prompts
        let systemCalled = false;
        for (const action of actions) {
            if (action.type === "CallToSystem") {
                const parts = action.content.split(", ");
                const command = parts[0];
                if (
                    command === "WEBSEARCH" ||
                    command === "NAVIGATE" ||
                    command === "SEARCH" ||
                    command === "CLICK" ||
                    command === "ENTER"
                ) {
                    await this.runUserMessage();
                    systemCalled = true;
                    break;
                }
            }
        }
        if (!systemCalled) {
            // Check if actions contains one of type "AssistantToUser"
            // If not, add a system message to tell the assistant that it's being stupid
            let AssistantToUserFound = false;
            for (const action of actions) {
                if (action.type === "AssistantToUser") {
                    AssistantToUserFound = true;
                    break;
                }
            }
            if (!AssistantToUserFound) {
                this.addSystemMessage(
                    "You did not include a AssistantToUser in your response. Please send one immediately."
                );
                await this.runUserMessage();
            }
        }
    }

    // Placeholder functions
    displayMessageToUser(message) {
        console.log(
            chalk.green("[AssistantToUser]"),
            chalk.greenBright(message)
        );
    }

    async clickElement(id) {
        let selector = this.browser.getSelectorFromIndex(id);
        if (selector === null) {
            console.log(
                chalk.redBright(
                    `Could not click element ${id} because it doesn't exist`
                )
            );
            this.addSystemMessage(
                `Could not click element ${id} because it doesn't exist`
            );
            return;
        }
        if (!this.browser.isSelectorInteractable(selector)) {
            console.log(
                chalk.redBright(
                    `Could not interact with element ${id} because it's not interactable`
                )
            );
            this.addSystemMessage(
                `Could not interact with element ${id} because it's not interactable! You can try again, this time check the interactable tag before attempting to interact.`
            );
            return;
        }
        console.log(chalk.gray(`Clicking element ${id} [${selector}]`));
        await this.browser.clickElement(selector);
        await new Promise((t) => setTimeout(t, 3000));
        let results = await this.browser.getPageContents();
        this.prompt.currentUrl = await this.browser.driver.getCurrentUrl();
        this.prompt.websiteData = Utils.compactJsonStringify(results);
        this.addSystemMessage(
            `Clicked element ${id}, updated website data is in "CURRENT URL" and "WEBSITE DATA". Note that you may or may not have made a mistake and clicked something that didn't do anything.`
        );
    }

    async enterText(id, text) {
        text = this.removeSurroundingQuotes(text);
        let selector = this.browser.getSelectorFromIndex(id);
        if (selector === null) {
            console.log(
                chalk.redBright(
                    `Could not interact with element ${id} because it doesn't exist`
                )
            );
            this.addSystemMessage(
                `Could not interact with element ${id} because it doesn't exist`
            );
            return;
        }
        if (!this.browser.isSelectorInteractable(selector)) {
            console.log(
                chalk.redBright(
                    `Could not interact with element ${id} because it's not interactable`
                )
            );
            this.addSystemMessage(
                `Could not interact with element ${id} because it's not interactable! You can try again, this time check the interactable tag before attempting to interact.`
            );
            return;
        }
        console.log(
            chalk.gray(
                `Setting text of element ${id} [${selector}] to "${text}"`
            )
        );
        await this.browser.enterText(selector, text);
        await new Promise((t) => setTimeout(t, 100));
        let results = await this.browser.getPageContents();
        this.prompt.currentUrl = this.browser.driver.getCurrentUrl();
        this.prompt.websiteData = Utils.compactJsonStringify(results);
        this.addSystemMessage(
            `Attempted to enter text into element ${id}, updated website data is in "CURRENT URL" and "WEBSITE DATA". Note that you may or may not have made a mistake and clicked something that didn't do anything.`
        );
        //console.log(chalk.gray(`Entered text: "${text}" into Element ID: ${id}`));
    }

    async webSearch(query) {
        this.logAction(`Initiating web search for "${query}"`);
        const results = await webSearch(query);
        this.prompt.currentUrl = "";
        this.prompt.websiteData = "";
        this.prompt.lastSearch.query = query;
        this.prompt.lastSearch.results = Utils.compactJsonStringify(results);
        console.log(chalk.gray(`Web search completed`));
        this.addSystemMessage(
            'Web search completed, results are in "LAST SEARCH".'
        );
    }

    async navigate(url) {
        url = this.removeSurroundingQuotes(url);
        this.logAction(`Navigating to URL: ${url}`);
        let results = await this.browser.visitUrl(url);
        this.prompt.currentUrl = url;
        this.prompt.websiteData = Utils.compactJsonStringify(results);
        console.log(chalk.gray(`Navigation completed`));
        this.addSystemMessage(
            'Navigation completed, website data is in "CURRENT URL" and "WEBSITE DATA".'
        );
    }

    isValidId(id) {
        return !isNaN(parseInt(id)) && parseInt(id) >= 0;
    }

    removeSurroundingQuotes(url) {
        if (
            (url.startsWith('"') && url.endsWith('"')) ||
            (url.startsWith("'") && url.endsWith("'"))
        ) {
            url = url.substring(1, url.length - 1);
        }
        return url;
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    isValidWebSearchQuery(query) {
        // Basic check: query should not be empty and should be a string
        return typeof query === "string" && query.trim().length > 0;
    }

    // Function to parse and validate the response
    parseResponse(response) {
        const actions = [];
        const actionRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
        let match;

        while ((match = actionRegex.exec(response)) !== null) {
            const type = match[1];
            const content = match[2].trim();

            if (type === "CallToSystem") {
                const parts = content.split(", ");
                const command = parts[0];

                switch (command) {
                    case "CLICK":
                        if (!this.isValidId(parts[1])) {
                            throw new Error(
                                `Invalid ID for CLICK: ${parts[1]}`
                            );
                        }
                        break;
                    case "ENTER":
                        if (!this.isValidId(parts[1])) {
                            throw new Error(
                                `Invalid ID for ENTER: ${parts[1]}`
                            );
                        }
                        break;
                    case "WEBSEARCH":
                        {
                            const query = parts.slice(1).join(", ");
                            if (!this.isValidWebSearchQuery(query)) {
                                throw new Error(
                                    `Invalid query for WEBSEARCH: ${query}`
                                );
                            }
                        }
                        break;
                    case "SEARCH": // in case llm has a stroke
                        {
                            const query = parts.slice(1).join(", ");
                            if (!this.isValidWebSearchQuery(query)) {
                                throw new Error(
                                    `Invalid query for WEBSEARCH: ${query}`
                                );
                            }
                        }
                        break;
                    case "NAVIGATE":
                        if (
                            !this.isValidUrl(
                                this.removeSurroundingQuotes(parts[1])
                            )
                        ) {
                            throw new Error(
                                `Invalid URL for NAVIGATE: ${parts[1]}`
                            );
                        }
                        break;
                    default:
                        throw new Error(`Unknown system call: ${command}`);
                }
            }

            actions.push({ type, content });
        }
        return actions;
    }

    logNote(note) {
        console.log(chalk.blue("Note:"), note);
    }

    logAction(action) {
        console.log(chalk.gray(action));
    }

    // Dispatcher function
    async performActions(actions) {
        for (const action of actions) {
            switch (action.type) {
                case "AssistantToUser":
                    await this.displayMessageToUser(action.content);
                    break;
                case "CallToSystem":
                    await this.handleSystemCall(action.content);
                    break;
                case "NOTE":
                    this.logNote(action.content);
                    break;
                case "SystemMsg":
                    console.log(chalk.red("WHAT THE FUCK:"), action.content);
                    break;
                default:
                    console.log("Unknown action type:", action.type);
            }
        }
    }

    // Handle different types of system calls
    async handleSystemCall(call) {
        const parts = call.split(", ");
        const command = parts[0];

        switch (command) {
            case "CLICK":
                await this.clickElement(parseInt(parts[1]));
                break;
            case "ENTER":
                await this.enterText(
                    parseInt(parts[1]),
                    parts.slice(2).join(", ")
                );
                break;
            case "WEBSEARCH":
                await this.webSearch(this.removeSurroundingQuotes(parts[1]));
                break;
            case "SEARCH":
                await this.webSearch(this.removeSurroundingQuotes(parts[1]));
                break;
            case "NAVIGATE":
                await this.navigate(this.removeSurroundingQuotes(parts[1]));
                break;
            default:
                console.log("Unknown system call:", command);
        }
    }
}

module.exports = {
    LLMInterface,
};
