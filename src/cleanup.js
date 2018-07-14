// check existing files to see if they're in S3.
// Upload files that aren't there
import 'babel-polyfill';
import dotenv from 'dotenv';
import del from 'del';
import fs from 'fs';
import path from 'path';
import { uploadToS3, checkIfFileExistsOnS3 } from './upload';

dotenv.config();

const PATH_TO_ARCHIVES = path.resolve(__dirname, '..', '..', '..', 'Archives');

const deleteFiles = async (p, filename) => {
    const opts = { force: true };
    // delete the files in the directory and not the directory itself
    const dir = path.resolve(p, '*');
    const pathsToDelete = [
        dir,
        `!${filename}`, // do not delete the file that's being written currently
    ];

    try {
        const paths = await del(pathsToDelete, opts);
        console.log('Paths deleted: ', paths);
    } catch (e) {
        // consider reporting this
        console.log('ERROR FROM deleting files: ', e);
    }

    process.exit(0);
};

const main = async () => {
    try {
        // read filenames from Archive dir
        const filenames = fs.readdirSync(PATH_TO_ARCHIVES);
        // we want to ignore the most recent file because the uploader will handle it
        const fileToIgnore = filenames.pop();
        // async iterate and check whether the file exists on S3
        for await (const file of filenames) {
            const fileExists = await checkIfFileExistsOnS3(file);

            if (!fileExists) {
                // uploadToS3
                await uploadToS3(`${PATH_TO_ARCHIVES}/${file}`);
            }
        }
        // clear out the directory
        deleteFiles(PATH_TO_ARCHIVES, fileToIgnore);
    } catch (e) {
        console.log('Something went wrong...', e);
    }
};

main();
