import fs from 'fs';
import http from 'http';
import path from 'path';
import chokidar from 'chokidar';
import { uploadToS3, checkIfFileExistsOnS3 } from './upload';
import { getFileNameFromPath } from './utils/string-helpers';
import execute from './utils/promise-helpers';
// path of the directory to watch relative to project root
const WATCH_DIR = path.join(__dirname, '..', '..', '..', 'Archives');
console.log('WATCH_DIR', WATCH_DIR);

// returns the previous file given a starting file. If none is found, it returns the original file.
const getPreviousFile = (cur, dirname) => {
    const result = fs.readdirSync(dirname);
    const fileName = getFileNameFromPath(cur);
    const currentIndex = result.indexOf(fileName);

    if (currentIndex < 0) {
        return cur;
    }

    const prevIndex = currentIndex - 1;
    const previousFile = result[prevIndex];

    return previousFile.startsWith('.') ? cur : previousFile;
};
// returning true means "file in use"
const lsofCheck = async ({ filepath }) => {
    const cmd = `lsof ${filepath}`;

    try {
        const result = await execute(cmd);

        if (result.length) {
            console.log('file owned');
            return true;
        }

        return false;
    } catch (e) {
        console.log('lsof no result', e);
    }
};
 // filepath = test/files/rec_20170512-21.mp3
const checkFile = async (filepath = __dirname) => {
    try {
        const result = await lsofCheck({ filepath });

        if (!result) {
            // no one owns the file. See if it's on S3
            const exists = await checkIfFileExistsOnS3(filepath);
            // if so, do nothing
            if (exists) {
                return;
            }
            // if not, uploadToS3
            return uploadToS3(filepath);
        }
        // the file is owned, so check nearby files
        const previousFileName = getPreviousFile(filepath, WATCH_DIR);

        if (previousFileName === filepath) {
            // means we've hit the last file to check
            return;
        }

        const previousFileFullPath = path.join(WATCH_DIR, previousFileName);

        return checkFile(previousFileFullPath);
    } catch (e) {
        console.log('lsofCheck went wrong', e);
    }
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

export { checkFile, getPreviousFile, createNodeServer };
