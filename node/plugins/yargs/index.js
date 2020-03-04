// yargs 常用api实践

const yargs = require('yargs')

// .command(cmd, desc, [builder], [handler])
yargs.command(     // command 注册命令
    "run  <guid>",
    "run the server",
    yargs => {
        yargs.positional("guid", {
            describe: "a unique identifier for the server",
            type: "string"
        });
    },
    () => {
        debugger
        console.log('yargs')
    }
)



console.log(yargs.parse(['run','position']));   // parse ： 解析命令，触发注册的 handler函数