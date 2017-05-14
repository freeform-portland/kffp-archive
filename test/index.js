import test from 'ava';
import { appendFileSync, unlinkSync } from 'fs';
import {
    getFileNameFromPath,
    transformFileName,
    sanitizeFileName
} from '../src/utils/string-helpers';

require('babel-polyfill');

test.before(() => {
    appendFileSync('tmp.mp3');
});

test.after.always(() => {
    unlinkSync('tmp.mp3');
});

test('getFileNameFromPath should return the correct file name', (t) => {
    const fileName = 'file.mp3';
    const path = `dirname/${fileName}`;
    const result = getFileNameFromPath(path);

    t.is(result, fileName);
});

test('transformFileName should return the transformed file name', (t) => {
    const fileName = 'rec_20170430-19.mp3';
    const result = transformFileName(fileName);

    t.is(result, 2017043019);
});

test('sanitizeFileName should return the sanitized file name', (t) => {
    const fileName = 'rec_20170430-19.mp3';
    const result = sanitizeFileName(fileName);

    t.is(result, '2017043019');
});
