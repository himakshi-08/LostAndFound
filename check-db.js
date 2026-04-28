require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Item = require('./server/models/Item');
        const count = await Item.countDocuments();
        console.log('Total items in DB:', count);
        
        if (count > 50) {
            console.log('Too many items. Deleting and reseeding...');
            await mongoose.connection.db.dropDatabase();
            console.log('Database dropped.');
            
            // Re-seed by requiring the setup-test-data script logic or we just leave it dropped and let setup-test-data.js run later
        }
        
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
checkDb();
