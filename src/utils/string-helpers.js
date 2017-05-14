const getFileNameFromPath = (filepath) => {
    if (!filepath) {
        return '';
    }

    const parts = filepath.split('/');

    return parts.length > 1 ? parts.pop() : '';
};
/**
 * strips out everything except the date and time
 * @param <str> name - filename, e.g. rec_20170430-19.mp3
 * @returns <str> e.g. 2017043019
*/
const sanitizeFileName = (name) => {
    if (!name) {
        return '';
    }

    const re = /[a-z]|_|-|.mp3/g;

    return name.replace(re, '');
};
/**
 * returns a numeric representation of the date from a file name
 * @param <str> fileName: rec_20170430-19.mp3
 * @returns <num> 2017043019
*/
const transformFileName = (fileName) => {
    const dateStr = sanitizeFileName(fileName);

    return parseInt(dateStr, 10);
};

export { getFileNameFromPath, sanitizeFileName, transformFileName };
