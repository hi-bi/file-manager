import { access, appendFile, constants, readdir, rename, rm } from 'node:fs/promises';
import { dirname, normalize, sep } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';

const failedMessage = "Operation failed";

export const rmFile = async (path, srcFile) => {
    let srcPath;

    if (srcFile.startsWith(sep) || srcFile.search('/[:]/') > 0) {
        srcPath = normalize(srcFile);
    } else {
        srcPath = normalize( path + sep + srcFile);
    }

    try {

        await rm(srcPath);
        return srcPath;
    
    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return srcPath;
    }
}

export const mvFile = async (path, srcFile, dstFile) => {
    let srcPath;
    let dstPath;

    if (srcFile.startsWith(sep) || srcFile.search('/[:]/') > 0) {
        srcPath = normalize(srcFile);
    } else {
        srcPath = normalize( path + sep + srcFile);
    }

    if (dstFile.startsWith(sep) || dstFile.search('/[:]/') > 0) {
        dstPath = normalize(dstFile);
    } else {
        dstPath = normalize( path + sep + dstFile);
    }

    try {
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(dstPath);

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                writeStream.write(data);
            }
        });

        readStream.on('end', () => {

            rm(srcPath);
            return srcPath;
        });

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return path;
    }
}

export const cpFile = async (path, srcFile, dstFile) => {
    let srcPath;
    let dstPath;

    if (srcFile.startsWith(sep) || srcFile.search('/[:]/') > 0) {
        srcPath = normalize(srcFile);
    } else {
        srcPath = normalize( path + sep + srcFile);
    }

    if (dstFile.startsWith(sep) || dstFile.search('/[:]/') > 0) {
        dstPath = normalize(dstFile);
    } else {
        dstPath = normalize( path + sep + dstFile);
    }

    try {
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(dstPath);

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                writeStream.write(data);
            }
        });

        readStream.on('end', () => {
            return srcPath; 
        });

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
        return path;
    }
}

export async function rnFile (path, oldFile, newFile) {
    let oldPath;
    let newPath;

    if (oldFile.startsWith(sep) || oldFile.search('/[:]/') > 0) {
        oldPath = normalize(oldFile);
    } else {
        oldPath = normalize( path + sep + oldFile);
    }
    
    if (newFile.startsWith(sep) || newFile.search('/[:]/') > 0) {
        newPath = normalize(newFile);
    } else {
        newPath = normalize( path + sep + newFile);
    }

    try {
        await rename(oldPath, newPath);

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
    }
}

export async function addFile (path, addArg) {
    let pathToAdd;

    if (addArg.startsWith(sep) || addArg.search('/[:]/') > 0) {
        pathToAdd = normalize(addArg);
    } else {
        pathToAdd = normalize( path + sep + addArg);
    }
    
    try {
        const options = {
            encoding: 'utf8',
            flag: 'ax'
        }
        await appendFile(pathToAdd, '', options);

    } catch (error) {
        console.log(failedMessage + ': ' + error.message);
    }
}

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
