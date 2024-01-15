const { LLMInterface } = require("./llm.cjs");
const chalk = require("chalk");
const ws = require("ws");

async function main() {
    // Await websocket connections on port 6969
    const wsServer = new ws.Server({ port: 6969 });
    console.log("Awaiting connections on port 6969");

    // When a connection is made
    wsServer.on("connection", async function connection(ws) {
        // Make a new LLM instance when a connection is made
        const llm = new LLMInterface();
        await llm.init();
        // Hook MsgToUser
        const displayMessageToUser = llm.displayMessageToUser;
        llm.displayMessageToUser = function (message) {
            ws.send(
                JSON.stringify({
                    type: "msg",
                    msg: message,
                })
            );
            displayMessageToUser(message);
        };

        // Hook logNote and have it send message of type "info"
        const logNote = llm.logNote;
        llm.logNote = function (message) {
            ws.send(
                JSON.stringify({
                    type: "info",
                    msg: message,
                })
            );
            logNote(message);
        };

        // Hook logAction and have it send message of type "action"
        const logAction = llm.logAction;
        llm.logAction = function (message) {
            ws.send(
                JSON.stringify({
                    type: "action",
                    msg: message,
                })
            );
            logAction(message);
        };

        ws.on("message", async function incoming(message) {
            console.log(chalk.yellow("CLIENT SENT:"), message.toString());
            let parsed = JSON.parse(message);
            if (parsed.type === "msg") {
                llm.addUserMessage(parsed.msg);
                await llm.runUserMessage();
                ws.send(
                    JSON.stringify({
                        type: "complete",
                        msg: "[you should not see this message, please reconfigure your application to not display this message like a normal one]",
                    })
                );
            }
            if (parsed.type === "reset") {
                // add logic later to reset the LLM instance
            }
        });

        ws.on("close", function close() {
            console.log("Client disconnected");
            llm.quit();
        });
    });
}

main();
