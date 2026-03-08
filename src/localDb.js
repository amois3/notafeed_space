// THE SPACE v2.0 — Local Database Layer

export function initDB() {
    if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
    if (!localStorage.getItem('posts')) localStorage.setItem('posts', JSON.stringify([]));
    if (!localStorage.getItem('likes')) localStorage.setItem('likes', JSON.stringify([]));
    if (!localStorage.getItem('comments')) localStorage.setItem('comments', JSON.stringify([]));
    if (!localStorage.getItem('saves')) localStorage.setItem('saves', JSON.stringify([]));
    if (!localStorage.getItem('follows')) localStorage.setItem('follows', JSON.stringify([]));
    if (!localStorage.getItem('collections')) localStorage.setItem('collections', JSON.stringify([]));
    if (!localStorage.getItem('notifications')) localStorage.setItem('notifications', JSON.stringify([]));
}

// ── Users ──
export function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

export function findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email);
}

export function findUserByUsername(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.username === username);
}

export function getUserById(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === id);
}

export function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

export function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
}

// ── Follows ──
export function followUser(followingId) {
    const user = getCurrentUser();
    if (!user) return;
    const follows = JSON.parse(localStorage.getItem('follows') || '[]');
    if (follows.some(f => f.followerId === user.id && f.followingId === followingId)) return;
    follows.push({ followerId: user.id, followingId });
    localStorage.setItem('follows', JSON.stringify(follows));
    addNotification(followingId, 'follow', null, user.id);
}

export function unfollowUser(followingId) {
    const user = getCurrentUser();
    if (!user) return;
    let follows = JSON.parse(localStorage.getItem('follows') || '[]');
    follows = follows.filter(f => !(f.followerId === user.id && f.followingId === followingId));
    localStorage.setItem('follows', JSON.stringify(follows));
}

export function isFollowing(followingId) {
    const user = getCurrentUser();
    if (!user) return false;
    const follows = JSON.parse(localStorage.getItem('follows') || '[]');
    return follows.some(f => f.followerId === user.id && f.followingId === followingId);
}

export function getFollowers(userId) {
    const follows = JSON.parse(localStorage.getItem('follows') || '[]');
    return follows.filter(f => f.followingId === userId);
}

export function getFollowing(userId) {
    const follows = JSON.parse(localStorage.getItem('follows') || '[]');
    return follows.filter(f => f.followerId === userId);
}

// ── Collections ──
export function createCollection(name, description = '') {
    const user = getCurrentUser();
    if (!user) return null;
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const collection = { id, userId: user.id, name, description, cardIds: [], createdAt: new Date().toISOString() };
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    collections.push(collection);
    localStorage.setItem('collections', JSON.stringify(collections));
    return collection;
}

export function getCollectionsByUser(userId) {
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    return collections.filter(c => c.userId === userId);
}

export function getCollectionById(id) {
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    return collections.find(c => c.id === id);
}

export function addToCollection(collectionId, cardId) {
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    const col = collections.find(c => c.id === collectionId);
    if (col && !col.cardIds.includes(cardId)) {
        col.cardIds.push(cardId);
        localStorage.setItem('collections', JSON.stringify(collections));
    }
}

export function removeFromCollection(collectionId, cardId) {
    const collections = JSON.parse(localStorage.getItem('collections') || '[]');
    const col = collections.find(c => c.id === collectionId);
    if (col) {
        col.cardIds = col.cardIds.filter(id => id !== cardId);
        localStorage.setItem('collections', JSON.stringify(collections));
    }
}

export function deleteCollection(collectionId) {
    let collections = JSON.parse(localStorage.getItem('collections') || '[]');
    collections = collections.filter(c => c.id !== collectionId);
    localStorage.setItem('collections', JSON.stringify(collections));
}

// ── Notifications ──
export function addNotification(userId, type, postId = null, fromUserId = null) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    notifications.unshift({ id, userId, type, postId, fromUserId, read: false, createdAt: new Date().toISOString() });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function getNotifications(userId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.filter(n => n.userId === userId);
}

export function getUnreadCount(userId) {
    return getNotifications(userId).filter(n => !n.read).length;
}

export function markAllRead(userId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.forEach(n => { if (n.userId === userId) n.read = true; });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function markRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const n = notifications.find(x => x.id === notificationId);
    if (n) n.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
}
