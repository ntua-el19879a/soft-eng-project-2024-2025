const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const { jwtSecret, jwtExpiration, jwtRefreshExpiration, jwtRefreshSecret } = require('../config/jwtConfig');
const { mongoUri } = require('../config/dbConfig');


const dbName = 'toll-interop-db';
const usersCollection = 'users';
const refreshTokensCollection = 'refreshTokens';

exports.login = async (username, password) => {
    let client;
    try {
        client = new MongoClient(mongoUri);
        await client.connect();

        const db = client.db(dbName);
        const user = await db.collection(usersCollection).findOne({ username });

        if (!user) {
            throw { status: 401, message: 'Invalid username' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw { status: 401, message: 'Invalid password' };
        }

        // Generate tokens
        const accessToken = jwt.sign({ username, role: user.role }, jwtSecret, { expiresIn: jwtExpiration });
        const refreshToken = jwt.sign({ username }, jwtRefreshSecret, { expiresIn: jwtRefreshExpiration });

        // Store refresh token in DB
        await db.collection(refreshTokensCollection).insertOne({ token: refreshToken, username });

        return { accessToken, refreshToken, role: user.role };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Login failed' };
    } finally {
        if (client) await client.close();
    }
};

// Refresh Token Function
exports.refreshToken = async (token) => {
    let client;
    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);

        const storedToken = await db.collection(refreshTokensCollection).findOne({ token });
        if (!storedToken) {
            throw { status: 403, message: 'Invalid refresh token' };
        }

        const decoded = jwt.verify(token, jwtRefreshSecret);
        const newAccessToken = jwt.sign({ username: decoded.username }, jwtSecret, { expiresIn: jwtExpiration });

        return { accessToken: newAccessToken };
    } catch (error) {
        throw { status: 403, message: 'Invalid or expired refresh token' };
    } finally {
        if (client) await client.close();
    }
};

// Logout Function
exports.logout = async (refreshToken) => {
    let client;
    try {

        if (!refreshToken) {
            throw { status: 400, message: 'Refresh token required' };
        }

        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);

        // Check if refresh token exists
        const tokenExists = await db.collection(refreshTokensCollection).findOne({ token: refreshToken });
        if (!tokenExists) {
            throw { status: 403, message: 'Invalid refresh token' };
        }

        // Remove refresh token from DB
        await db.collection(refreshTokensCollection).deleteOne({ token: refreshToken });

        return { message: 'Logout successful' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Logout failed' };
    } finally {
        if (client) await client.close();
    }
};
