const mongoose = require('mongoose');
const Item = require('./models/Item');
const User = require('./models/User');
require('dotenv').config();

const lostItems = [
    {
        title: 'Sony WH-1000XM4 Headphones',
        type: 'lost',
        category: 'Electronics',
        description: 'Black Sony noise-cancelling headphones with a crack on the right ear cup. Has a small red sticker on the headband.',
        location: 'Library 2nd Floor',
        date: new Date('2026-03-15'),
        color: 'Black',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80']
    },
    {
        title: 'Blue SRM Student ID Card',
        type: 'lost',
        category: 'ID Cards',
        description: 'SRM University student ID card for Ravi Kumar, AP2310011596. It was in a transparent sleeve with a blue lanyard.',
        location: 'Block A Canteen',
        date: new Date('2026-03-16'),
        color: 'Blue',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80']
    },
    {
        title: 'HP Notebook 15 Laptop Bag',
        type: 'lost',
        category: 'Wallets & Purses',
        description: 'Navy blue HP laptop bag with a white HP logo. Contains a charger and some notes inside. Has a torn zipper on the side pocket.',
        location: 'Lab CS-301',
        date: new Date('2026-03-16'),
        color: 'Navy Blue',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80']
    },
    {
        title: 'Stainless Steel Water Bottle',
        type: 'lost',
        category: 'Water Bottles',
        description: 'Silver Puma water bottle, 750ml. Has a green rubber ring at the base and HIMAKSHI written in marker on the side.',
        location: 'Gym / Sports Block',
        date: new Date('2026-03-17'),
        color: 'Silver',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80']
    },
    {
        title: 'Engineering Mathematics Textbook',
        type: 'lost',
        category: 'Books & Stationery',
        description: 'Engineering Mathematics by R.K. Jain, 3rd edition. Has yellow highlighter marks throughout. Name written on first page.',
        location: 'Reading Hall, Main Library',
        date: new Date('2026-03-17'),
        color: 'Red',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80']
    }
];

const run = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        // Find first user to assign items to
        const user = await User.findOne();
        if (!user) {
            console.log('No users found! Please register an account first, then run this seed.');
            process.exit(1);
        }

        console.log(`Assigning items to user: ${user.name} (${user.email})`);

        // Remove old seeded items
        await Item.deleteMany({ status: 'active', title: { $in: lostItems.map(i => i.title) } });

        // Insert new items
        const toInsert = lostItems.map(item => ({ ...item, user: user._id }));
        const inserted = await Item.insertMany(toInsert);
        
        console.log(`\n✅ Successfully seeded ${inserted.length} lost items:\n`);
        inserted.forEach(item => console.log(`  - [${item.type.toUpperCase()}] ${item.title} @ ${item.location}`));
        console.log('\n🧠 AI Matching Test Guide:');
        console.log('1. Login to the app and go to Activity Feed to see these items');
        console.log('2. Click "Report Found" and enter a similar description');
        console.log('3. After submission you will be sent to the Matches page');
        console.log('4. Check the % score — higher = better AI match!\n');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
};

run();
