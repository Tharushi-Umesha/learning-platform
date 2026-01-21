const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const gptRoutes = require('./routes/gpt');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');
        console.log(`Database Host: ${conn.connection.host}`);
    } catch (err) {
        console.error(' MongoDB connection error:', err.message);
        console.error('\n Possible fixes:');
        console.error('   1. Check your internet connection');
        console.error('   2. Verify MongoDB Atlas cluster is running');
        console.error('   3. Check if IP address is whitelisted in MongoDB Atlas');
        console.error('   4. Verify connection string in .env file\n');

    }
};

connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/gpt', gptRoutes);


app.get('/', (req, res) => {
    res.json({
        message: 'Learning Platform API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            enrollments: '/api/enrollments',
            gpt: '/api/gpt'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});