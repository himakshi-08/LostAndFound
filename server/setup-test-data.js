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

        const userNames = ['sofia', 'alex', 'rahul', 'priya', 'david', 'aisha'];
        const users = [];

        // Create Users
        for (let i = 0; i < userNames.length; i++) {
            const name = userNames[i];
            const user = new User({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                email: `${name}@srmap.edu.in`,
                password: `${name}@1`,
                studentId: `AP231000001${i}`,
                department: ['CSE', 'ECE', 'MECH', 'EEE'][i % 4],
                year: '3'
            });
            await user.save();
            users.push(user);
        }

        console.log('\n✅ Created test users:');
        users.forEach(u => console.log(`- Email: ${u.email} | Password: ${u.email.split('@')[0]}@1`));

        // Create Lost Items
        const lostItemsData = [
            {
                title: 'Apple AirPods Pro',
                type: 'lost',
                category: 'Electronics',
                description: 'Lost my white Apple AirPods Pro. The case has a small scratch on the back.',
                location: 'Library 2nd Floor',
                color: 'White',
                images: ['https://images.unsplash.com/photo-1606220588913-b3aecb4b2c15?q=80&w=800&auto=format&fit=crop'],
            },
            {
                title: 'Black Leather Wallet',
                type: 'lost',
                category: 'Wallets & Purses',
                description: 'A black leather wallet containing some cash, student ID, and a debit card.',
                location: 'Main Canteen',
                color: 'Black',
                images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop'],
            },
            {
                title: 'Milton Water Bottle',
                type: 'lost',
                category: 'Water Bottles',
                description: 'Blue Milton water bottle, 1 litre capacity. Left it near the basketball court.',
                location: 'Basketball Court',
                color: 'Blue',
                images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop'],
            },
            {
                title: 'Data Structures Textbook',
                type: 'lost',
                category: 'Books & Stationery',
                description: 'Data Structures and Algorithms in Java by Robert Lafore. Hardcover edition.',
                location: 'Lab CS-102',
                color: 'Blue',
                images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'],
            },
            {
                title: 'Casio Scientific Calculator',
                type: 'lost',
                category: 'Electronics',
                description: 'Grey Casio fx-991EX Classwiz scientific calculator. Has my initials written on the back with a marker.',
                location: 'Block A, Room 305',
                color: 'Grey',
                images: ['https://images.unsplash.com/photo-1611078728518-124b172a39a0?q=80&w=800&auto=format&fit=crop'],
            },
            {
                title: 'Fastrack Watch',
                type: 'lost',
                category: 'Others',
                description: 'Silver Fastrack analog watch with a black dial. Dropped it somewhere in the gym.',
                location: 'Gymnasium',
                color: 'Silver',
                images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop'],
            }
        ];

        console.log('\n✅ Created test LOST items:');
        for (let i = 0; i < lostItemsData.length; i++) {
            const itemData = lostItemsData[i];
            const item = new Item({
                ...itemData,
                date: new Date(),
                status: 'active',
                user: users[i]._id // assign each item to a different user
            });
            await item.save();
            console.log(`- [LOST] "${item.title}" reported by ${users[i].name}`);
        }
        
        console.log('\n✅ Test data setup complete. You can now login with any account, or create your own, to test finding these items.');

        process.exit(0);
    } catch (err) {
        console.error('Error during setup:', err.message);
        process.exit(1);
    }
};

run();
