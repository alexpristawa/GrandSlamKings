const express = require('express'); // Import Express framework
const { MongoClient } = require('mongodb'); // MongoDB driver
const { ObjectId } = require('mongodb'); // MongoDB ObjectId helper
require('dotenv').config(); // Load environment variables from .env file
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// Function to hash a password
async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password); // Hash the password with Argon2
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}

const app = express(); // Create an Express app
const port = 3000; // Define the server port
const allCharacters = require('./items/characters.json');

// Middleware to parse incoming JSON data
app.use(express.json());

// MongoDB connection setup
const uri = process.env.MONGO_URI; // MongoDB URI from .env
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect(); // Connect to MongoDB
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if the connection fails
    }
}
connectDB();

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    // 1. Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    // 2. If no token is provided, block the request
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 3. Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
        req.user = decoded; // Attach decoded data to the request object
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        // 4. If verification fails, block the request
        res.status(403).json({ error: "Invalid or expired token." });
    }
}

// POST route: Add a new user
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body; // Extract name and email from request body

    try {
        const db = client.db('grandSlamKings'); // Select your database
        const usersCollection = db.collection('users'); // Select the users collection

        if(!name || !email || !password) {
            return res.status(400).json({ error: "Invalid name or email"});
        }

        const hashedPassword = await hashPassword(password); // Hash the password

        const existingUser = await usersCollection.findOne({ email: email }); // Check if user already exists
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists!' }); // Respond with conflict error
        }

        // Create a new user document
        const newUser = {
            name,
            email,
            password: hashedPassword,
            coins: 1000000,
            characters: []
        };

        const result = await usersCollection.insertOne(newUser); // Insert the new user
        res.status(201).json({ message: 'User created!', userId: result.insertedId }); // Respond with success
    } catch (error) {
        console.error('Error creating user:', error); // Log the error
        res.status(500).json({ error: 'Failed to create user.' }); // Respond with error
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = client.db('grandSlamKings');
        const usersCollection = db.collection('users');

        // Authenticate the user (validate email and password)
        const user = await usersCollection.findOne({ email });
        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        // Store the refresh token in the database
        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { refreshToken } }
        );

        res.status(200).json({
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Failed to log in." });
    }
});

app.post('/auth/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required." });
    }

    try {
        const db = client.db('grandSlamKings');
        const usersCollection = db.collection('users');

        // Find the user with the provided refresh token
        const user = await usersCollection.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ error: "Invalid refresh token." });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ error: "Invalid or expired refresh token." });
    }
});

app.post('/auth/logout', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required." });
    }

    try {
        const db = client.db('grandSlamKings');
        const usersCollection = db.collection('users');

        // Find the user with the provided refresh token
        const user = await usersCollection.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ error: "Invalid refresh token." });
        }

        // Remove the refresh token
        await usersCollection.updateOne(
            { _id: user._id },
            { $unset: { refreshToken: "" } }
        );

        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: "Failed to log out." });
    }
});

app.put('/users/batch', authenticateToken, async (req, res) => {
    const { batch } = req.body; // No need to extract userId from the route

    try {
        const db = client.db('grandSlamKings');
        const usersCollection = db.collection('users');

        // Fetch the user using the userId from the decoded JWT
        const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
        if (!user) {
            return res.status(404).json({ error: "Failed to fetch user." });
        }

        // Validate batch
        if (!Array.isArray(batch)) {
            return res.status(400).json({ error: "Batch did not exist or was in the wrong format." });
        }

        let hasUpdated = false;

        // Process batch
        for (const obj of batch) {
            if (obj.action === 'buyWithCoins') {
                if (obj.type === 'unlockPlayer') {
                    const playerToUnlock = obj.content.name;
                    if (!playerToUnlock) {
                        return res.status(400).json({ error: "Invalid player to unlock specified." });
                    }

                    const character = allCharacters.characters.find(c => c.name === playerToUnlock);
                    if (!character) {
                        return res.status(404).json({ error: "Character does not exist!" });
                    }

                    if (user.coins < character.cost) {
                        return res.status(400).json({ error: "Insufficient coins!" });
                    }

                    if (user.characters.some(c => c.name === character.name)) {
                        return res.status(409).json({ error: "Character already owned!" });
                    }

                    // Update user characters and deduct coins
                    user.characters.push({
                        name: character.name,
                        speed: character.stats.speed.min,
                        power: character.stats.power.min,
                        accuracy: character.stats.accuracy.min,
                        ability: character.stats.ability
                    });
                    user.coins -= character.cost;
                    hasUpdated = true;
                } else if (obj.type === 'upgradePlayerStat') {
                    const characterToUpgrade = obj.content.name;
                    if(!characterToUpgrade) {
                        return res.status(400).json({ error: "Invalid user"});
                    }

                    const character = allCharacters.characters.find(c => c.name == characterToUpgrade);
                    if(!character) {
                        return res.status(404).json({ error: "Character does not exist!"});
                    }

                    let stat = obj.content.stat;
                    if(!stat) {
                        return res.status(404).json({ error: "Stat does not exist!"});
                    }

                    let usersCharacter = user.characters.find(c => c.name == characterToUpgrade);
                    if(!usersCharacter) {
                        return res.status(404).json({ error: "User does not own character!"});
                    }

                    if(usersCharacter[stat] >= character.stats[stat].max) {
                        return res.status(400).json({ error: "Stat already maxed out!"});
                    }

                    let cost = character.stats[stat].cost * character.stats[stat].multiplier**((usersCharacter[stat]-character.stats[stat].min)/0.05);
                    if(user.coins < cost) {
                        return res.status(400).json({ error: "Insufficient coins!"});
                    }
                    
                    user.coins -= cost;
                    usersCharacter[stat] += 0.05;
                    hasUpdated = true;
                }
            } else if (obj.action === 'incrementCoins') {
                const coins = obj.content.coins;
                if (!coins) {
                    return res.status(400).json({ error: "Invalid coins" });
                }

                user.coins += coins;
                hasUpdated = true;
            }
        }

        // If updates occurred, persist changes
        if (hasUpdated) {
            await usersCollection.updateOne(
                { _id: new ObjectId(req.user.userId) },
                { $set: { characters: user.characters, coins: user.coins } }
            );
            return res.status(200).json({
                message: "Batch processed successfully!",
                remainingCoins: user.coins,
                characters: user.characters
            });
        }

        // If no updates were made
        return res.status(400).json({ error: "No valid updates were made." });
    } catch (error) {
        console.error('Error processing batch:', error);
        return res.status(500).json({ error: "Failed to process batch." });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});