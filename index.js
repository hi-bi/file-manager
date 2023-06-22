    import * as readline from 'node:readline';
    import * as os from 'node:os';
    import { userName } from './src/argsv/username.js';
    import { cdDir, lsDir, upDir, catFile, addFile, rnFile, cpFile, mvFile, rmFile, hshFile, zipFile, unzipFile } from './src/fs/files.js';

    const cliFileManager = () => {

        try {
            
            const workdirMessage = "You are currently in ";
            const invalidMessage = "Invalid input";
            const failedMessage = "Operation failed";

            const startMessage = "Welcome to the File Manager, " + userName + "!";
            const exitMessage = "Thank you for using File Manager, " + userName + ", goodbye!";

            const homeDir = os.homedir();
            let startDir = homeDir;
            const eol = os.EOL;

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
                
            rl.write(startMessage + eol);
            
            rl.write(workdirMessage + startDir + eol);
            
            rl.prompt();
            
            rl.on('line', (line) => {

                let input = line.trim();
                const command = input.split(" ")[0];

                if (command == '.exit') {
                    console.log(exitMessage);
                
                    process.exit(0);
                }
                switch (command) {
                    case '':
                        console.log(workdirMessage + startDir);
                        rl.prompt();
                        break;

                    case 'up':
                        startDir = upDir(startDir);
                        console.log(workdirMessage + startDir);
                        rl.prompt();
                        break;

                    case 'cd':
                        const cdPath = input.substring(3).replace('"', '').replace('"', '');
                        const p = cdDir(startDir, cdPath);
                        p.then( value => {
                            startDir = value;
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'ls':
                        lsDir(startDir)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'cat':
                            const catArg = input.split(" ")[1];

                            catFile(startDir, catArg)
                            .then( value => {
                                console.log(workdirMessage + startDir);
                                rl.prompt();
                            })
                        break;
    
                    case 'add':
                        const addArg = input.split(" ")[1];

                        addFile(startDir, addArg)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;
    
                    case 'rn':
                        const rnArg1 = input.split(" ")[1];
                        const rnArg2 = input.split(" ")[2];

                        rnFile(startDir, rnArg1, rnArg2)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'cp':
                        const cpArg1 = input.split(" ")[1];
                        const cpArg2 = input.split(" ")[2];

                        cpFile(startDir, cpArg1, cpArg2)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;
    
                    case 'mv':
                        const mvArg1 = input.split(" ")[1];
                        const mvArg2 = input.split(" ")[2];

                        mvFile(startDir, mvArg1, mvArg2)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'rm':
                        const rmArg1 = input.split(" ")[1];

                        rmFile(startDir, rmArg1)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'hash':
                        const hshArg1 = input.split(" ")[1];

                        hshFile(startDir, hshArg1)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'compress':
                        const zipArg1 = input.split(" ")[1];
                        const zipArg2 = input.split(" ")[2];

                        zipFile(startDir, zipArg1, zipArg2)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;

                    case 'decompress':
                        const unzipArg1 = input.split(" ")[1];
                        const unzipArg2 = input.split(" ")[2];

                        unzipFile(startDir, unzipArg1, unzipArg2)
                        .then( value => {
                            console.log(workdirMessage + startDir);
                            rl.prompt();
                        })
                        break;
    
                    default:
                        console.log(invalidMessage);
                        console.log(workdirMessage + startDir);
                        rl.prompt();
                        break;
                };

            });
            
            rl.on('close', () => {
                
                console.log(eol + exitMessage);
                
                process.exit(0);
            }); 

        } catch (error) {
            console.log(failedMessage + ': ' + error.message);
           
        }
            
    };

    cliFileManager();