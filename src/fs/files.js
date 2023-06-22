import { access, constants, opendir } from 'node:fs/promises';
//import { access, constants, opendir } from 'node:fs';
import { dirname, normalize, sep } from 'node:path';

const failedMessage = "Operation failed";

export const cdDir = async (path, cdPath) => {
    let newDir;

    if (cdPath.startsWith(sep) || cdPath.search('/[:]/') > 0) {
        newDir = normalize(cdPath);
    } else {
        newDir = normalize( path + sep + cdPath);
    }

    console.log('newDir', newDir);

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
