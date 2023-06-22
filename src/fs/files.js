import { access, constants, opendir } from 'node:fs/promises';
//import { access, constants, opendir } from 'node:fs';
import { dirname, normalize } from 'node:path';

const failedMessage = "Operation failed";

export const cdDir = async (path, cdPath) => {
    let newDir;

    if (cdPath.startsWith('.') ) {
        newDir = normalize( path + '/' + cdPath);
    } else {
        newDir = normalize(cdPath);
    }

    try {
       await access(newDir, constants.R_OK) 
       return newDir
    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return path;
    }
}

export const upDir = (path) => {
    
    return dirname(path);
}

