const chalk = require("chalk");

export async function StartWebSocket() {
    const wsClient = new WebSocket("ws://localhost:6969");

    wsClient.addEventListener("open", async function open() {
        console.log("Connected to server");
        // var readline = require("readline");
        // var rl = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        // });
        // process.stdout.write(">");
        // for await (const line of rl) {
        //     if (line === "exit") {
        //         process.exit(0);
        //     }
        //     wsClient.send(
        //         JSON.stringify({
        //             type: "msg",
        //             msg: line,
        //         })
        //     );
        // }
    });

    wsClient.addEventListener(
        "message",
        function incoming(message: { toString: () => any }) {
            let raw = message.toString();
            let parsed = JSON.parse(raw);
            if (parsed.type === "msg") {
                console.log(chalk.yellow("SERVER SENT:"), parsed.msg);
                process.stdout.write(">");
            } else if (parsed.type === "info") {
                console.log(chalk.blue("INFO:"), parsed.msg);
            } else if (parsed.type === "action") {
                console.log(chalk.gray("ACTION:"), parsed.msg);
            }
        }
    );
}
