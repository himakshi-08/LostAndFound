const fs = require('fs');
const path = require('path');

function replaceStorage(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            replaceStorage(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('localStorage')) {
                content = content.replace(/localStorage/g, 'sessionStorage');
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    });
}

replaceStorage(path.join(__dirname, 'client/src'));
console.log('Session storage fix applied!');
