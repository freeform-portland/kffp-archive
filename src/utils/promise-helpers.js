import { exec } from 'child_process';
import Promise from 'bluebird';

const doExecute = (resolve, reject, command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return reject(stderr);
        }

        resolve(stdout);
    });
};

const execute = command => new Promise((resolve, reject) =>
    doExecute(resolve, reject, command)
);

export default execute;
