const chalk = require('chalk');
const ws = require('ws');

async function main() {
    const wsClient = new ws('ws://localhost:6969');

    wsClient.on('open', async function open() {
        console.log("Connected to server");
        var readline = require('readline');
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        process.stdout.write(">");
        for await (const line of rl) {
            if (line === "exit") {
                process.exit(0);
            }
            wsClient.send(JSON.stringify({
                type: "msg",
                msg: line
            }));
        }
    });

    wsClient.on('message', function incoming(message) {
        let raw = message.toString();
        let parsed = JSON.parse(raw);
        if (parsed.type === "msg") {
            console.log(chalk.yellow("SERVER SENT:"), parsed.msg);
        }
        else if (parsed.type === "info") {
            console.log(chalk.blue("INFO:"), parsed.msg);
        }
        else if (parsed.type === "action") {
            console.log(chalk.gray(parsed.msg));
        }
        else if (parsed.type === "complete") {
            console.log(chalk.greenBright("Sequence complete!"));
            process.stdout.write(">");
        }
    });
}

main();