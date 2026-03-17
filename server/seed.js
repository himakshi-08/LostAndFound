const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
require('dotenv').config();

const users = [
    {
        name: 'Himakshi',
        email: 'himakshi_chadalavada@srmap.edu.in',
        password: 'password123',
        studentId: 'AP23110011596',
        department: 'CSE'
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul_sharma@srmap.edu.in',
        password: 'password123',
        studentId: 'AP23110011001',
        department: 'ECE'
    }
];

const items = [
    {
        type: 'lost',
        category: 'Electronics',
        title: 'Blue Sony Headphones',
        description: 'Lost my Sony WH-1000XM4 headphones near the library. They are blue and have a small scratch on the left ear cup.',
        date: new Date(),
        location: 'Main Library - 2nd Floor',
        color: 'Blue',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80']
    },
    {
        type: 'found',
        category: 'Accessories',
        title: 'Black Leather Wallet',
        description: 'Found a black leather wallet containing some ID cards (not SRM ID) and cash near the cafeteria.',
        date: new Date(),
        location: 'Cafeteria Block A',
        color: 'Black',
        images: ['https://images.unsplash.com/photo-1627123430985-71d464a21886?w=800&q=80']
    },
    {
        type: 'lost',
        category: 'Books',
        title: 'Calculus Textbook',
        description: 'Lost my Calculus: Early Transcendentals book. It has my name written on the first page.',
        date: new Date(),
        location: 'Academic Block 1 - Room 102',
        color: 'Green',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80']
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data (optional, but good for starting clean)
        // await User.deleteMany({});
        // await Item.deleteMany({});

        // Create Users (password will be hashed by pre-save hook)
        for (const u of users) {
             const existing = await User.findOne({ email: u.email });
             if (!existing) {
                 const newUser = new User(u);
                 await newUser.save();
                 console.log(`Created user: ${u.name}`);
             }
        }

        const userDocs = await User.find({});
        
        // Create Items
        for (const i of items) {
            const newItem = new Item({
                ...i,
                user: userDocs[Math.floor(Math.random() * userDocs.length)]._id
            });
            await newItem.save();
            console.log(`Created item: ${i.title}`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
