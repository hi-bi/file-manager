import { argv } from 'node:process';

let userName = 'anonymous';

const parseUserName = () => {
    const argUserName = argv.splice(2).filter(item => item.startsWith('--username=')).toString().replace('--username=', '');

    if (argUserName) {
        userName = argUserName;
    };
};

parseUserName();

export {
    userName
}