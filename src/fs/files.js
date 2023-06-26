import { access, appendFile, constants, readdir, mkdir, rename, rm } from 'node:fs/promises';
import { dirname, normalize, sep } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
const { createHash } = await import('node:crypto');
import { pipeline } from 'node:stream';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

const failedMessage = "Operation failed";

const checkPathReadAccess = async (path) => {
    try {
        await access(path, constants.R_OK)
        return true;
    } catch (error) {
        return false;        
    }
}

const checkPathWriteAccess = async (path) => {
    try {
        await access(path, constants.W_OK)
        return true;
    } catch (error) {
        return false;        
    }
}

const setPath = (path, adPath) => {
    
    let resultPath;

    if (adPath.startsWith(sep) || adPath.search('/[:]/') > 0) {
        resultPath = normalize(adPath);
    } else {
        resultPath = normalize( path + sep + adPath);
    }
    return resultPath;
}

export const unzipFile = async (path, srcFile, dstFile) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathReadAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        const dstPath = setPath(path, dstFile);

        const zipStream = createReadStream(srcPath);
        const writeStream = createWriteStream(dstPath);
        const brotliObj = createBrotliDecompress();

        pipeline(zipStream, brotliObj, writeStream, 
            (err) => {
                if (err) {
                    console.error(failedMessage);
                    return false;
                }
            } 
        );

        return true;
    } catch (error) {
        console.error(failedMessage);
        return false;
    }
}

export const zipFile = async (path, srcFile, dstFile) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathReadAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        const dstPath = setPath(path, dstFile);

        const readStream = createReadStream(srcPath);
        const zipStream = createWriteStream(dstPath);
        const brotliObj = createBrotliCompress();

        pipeline(readStream, brotliObj, zipStream, 
            (err) => {
                if (err) {
                    console.error(failedMessage);
                    return false;
                }
            } 
        );

        return true;
    } catch (error) {
        console.error(failedMessage);
        return false;
    }
}

export const hshFile = async (path, srcFile) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathWriteAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        const hash = createHash('sha256');

        const readStream = createReadStream(srcPath) ;

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data)
              hash.update(data);
            else {
              console.log(`${hash.digest('hex')}`);
            }
        });
        return true;
    
    } catch (error) {
        console.error(failedMessage);
        return false;
    }
}

export const rmFile = async (path, srcFile) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathWriteAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        await rm(srcPath);
        return srcPath;
    
    } catch (error) {
        console.error(failedMessage);
        return srcPath;
    }
}

export const mvFile = async (path, srcFile, dstDir) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathReadAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        const dstPath = setPath(path, dstDir);
        const existDir = await checkPathWriteAccess(dstPath);
        if (!existDir) {
            await mkdir(dstPath);
        }
        
        const dstFile = setPath(dstPath, srcFile);

        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(dstFile);

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                writeStream.write(data);
            }
        });

        readStream.on('end', () => {
            rm(srcPath);
            return dstPath;
        });

    } catch (error) {
        console.error(failedMessage);
        return path;
    }
}

export const cpFile = async (path, srcFile, dstDir) => {

    try {
        const srcPath = setPath(path, srcFile);
        const result = await checkPathReadAccess(srcPath);
        if (!result) {
            console.error(failedMessage);
            return path;
        }

        const dstPath = setPath(path, dstDir);
        const existDir = await checkPathWriteAccess(dstPath);
        if (!existDir) {
            await mkdir(dstPath);
        }
        
        const dstFile = setPath(dstPath, srcFile);

        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(dstFile);

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                writeStream.write(data);
            }
        });

        readStream.on('end', () => {
            return dstPath; 
        });

    } catch (error) {
        console.error(failedMessage);
        return path;
    }
}

export async function rnFile (path, oldFile, newFile) {

    try {
        const oldPath = setPath(path, oldFile);
        const result = await checkPathReadAccess(oldPath);
        if (!result) {
            console.error(failedMessage);
            return false;
        }

        const newPath = setPath(path, newFile);

        await rename(oldPath, newPath);
        return true;

    } catch (error) {
        console.error(failedMessage);
        return false;
    }
}

export async function addFile (path, addArg) {
    
    try {
        const result = await checkPathWriteAccess(path);
        if (!result) {
            console.error(failedMessage);
            return false;
        }

        const pathToAdd = setPath(path, addArg);

        const options = {
            encoding: 'utf8',
            flag: 'ax'
        }
        await appendFile(pathToAdd, '', options);
        return true;

    } catch (error) {
        console.error(failedMessage);
        return false;
    }
}

export async function catFile (path, catArg) {
    
    try {
        const pathToCat = setPath(path, catArg);

        const result = await checkPathReadAccess(pathToCat);
        if (!result) {
            console.error(failedMessage);
            return false;
        }

        const readStream = createReadStream(pathToCat, 'utf-8');

        readStream.on('readable', () => {
            const data = readStream.read();
            if (data) {
                process.stdout.write(data);
                process.stdout.write('\n');
            }
        });

    } catch (error) {
        console.error(failedMessage);
    }
}

export const cdDir = async (path, cdPath) => {
    try {

        const newDir = setPath(path, cdPath);

        const result = await checkPathReadAccess(newDir);
        if (result) {
            return newDir;
        } else {
            console.error(failedMessage);
            return path;
        }
            
    } catch (error) {
        console.error(failedMessage);
        return path;
    }

}

export const lsDir = async (path) => {

    try {
        const outputArray = new Array;

        const result = await checkPathReadAccess(path);
        if (!result) {
            console.error(failedMessage);
            return false;
        } 

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
        return true;

    } catch (error) {
        console.error(failedMessage);
        return false;
    }

}


export const upDir = (path) => {
    
    return dirname(path);
}
