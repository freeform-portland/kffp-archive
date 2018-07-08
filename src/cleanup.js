// check existing files to see if they're in S3.
// Upload files that aren't there
import 'babel-polyfill';
import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';
import { uploadToS3, checkIfFileExistsOnS3 } from './upload';

const PATH_TO_ARCHIVES = path.resolve(__dirname, '..', '..', 'Archives');

// delete all files in directory
const deleteFiles = (path) => {
    rimraf(path, {}, (err) => {
        if (err) {
            // consider reporting this
            console.log('ERROR FROM RIMRAF', err);
        }

        process.exit(0);
    });
};

const main = async () => {
    try {
        console.log('PATH TO ARCHIVES', PATH_TO_ARCHIVES);
        // read filenames from Archive dir
        const filenames = fs.readdirSync(PATH_TO_ARCHIVES);

        // async iterate and check whether the file exists on S3
        for await (const file of filenames) {
            const fileExists = checkIfFileExistsOnS3(file);
            console.log('FILE EXISTS BOOLEAN', fileExists);
            console.log('FOR FILENAME', file);

            if (!fileExists) {
                // uploadToS3
                uploadToS3(file);
            }
        }

        // clear out the directory
        console.log('GOING TO DELETE ALL THE FILES HAHAHA');
        // uncomment after testing
        // deleteFiles(PATH_TO_ARCHIVES);
    } catch (e) {
        console.log('Something went wrong...', e);
    }
};

main();
