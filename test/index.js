import test from 'ava';
import { openSync, appendFileSync, unlinkSync } from 'fs';
import { checkFile } from '../src/';
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

test('ensure checkFile returns undefined when called with a closed file', (t) => {
    const result = checkFile('tmp.mp3');

    t.is(result, undefined);
});

test('ensure checkFile returns a function when called with an open file', (t) => {
    openSync('tmp.mp3', 'r');

    const result = checkFile('tmp.mp3');

    t.is(result, undefined);
});
