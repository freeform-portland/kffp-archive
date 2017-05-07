// import fs from 'fs';
import { exec } from 'child_process';

const naiveTestFunc = (path) => {
    const cmd = `lsof ${path}`;
    exec(cmd, (err, stdout, stderr) => {
        console.log(stdout);

        if (!stdout.length) {
            console.log(path, 'NOT IN USE');
        } else {
            console.log(path, 'IN USE. Ignoring...');
            console.log(stdout);
            console.log(stderr);
        }
    });
};

const path = `${__dirname}/index.html`;
naiveTestFunc(path);
