import { access, constants, readdir } from 'node:fs/promises';
import { dirname, normalize, sep } from 'node:path';
import { createReadStream } from 'node:fs';

const failedMessage = "Operation failed";

export async function catFile (path, catArg) {
    let pathToCat;

    if (catArg.startsWith(sep) || catArg.search('/[:]/') > 0) {
        pathToCat = normalize(catArg);
    } else {
        pathToCat = normalize( path + sep + catArg);
    }

    try {
        const readStream = createReadStream(pathToCat, 'utf-8');

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                process.stdout.write(data);
                process.stdout.write('\n');
            }
        });

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
    }
}

export const cdDir = async (path, cdPath) => {
    let newDir;

    if (cdPath.startsWith(sep) || cdPath.search('/[:]/') > 0) {
        newDir = normalize(cdPath);
    } else {
        newDir = normalize( path + sep + cdPath);
    }

    try {
       await access(newDir, constants.R_OK) 
       return newDir
    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return path;
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
