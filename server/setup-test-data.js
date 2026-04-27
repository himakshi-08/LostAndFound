const mongoose = require('mongoose');
const Item = require('./models/Item');
const User = require('./models/User');
require('dotenv').config();

const run = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        // Delete existing items and users
        await Item.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Cleared existing database (Items & Users)');

        // Create Users
        const finderUser = new User({
            name: 'Finder',
            email: 'finder@srmap.edu.in',
            password: 'finder@1',
            studentId: 'AP2310000001',
            department: 'CSE',
            year: '3'
        });
        await finderUser.save();

        const loserUser = new User({
            name: 'Loser',
            email: 'loser@srmap.edu.in',
            password: 'loser@1',
            studentId: 'AP2310000002',
            department: 'ECE',
            year: '3'
        });
        await loserUser.save();

        console.log('\n✅ Created test users:');
        console.log('1. Email: finder@srmap.edu.in | Password: finder@1');
        console.log('2. Email: loser@srmap.edu.in  | Password: loser@1');

        // Create some items to start with
        const lostItem = new Item({
            title: 'Mixer',
            type: 'lost',
            category: 'Electronics',
            description: 'A mixer with butterfly company logo. Lost it around lab.',
            location: 'Lab CS-301',
            date: new Date(),
            color: 'White',
            status: 'active',
            user: loserUser._id
        });
        await lostItem.save();

        const foundItem = new Item({
            title: 'Mixer (White)',
            type: 'found',
            category: 'Electronics',
            description: 'Found a white mixer with butterfly logo.',
            location: 'Lab CS-301',
            date: new Date(),
            color: 'White',
            status: 'active',
            user: finderUser._id,
            verificationQuestions: [{
                question: 'What is written on the mixer?',
                answer: 'butterfly company'
            }]
        });
        await foundItem.save();

        console.log('\n✅ Created test items:');
        console.log('- [LOST] "Mixer" by Loser');
        console.log('- [FOUND] "Mixer (White)" by Finder (with verification question: "What is written on the mixer?", answer: "butterfly company")');
        
        console.log('\n✅ Test data setup complete. You can now login with either account to test.');

        process.exit(0);
    } catch (err) {
        console.error('Error during setup:', err.message);
        process.exit(1);
    }
};

run();
