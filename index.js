const rl = require("serverline");

const Bot    = require("./bot");
const config = require("./config");




(async () => {
    process.stdin.setEncoding("utf8");
    process.stderr.setEncoding("utf8");
    
    const bot = new Bot(config.token);
    
    rl.init();
    rl.setCompletion(["stop", "reload"]);
    rl.setPrompt("> ");
    
    rl.on("line", async line => {
        console.log(line);
    
        const command = line.trim();
    
        switch (command) {
            case "stop":
                await bot.stop();
                process.exit(0);
            break;
            case "reload":
                await bot.reload();
            break;
        }
    });
    
    rl.on("SIGINT", rl => {
        rl.question("Confirm exit: ", answer =>
            answer.match(/^y(es)?$/i)
                ? process.exit(0)
                : rl.output.write("\x1B[1K> ")
            );
    });

    await bot.start();    
})();
