import { createReadStream } from 'fs';
import path from 'path';
import Promise from 'bluebird';
import AWS from 'aws-sdk';
import { sanitizeFileName, getFileNameFromPath } from './utils/string-helpers';
// use bluebird promises for aws-sdk
AWS.config.setPromisesDependency(Promise);
AWS.config.httpOptions.timeout = 300000;
// ensure AWS SDK API version consistency
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const params = {
    Bucket: process.env.BUCKET_NAME
};
// assumes that input fileName is of the form: rec_20170430-19.mp3
const generateS3BucketPath = (fileName) => {
    // parse filename to generate path
    const fileNameFromPath = getFileNameFromPath(fileName);
    const sanitizedFileName = sanitizeFileName(fileNameFromPath);
    const year = sanitizedFileName.substring(0, 4);
    const month = sanitizedFileName.substring(4, 6);
    const day = sanitizedFileName.substring(6, 8);

    return path.join(year, month, day, fileNameFromPath);
};

const checkIfFileExistsOnS3 = async (fileName) => {
    const bucketPath = generateS3BucketPath(fileName);

    console.log('CHECK PARAMS', params)
    try {
        const checkParams = {
            ...params,
            Key: bucketPath
        };
        const result = await s3.headObject(checkParams).promise();

        if (result.ContentLength) {
            return true;
        }

        return false;
    } catch (e) {
        if (e.code === 'NotFound') {
            // file is not in S3 bucket
            console.log('Error not found: not on S3');
            return false;
        }
        // An actual error occurred
        throw e;
    }
};

const uploadToS3 = async (file) => {
    const bucketPath = generateS3BucketPath(file);
    // file = path to file on disk
    const fileStream = createReadStream(file);

    fileStream.on('error', (err) => {
        console.log('createReadStream: ', err);
    });

    const uploadParams = {
        ...params,
        Key: bucketPath,
        Body: fileStream,
        ACL: 'public-read',
        ContentType: 'audio/mpeg'
    };

    try {
        await s3.upload(uploadParams).promise();
    } catch (e) {
        // retry upload?
        console.log('uploadToS3: ', e);
    }
};

export { uploadToS3, checkIfFileExistsOnS3 };
