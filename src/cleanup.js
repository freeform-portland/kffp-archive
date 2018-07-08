// check existing files to see if they're in S3.
// Upload files that aren't there
import 'babel-polyfill';
import dotenv from 'dotenv';
import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';
import { uploadToS3, checkIfFileExistsOnS3 } from './upload';

dotenv.config();

const PATH_TO_ARCHIVES = path.resolve(__dirname, '..', '..', '..', 'Archives');

// delete all files in directory
const deleteFiles = (path) => {
    rimraf(path, {}, (err) => {
        if (err) {
            // consider reporting this
            console.log('ERROR FROM rimfaf lib: ', err);
        }

        process.exit(0);
    });
};

const main = async () => {
    try {
        // read filenames from Archive dir
        const filenames = fs.readdirSync(PATH_TO_ARCHIVES);
        // we want to ignore the most recent file because the uploader will handle it
        const constrainedFiles = filenames.slice(0, -1);

        // async iterate and check whether the file exists on S3
        for await (const file of constrainedFiles) {
            const fileExists = await checkIfFileExistsOnS3(file);

            if (!fileExists) {
                // uploadToS3
                await uploadToS3(`${PATH_TO_ARCHIVES}/${file}`);
            }
        }

        // clear out the directory
        deleteFiles(PATH_TO_ARCHIVES);
    } catch (e) {
        console.log('Something went wrong...', e);
    }
};

main();
