import fs from 'fs';
import http from 'http';
import path from 'path';
import { exec } from 'child_process';
import chokidar from 'chokidar';
import { uploadToS3, checkIfFileExistsOnS3 } from './upload';
import { getFileNameFromPath } from './utils/string-helpers';
// path of the directory to watch relative to project root
const WATCH_DIR = path.join('..', 'Archives');

const getNextFile = (cur, dirname) => {
    const result = fs.readdirSync(dirname);
    const currentIndex = result.indexOf(cur);

    if (currentIndex < 0) {
        return null;
    }

    const prevIndex = currentIndex - 1;

    return result[prevIndex];
};
 // filepath = test/files/rec_20170512-21.mp3
const checkFile = (filepath = __dirname) => {
    // e.g. /Users/marciaga/dev/kffp-archive/test/files/rec_20170512-20.mp3
    const fullPathWithCurrentFile = path.join(__dirname, '..', filepath);
    // e.g. rec_20170512-23.mp3
    const currentlyAddedFileName = getFileNameFromPath(filepath);
    const cmd = `lsof ${fullPathWithCurrentFile}`;
    const fullDirPath = path.join(__dirname, '..', WATCH_DIR);

    // first see whether the most recent file is in use using lsof.
    exec(cmd, async (err, stdout) => {
        if (stdout.length) {
            // if it is, find the next most recent file to see whether it is already on S3
            const nextFileName = getNextFile(currentlyAddedFileName, fullDirPath);
            // file doesn't exist in the directory
            if (!nextFileName) {
                return;
            }

            try {
                const exists = await checkIfFileExistsOnS3(nextFileName);
                // if so, do nothing
                if (exists) {
                    return;
                }
                // if not, uploadToS3()
                return uploadToS3(`${fullDirPath}/${nextFileName}`);
            } catch (e) {
                console.log('checkIfFileExistsOnS3', e);
            }
        }

        try {
            // if the file is not open and not on S3, try streaming it up to S3.
            const exists = await checkIfFileExistsOnS3(currentlyAddedFileName);

            if (exists) {
                return;
            }
            // if not, uploadToS3()
            return uploadToS3(`${fullDirPath}/${currentlyAddedFileName}`);
        } catch (ex) {
            console.log('checkIfFileExistsOnS3', ex);
        }
    });
};

const requestHandler = (request, response) => response.end('nothing to see here');

const createNodeServer = (port) => {
    const server = http.createServer(requestHandler);

    server.listen(port, (err) => {
        if (err) {
            throw err;
        }

        console.log(`Server is listening on port ${port}`);

        chokidar.watch(WATCH_DIR, {
            ignored: /[/\\]\./,
            ignoreInitial: true
        })
        .on('add', filepath => checkFile(filepath));
    });
};

export { checkFile, getNextFile, createNodeServer };
