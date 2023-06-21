import * as readline from 'node:readline';
import * as os from 'node:os';
import { userName } from './src/argsv/username.js'

const cliFileManager = async () => {

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

            if (line.trim() == '.exit') {
                console.log(exitMessage);
            
                process.exit(0);
            }
            
            console.log(workdirMessage);
            
            switch (line.trim()) {
                case '':
                    break;
                default:
                    console.log(invalidMessage);
                    break;
            };
            
            rl.prompt();
        });
        
        rl.on('close', () => {
            
            console.log(eol + exitMessage);
            
            process.exit(0);
        }); 
            
    } catch (error) {

        conolsole.log(failedMessage);
    }
    
};

await cliFileManager();