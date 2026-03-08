import { initDB, saveUser, findUserByEmail, findUserByUsername, setCurrentUser } from './localDb.js';

// Ensure DB is initialized
initDB();

export function register(fullname, username, email, password, confirmPassword) {
    if (!fullname || !username || !email || !password) {
        throw new Error("All fields are required.");
    }
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }
    if (findUserByEmail(email)) {
        throw new Error("Email is already registered.");
    }
    if (findUserByUsername(username)) {
        throw new Error("Username is already taken.");
    }

    // Simple UUID polyfill if crypto.randomUUID is not available
    const generateId = () => {
        return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    };

    const user = {
        id: generateId(),
        fullname,
        username,
        email,
        password, // In a real app we would hash this
        createdAt: new Date().toISOString()
    };

    saveUser(user);
    // Don't save password in session state
    setCurrentUser({ id: user.id, username: user.username, fullname: user.fullname, email: user.email });
    return user;
}

export function login(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
    }

    setCurrentUser({ id: user.id, username: user.username, fullname: user.fullname, email: user.email });
    return user;
}
