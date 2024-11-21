import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;
const mongoURI = 'mongodb://localhost:27017/royalCo';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Backend API');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
