var fs = require('fs')
var stdin = process.stdin
var stdout = process.stdout

fs.readdir(process.cwd(), function (err, files) {
    console.log(' ')
    if (!files.length) {
        return console.log('   \033[31m No files to show!\033[39m\n')
    }
    console.log('   Select which file or directory you want to see\n')

    var stats = []
    function file(i) {
        var filename = files[i]

        fs.stat(__dirname + '/' + filename, function (err, stat) {
            stats[i] = stat
            if (stat.isDirectory()) {
                console.log('     ' + i + '   \033[36m ' + filename + '/\033[39m')
            } else {
                console.log('     ' + i + '   \033[90m ' + filename + '\033[39m')
            }
            i++
            if (i == files.length) {
                read()
            } else {
                file(i)
            }
        })
    }
    file(0)

    function read() {
        console.log(' ')
        stdout.write('    \033[33mEnter you choice :\033[39m')
        stdin.resume();  // 等待用户输入
        stdin.setEncoding('utf-8')
        stdin.on('data', option)   /// 监听data事件？ 回调option
    }

    function option(data) {
        var filename = files[Number(data)]
        if (!filename) {
            stdout.write('    \033[31mEnter you choice :\033[39m ')
        } else {
            stdin.pause();

            if (stats[Number(data)].isDirectory()) {
                fs.readdir(__dirname + '/' + filename, function (err, files) {
                    console.log('   ')
                    console.log('  (' + files.length + ' file' + ')')
                    files.forEach(function (file) {
                        console.log('    -    ' + file)
                    })

                })

            } else {
                fs.readFile(__dirname + '/' + filename, 'utf-8', function (err, data) {
                    console.log('  ')
                    console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39m')
                })
            }
        }
    }
})

