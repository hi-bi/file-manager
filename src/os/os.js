import { trace } from 'node:console';
import { EOL, cpus, homedir, machine, arch, userInfo } from 'node:os';

const failedMessage = "Operation failed";

export const envOs = async (cmnd) => {

    try {
        switch (cmnd) {
            case '--EOL':
                console.log(EOL);
                break;

            case '--cpus':

                const outputArray = new Array;

                const cps = cpus();
                for (const item of cps) {
                    outputArray.push({model: item.model, speed: item.speed.toString().substring(0,1) + ',' + item.speed.toString().substring(1)})
                }
                
                console.log( machine());
                console.table(outputArray);

                break;

            case '--homedir':

                console.log(homedir());
    
                break;

            case '--username':

                console.log(userInfo());
                break;

            case '--architecture':

                console.log( arch());
                break;

            default:
                break;
        }

        return true;
    
    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return false;
    }
}

export const lsDir = async (path) => {

    try {
        const outputArray = new Array;
        const files = await readdir(path, {withFileTypes: true});

        for (const file of files) {
            if (file.isDirectory()) {
                outputArray.push({name: file.name, type: 'directory'})
            }
            if (file.isFile()) {
                outputArray.push({name: file.name, type: 'file'})
            }

        }

        outputArray.sort((a, b)=> {
            if (a.type === b.type){
              return a.name < b.name ? -1 : 1
            } else {
              return a.type < b.type ? -1 : 1
            }
        })

        console.table(outputArray);

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
    }

}


export const upDir = (path) => {
    
    return dirname(path);
}
