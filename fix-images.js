const fs = require('fs');
const files = ['server/seed.js', 'server/setup-test-data.js'];
files.forEach(f => {
    if(fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/https:\/\/images\.unsplash\.com\/[^'"]+/g, 'https://placehold.co/800x600/31343C/FFFFFF?text=Item');
        fs.writeFileSync(f, content);
        console.log('Fixed', f);
    }
});
