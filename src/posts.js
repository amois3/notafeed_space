import { getCurrentUser, addNotification } from './localDb.js';

const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

/** Escape HTML to prevent XSS in innerHTML templates */
export function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function createPost(postData, tags = []) {
    const user = getCurrentUser();
    if (!user) throw new Error("You must be logged in to publish a card.");

    const post = {
        id: generateId(),
        userId: user.id,
        headline: postData.headline || '',
        content: postData.content || '',
        canvasData: postData.canvasData || null,
        cardSize: postData.cardSize || 'small',
        tags,
        createdAt: new Date().toISOString()
    };

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    return post;
}

export function getAllPosts() {
    return JSON.parse(localStorage.getItem('posts') || '[]');
}

export function getPostById(id) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return posts.find(p => p.id === id);
}

export function updatePost(postId, postData, tags = []) {
    const user = getCurrentUser();
    if (!user) throw new Error("You must be logged in to edit a card.");

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) throw new Error("Card not found.");
    if (posts[idx].userId !== user.id) throw new Error("You can only edit your own cards.");

    posts[idx].headline = postData.headline || '';
    posts[idx].content = postData.content || '';
    posts[idx].canvasData = postData.canvasData || null;
    posts[idx].cardSize = postData.cardSize || 'small';
    posts[idx].tags = tags;

    localStorage.setItem('posts', JSON.stringify(posts));
    return posts[idx];
}

export function deletePost(postId) {
    const user = getCurrentUser();
    if (!user) throw new Error("You must be logged in to delete a card.");

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error("Card not found.");
    if (post.userId !== user.id) throw new Error("You can only delete your own cards.");

    localStorage.setItem('posts', JSON.stringify(posts.filter(p => p.id !== postId)));

    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    localStorage.setItem('likes', JSON.stringify(likes.filter(l => l.postId !== postId)));

    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    localStorage.setItem('comments', JSON.stringify(comments.filter(c => c.postId !== postId)));

    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    localStorage.setItem('saves', JSON.stringify(saves.filter(s => s.postId !== postId)));
}

export function likePost(postId) {
    const user = getCurrentUser();
    if (!user) throw new Error("Must be logged in to like a card.");
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');

    const idx = likes.findIndex(l => l.postId === postId && l.userId === user.id);
    if (idx > -1) {
        likes.splice(idx, 1);
        localStorage.setItem('likes', JSON.stringify(likes));
        return { liked: false, change: -1 };
    } else {
        likes.push({ postId, userId: user.id });
        localStorage.setItem('likes', JSON.stringify(likes));
        // Notify post owner
        const post = getPostById(postId);
        if (post && post.userId !== user.id) {
            addNotification(post.userId, 'like', postId, user.id);
        }
        return { liked: true, change: 1 };
    }
}

export function getLikesForPost(postId) {
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    return likes.filter(l => l.postId === postId);
}

export function isLikedByCurrentUser(postId) {
    const user = getCurrentUser();
    if (!user) return false;
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    return likes.some(l => l.postId === postId && l.userId === user.id);
}

export function addComment(postId, content) {
    const user = getCurrentUser();
    if (!user) throw new Error("Must be logged in to leave a note.");

    const comment = {
        id: generateId(),
        postId,
        userId: user.id,
        content,
        createdAt: new Date().toISOString()
    };
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
    // Notify post owner
    const post = getPostById(postId);
    if (post && post.userId !== user.id) {
        addNotification(post.userId, 'note', postId, user.id);
    }
    return comment;
}

export function getCommentsForPost(postId) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments.filter(c => c.postId === postId);
}

// ── Save / Bookmark ──
export function savePost(postId) {
    const user = getCurrentUser();
    if (!user) throw new Error("Must be logged in to save a card.");
    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    const idx = saves.findIndex(s => s.postId === postId && s.userId === user.id);
    if (idx > -1) {
        saves.splice(idx, 1);
        localStorage.setItem('saves', JSON.stringify(saves));
        return { saved: false };
    } else {
        saves.push({ postId, userId: user.id });
        localStorage.setItem('saves', JSON.stringify(saves));
        const post = getPostById(postId);
        if (post && post.userId !== user.id) {
            addNotification(post.userId, 'save', postId, user.id);
        }
        return { saved: true };
    }
}

export function isSavedByCurrentUser(postId) {
    const user = getCurrentUser();
    if (!user) return false;
    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    return saves.some(s => s.postId === postId && s.userId === user.id);
}

export function getSavedByCurrentUser() {
    const user = getCurrentUser();
    if (!user) return [];
    const saves = JSON.parse(localStorage.getItem('saves') || '[]');
    const savedIds = saves.filter(s => s.userId === user.id).map(s => s.postId);
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return posts.filter(p => savedIds.includes(p.id));
}

export function getPostsByUser(userId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return posts.filter(p => p.userId === userId);
}

export function getLikedPostsByUser(userId) {
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    const likedIds = likes.filter(l => l.userId === userId).map(l => l.postId);
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    return posts.filter(p => likedIds.includes(p.id));
}

export function getCommentsByUser(userId) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments.filter(c => c.userId === userId);
}

// ── Search ──
export function searchPosts(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    const posts = getAllPosts();
    return posts.filter(p => {
        const text = `${p.headline} ${p.content} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (p.canvasData && p.canvasData.elements) {
            const canvasText = p.canvasData.elements.map(e => e.content || '').join(' ').toLowerCase();
            return text.includes(q) || canvasText.includes(q);
        }
        return text.includes(q);
    });
}

// ── Toast helper ──
export function showToast(message, isError = false) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast${isError ? ' toast--error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast--hide');
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

// ── Seed v3.0 — realistic users and content ──
(function seedV3() {
    if (localStorage.getItem('space_seeded_v6')) return;

    const H = 3600000;
    const now = Date.now();

    // ── Users ──
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => !u.id.startsWith('sys_'));
    const sysUsers = [
        { id: 'sys_1', fullname: 'Mia Laurent', username: 'mialaurent', email: 'mia@example.com', password: 'password' },
        { id: 'sys_2', fullname: 'Jun Hara', username: 'jun.h', email: 'jun@example.com', password: 'password' },
        { id: 'sys_3', fullname: 'Tomás Reyes', username: 'tomas.r', email: 'tomas@example.com', password: 'password' },
        { id: 'sys_4', fullname: 'Noor Khalil', username: 'noor.k', email: 'noor@example.com', password: 'password' },
        { id: 'sys_5', fullname: 'Sam Chen', username: 'samwrites', email: 'sam@example.com', password: 'password' },
        { id: 'sys_6', fullname: 'Rina Oka', username: 'rina.reads', email: 'rina@example.com', password: 'password' },
        { id: 'sys_7', fullname: 'Jake Morrison', username: 'jakemrrn', email: 'jake@example.com', password: 'password' },
        { id: 'sys_8', fullname: 'Diana Costa', username: 'dianacosta', email: 'diana@example.com', password: 'password' },
        { id: 'sys_9', fullname: 'Marcus Williams', username: 'marcus.w', email: 'marcus@example.com', password: 'password' },
        { id: 'sys_10', fullname: 'Lily Park', username: 'lilydraws', email: 'lily@example.com', password: 'password' },
        { id: 'sys_11', fullname: 'Oleg Volkov', username: 'olegv', email: 'oleg@example.com', password: 'password' },
    ];
    users = [...sysUsers, ...users];
    localStorage.setItem('users', JSON.stringify(users));

    // ── Posts (newest first) ──
    const seedPosts = [
        { id: 'v3_01', userId: 'sys_10', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#2D3748', elements: [
                { type: 'text', content: '3am thoughts:\ndo plants get lonely', font: 'Inter', fontSize: 14, color: '#D0CCCC', left: '44%', top: '50%' }
            ] }, tags: ['thoughts'], createdAt: new Date(now - 2 * H).toISOString() },
        { id: 'v3_02', userId: 'sys_9', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#E8341A', elements: [
                { type: 'text', content: 'dropped a beat at 2am\nneighbors dropped\na noise complaint\nat 2:05', font: 'Inter', fontSize: 16, color: '#FFFFFF', left: '50%', top: '42%' },
                { type: 'sticker', stickerId: 'lightning', left: '82%', top: '78%' }
            ] }, tags: ['music'], createdAt: new Date(now - 5 * H).toISOString() },
        { id: 'v3_03', userId: 'sys_1', cardSize: 'wide', headline: '', content: '',
            canvasData: { bgColor: '#C4717E', elements: [
                { type: 'text', content: "saturday energy:\nstaring at a blank canvas\nfor 45 min and calling it\n'research'", font: 'Inter', fontSize: 16, color: '#FFFFFF', left: '50%', top: '45%' }
            ] }, tags: ['design'], createdAt: new Date(now - 8 * H).toISOString() },
        { id: 'v3_04', userId: 'sys_7', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#1A0D2E', elements: [
                { type: 'text', content: "song idea at 3am\nrecorded a voice memo\n\nit's just me\nhumming off-key", font: 'JetBrains Mono', fontSize: 14, color: '#D0CCCC', left: '46%', top: '40%' }
            ] }, tags: ['music'], createdAt: new Date(now - 12 * H).toISOString() },
        { id: 'v3_05', userId: 'sys_4', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#F0EEE9', elements: [
                { type: 'text', content: 'light does all the work\ni just press the button', font: 'Inter', fontSize: 16, color: '#3A3A3A', left: '55%', top: '48%' }
            ] }, tags: ['photography'], createdAt: new Date(now - 18 * H).toISOString() },
        { id: 'v3_06', userId: 'sys_5', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#EDF2F7', elements: [
                { type: 'text', content: 'read 3 papers today\nunderstood maybe\nhalf of one', font: 'Inter', fontSize: 14, color: '#1A1A1A', left: '50%', top: '40%' },
                { type: 'sticker', stickerId: 'book', left: '78%', top: '75%' }
            ] }, tags: ['thoughts'], createdAt: new Date(now - 24 * H).toISOString() },
        { id: 'v3_07', userId: 'sys_3', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0F1923', elements: [
                { type: 'text', content: 'wrote 200 lines today\ndeleted 180\n\nbest day this week', font: 'JetBrains Mono', fontSize: 16, color: '#D0CCCC', left: '43%', top: '38%' },
                { type: 'sticker', stickerId: 'code', left: '80%', top: '20%' }
            ] }, tags: ['code'], createdAt: new Date(now - 36 * H).toISOString() },
        { id: 'v3_08', userId: 'sys_8', cardSize: 'wide', headline: '', content: '',
            canvasData: { bgColor: '#5B21B6', elements: [
                { type: 'text', content: "some words exist\nin only one language\n\nthat's not a flaw\nthat's a feature", font: 'Playfair Display', fontSize: 18, color: '#FFFFFF', left: '50%', top: '45%', italic: true }
            ] }, tags: ['language', 'thoughts'], createdAt: new Date(now - 48 * H).toISOString() },
        { id: 'v3_09', userId: 'sys_11', cardSize: 'wide', headline: '', content: '',
            canvasData: { bgColor: '#D4A017', elements: [
                { type: 'text', content: "Tbilisi at sunset\nis not a city\n\nit's a painting", font: 'Playfair Display', fontSize: 22, color: '#0C1445', left: '42%', top: '40%', italic: true }
            ] }, tags: ['travel', 'photography'], createdAt: new Date(now - 52 * H).toISOString() },
        { id: 'v3_10', userId: 'sys_6', cardSize: 'tall', headline: '', content: '',
            canvasData: { bgColor: '#553C9A', elements: [
                { type: 'text', content: "my students think\nShakespeare is boring\n\nthey haven't met\nLady Macbeth yet", font: 'Playfair Display', fontSize: 18, color: '#FAF0DC', left: '50%', top: '42%' }
            ] }, tags: ['books'], createdAt: new Date(now - 72 * H).toISOString() },
        { id: 'v3_11', userId: 'sys_1', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#FDF6E3', elements: [
                { type: 'text', content: 'the space between\nletters matters more\nthan the letters', font: 'Playfair Display', fontSize: 18, color: '#1A1A1A', left: '40%', top: '42%', italic: true },
                { type: 'sticker', stickerId: 'pencil', left: '22%', top: '78%' }
            ] }, tags: ['design', 'typography'], createdAt: new Date(now - 78 * H).toISOString() },
        { id: 'v3_12', userId: 'sys_2', cardSize: 'tall', headline: '', content: '',
            canvasData: { bgColor: '#D4A017', elements: [
                { type: 'text', content: 'every building starts\nwith a question:\nwhat does this place\nneed to feel like?', font: 'Inter', fontSize: 16, color: '#0C1445', left: '50%', top: '38%' },
                { type: 'sticker', stickerId: 'brain', left: '75%', top: '75%' }
            ] }, tags: ['architecture', 'design'], createdAt: new Date(now - 96 * H).toISOString() },
        { id: 'v3_13', userId: 'sys_4', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0D0D0D', elements: [
                { type: 'text', content: 'film > digital\nfight me', font: 'Syne', fontSize: 32, color: '#FFFFFF', left: '50%', top: '45%' }
            ] }, tags: ['photography'], createdAt: new Date(now - 100 * H).toISOString() },
        { id: 'v3_14', userId: 'sys_9', cardSize: 'wide', headline: '', content: '',
            canvasData: { bgColor: '#0D0D0D', elements: [
                { type: 'text', content: 'every great song\nstarts with a\nterrible first draft', font: 'Syne', fontSize: 28, color: '#FFFFFF', left: '38%', top: '42%' }
            ] }, tags: ['music', 'creativity'], createdAt: new Date(now - 120 * H).toISOString() },
        { id: 'v3_15', userId: 'sys_10', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#F0EEE9', elements: [
                { type: 'text', content: 'drew a leaf today\nlooked nothing like a leaf\nbut it made me happy', font: 'Inter', fontSize: 16, color: '#3A3A3A', left: '55%', top: '42%' },
                { type: 'sticker', stickerId: 'leaf', left: '22%', top: '24%' }
            ] }, tags: ['art'], createdAt: new Date(now - 126 * H).toISOString() },
        { id: 'v3_16', userId: 'sys_7', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0D7A5F', elements: [
                { type: 'text', content: "made someone smile\nwith an oat milk latte\ntoday\n\nthat's the whole job", font: 'Inter', fontSize: 16, color: '#FAF0DC', left: '50%', top: '42%' },
                { type: 'sticker', stickerId: 'coffee', left: '80%', top: '82%' }
            ] }, tags: ['coffee'], createdAt: new Date(now - 144 * H).toISOString() },
        { id: 'v3_17', userId: 'sys_8', cardSize: 'wide', headline: '', content: '',
            canvasData: { bgColor: '#0D7A5F', elements: [
                { type: 'text', content: "saudade is not sadness\n\nit's the ache\nof a beautiful memory", font: 'Playfair Display', fontSize: 20, color: '#FAF0DC', left: '42%', top: '40%' },
                { type: 'sticker', stickerId: 'leaf', left: '82%', top: '22%' }
            ] }, tags: ['language', 'philosophy'], createdAt: new Date(now - 168 * H).toISOString() },
        { id: 'v3_18', userId: 'sys_5', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#FDF6E3', elements: [
                { type: 'text', content: 'we are all just\npatterns recognizing\npatterns', font: 'Playfair Display', fontSize: 20, color: '#1A1A1A', left: '50%', top: '44%' },
                { type: 'sticker', stickerId: 'infinity', left: '22%', top: '22%' }
            ] }, tags: ['philosophy'], createdAt: new Date(now - 172 * H).toISOString() },
        { id: 'v3_19', userId: 'sys_3', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#2B5BFF', elements: [
                { type: 'text', content: "the best feature\nis the one you\ndon't build", font: 'Inter', fontSize: 18, color: '#FFFFFF', left: '55%', top: '47%' }
            ] }, tags: ['code', 'design'], createdAt: new Date(now - 192 * H).toISOString() },
        { id: 'v3_20', userId: 'sys_1', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0D0D0D', elements: [
                { type: 'text', content: 'good design\nis the space\nbetween things', font: 'Syne', fontSize: 28, color: '#FFFFFF', left: '42%', top: '42%' }
            ] }, tags: ['design'], createdAt: new Date(now - 216 * H).toISOString() },
        { id: 'v3_21', userId: 'sys_4', cardSize: 'tall', headline: '', content: '',
            canvasData: { bgColor: '#D4A017', elements: [
                { type: 'text', content: 'been chasing golden hour\nmy whole life', font: 'Playfair Display', fontSize: 22, color: '#FAF0DC', left: '50%', top: '38%', italic: true },
                { type: 'sticker', stickerId: 'star', left: '75%', top: '72%' }
            ] }, tags: ['photography'], createdAt: new Date(now - 240 * H).toISOString() },
        { id: 'v3_22', userId: 'sys_2', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0F1923', elements: [
                { type: 'text', content: 'less, but better.', font: 'Syne', fontSize: 36, color: '#FFFFFF', left: '50%', top: '45%' }
            ] }, tags: ['design', 'architecture'], createdAt: new Date(now - 246 * H).toISOString() },
        { id: 'v3_23', userId: 'sys_6', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#FDF6E3', elements: [
                { type: 'text', content: 'a good book is just\na door someone\nleft open for you', font: 'Playfair Display', fontSize: 20, color: '#1A1A1A', left: '50%', top: '40%', italic: true },
                { type: 'sticker', stickerId: 'book', left: '24%', top: '76%' }
            ] }, tags: ['books', 'philosophy'], createdAt: new Date(now - 264 * H).toISOString() },
        { id: 'v3_24', userId: 'sys_10', cardSize: 'tall', headline: '', content: '',
            canvasData: { bgColor: '#0D7A5F', elements: [
                { type: 'text', content: 'mitochondria IS\nthe powerhouse\nof the cell\n\ni will die on this hill', font: 'Syne', fontSize: 24, color: '#FAF0DC', left: '50%', top: '35%' },
                { type: 'sticker', stickerId: 'mushroom', left: '25%', top: '78%' }
            ] }, tags: ['science'], createdAt: new Date(now - 288 * H).toISOString() },
        { id: 'v3_25', userId: 'sys_11', cardSize: 'small', headline: '', content: '',
            canvasData: { bgColor: '#0F1923', elements: [
                { type: 'text', content: "the best camera\nis the one\nthat's with you", font: 'Inter', fontSize: 16, color: '#D0CCCC', left: '48%', top: '48%' }
            ] }, tags: ['photography'], createdAt: new Date(now - 336 * H).toISOString() },
    ];

    let currentPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    currentPosts = currentPosts.filter(p => !p.id.startsWith('mock_') && !p.id.startsWith('v2_') && !p.id.startsWith('v3_'));
    currentPosts = [...seedPosts, ...currentPosts];
    localStorage.setItem('posts', JSON.stringify(currentPosts));

    // ── Seed follows ──
    let follows = JSON.parse(localStorage.getItem('follows') || '[]');
    follows = follows.filter(f => !f.followerId.startsWith('sys_'));
    const seedFollows = [
        { followerId: 'sys_1', followingId: 'sys_2' },
        { followerId: 'sys_1', followingId: 'sys_4' },
        { followerId: 'sys_1', followingId: 'sys_9' },
        { followerId: 'sys_2', followingId: 'sys_1' },
        { followerId: 'sys_2', followingId: 'sys_5' },
        { followerId: 'sys_3', followingId: 'sys_2' },
        { followerId: 'sys_3', followingId: 'sys_9' },
        { followerId: 'sys_4', followingId: 'sys_1' },
        { followerId: 'sys_4', followingId: 'sys_10' },
        { followerId: 'sys_4', followingId: 'sys_11' },
        { followerId: 'sys_5', followingId: 'sys_6' },
        { followerId: 'sys_5', followingId: 'sys_8' },
        { followerId: 'sys_6', followingId: 'sys_5' },
        { followerId: 'sys_6', followingId: 'sys_8' },
        { followerId: 'sys_7', followingId: 'sys_9' },
        { followerId: 'sys_7', followingId: 'sys_3' },
        { followerId: 'sys_7', followingId: 'sys_10' },
        { followerId: 'sys_8', followingId: 'sys_6' },
        { followerId: 'sys_8', followingId: 'sys_4' },
        { followerId: 'sys_9', followingId: 'sys_7' },
        { followerId: 'sys_9', followingId: 'sys_1' },
        { followerId: 'sys_10', followingId: 'sys_4' },
        { followerId: 'sys_10', followingId: 'sys_6' },
        { followerId: 'sys_11', followingId: 'sys_4' },
        { followerId: 'sys_11', followingId: 'sys_1' },
        { followerId: 'sys_11', followingId: 'sys_8' },
    ];
    follows = [...seedFollows, ...follows];
    localStorage.setItem('follows', JSON.stringify(follows));

    // ── Seed likes ──
    let likes = JSON.parse(localStorage.getItem('likes') || '[]');
    likes = likes.filter(l => !l.userId.startsWith('sys_'));
    const seedLikes = [
        { postId: 'v3_22', userId: 'sys_1' }, { postId: 'v3_13', userId: 'sys_1' },
        { postId: 'v3_14', userId: 'sys_1' }, { postId: 'v3_15', userId: 'sys_1' },
        { postId: 'v3_20', userId: 'sys_2' }, { postId: 'v3_18', userId: 'sys_2' },
        { postId: 'v3_08', userId: 'sys_2' },
        { postId: 'v3_02', userId: 'sys_3' }, { postId: 'v3_16', userId: 'sys_3' },
        { postId: 'v3_24', userId: 'sys_3' },
        { postId: 'v3_11', userId: 'sys_4' }, { postId: 'v3_17', userId: 'sys_4' },
        { postId: 'v3_09', userId: 'sys_4' }, { postId: 'v3_15', userId: 'sys_4' },
        { postId: 'v3_23', userId: 'sys_5' }, { postId: 'v3_08', userId: 'sys_5' },
        { postId: 'v3_12', userId: 'sys_5' },
        { postId: 'v3_06', userId: 'sys_6' }, { postId: 'v3_17', userId: 'sys_6' },
        { postId: 'v3_21', userId: 'sys_6' },
        { postId: 'v3_02', userId: 'sys_7' }, { postId: 'v3_01', userId: 'sys_7' },
        { postId: 'v3_07', userId: 'sys_7' },
        { postId: 'v3_23', userId: 'sys_8' }, { postId: 'v3_21', userId: 'sys_8' },
        { postId: 'v3_09', userId: 'sys_8' },
        { postId: 'v3_04', userId: 'sys_9' }, { postId: 'v3_03', userId: 'sys_9' },
        { postId: 'v3_13', userId: 'sys_9' },
        { postId: 'v3_16', userId: 'sys_10' }, { postId: 'v3_10', userId: 'sys_10' },
        { postId: 'v3_05', userId: 'sys_10' },
        { postId: 'v3_21', userId: 'sys_11' }, { postId: 'v3_20', userId: 'sys_11' },
        { postId: 'v3_17', userId: 'sys_11' },
    ];
    likes = [...seedLikes, ...likes];
    localStorage.setItem('likes', JSON.stringify(likes));

    // ── Seed comments (notes) ──
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments = comments.filter(c => !c.id.startsWith('c_'));
    const seedComments = [
        { id: 'c_1', postId: 'v3_11', userId: 'sys_4', content: 'helvetica is overrated pass it on', createdAt: new Date(now - 76 * H).toISOString() },
        { id: 'c_2', postId: 'v3_02', userId: 'sys_3', content: 'lmaooo been there', createdAt: new Date(now - 4 * H).toISOString() },
        { id: 'c_3', postId: 'v3_06', userId: 'sys_6', content: "this is the most grad school thing i've ever read", createdAt: new Date(now - 22 * H).toISOString() },
        { id: 'c_4', postId: 'v3_15', userId: 'sys_1', content: 'the happiest leaf i\'ve ever seen tbh', createdAt: new Date(now - 120 * H).toISOString() },
        { id: 'c_5', postId: 'v3_24', userId: 'sys_7', content: 'this is objectively correct', createdAt: new Date(now - 280 * H).toISOString() },
        { id: 'c_6', postId: 'v3_21', userId: 'sys_8', content: "every photographer i know says this and they're all right", createdAt: new Date(now - 230 * H).toISOString() },
        { id: 'c_7', postId: 'v3_08', userId: 'sys_5', content: 'the German word Sehnsucht comes to mind', createdAt: new Date(now - 46 * H).toISOString() },
        { id: 'c_8', postId: 'v3_04', userId: 'sys_9', content: "send the voice memo bro i'll produce it", createdAt: new Date(now - 10 * H).toISOString() },
    ];
    comments = [...seedComments, ...comments];
    localStorage.setItem('comments', JSON.stringify(comments));

    // ── Seed saves ──
    let saves = JSON.parse(localStorage.getItem('saves') || '[]');
    saves = saves.filter(s => !s.userId.startsWith('sys_'));
    const seedSaves = [
        { postId: 'v3_17', userId: 'sys_5' }, { postId: 'v3_20', userId: 'sys_5' },
        { postId: 'v3_09', userId: 'sys_4' }, { postId: 'v3_15', userId: 'sys_4' },
        { postId: 'v3_17', userId: 'sys_6' }, { postId: 'v3_12', userId: 'sys_1' },
    ];
    saves = [...seedSaves, ...saves];
    localStorage.setItem('saves', JSON.stringify(saves));

    // ── Seed collections ──
    let collections = JSON.parse(localStorage.getItem('collections') || '[]');
    collections = collections.filter(c => !c.id.startsWith('col_'));
    const seedCollections = [
        { id: 'col_1', userId: 'sys_4', name: 'visual inspo', description: '', cardIds: ['v3_09', 'v3_15', 'v3_11'], createdAt: new Date(now - 100 * H).toISOString() },
        { id: 'col_2', userId: 'sys_5', name: 'things i keep thinking about', description: '', cardIds: ['v3_17', 'v3_18', 'v3_23'], createdAt: new Date(now - 170 * H).toISOString() },
    ];
    collections = [...seedCollections, ...collections];
    localStorage.setItem('collections', JSON.stringify(collections));

    localStorage.removeItem('amois_boosted');
    localStorage.setItem('space_seeded_v6', 'true');
})();

// ── Boost @amois — all sys_ users follow & like ──
(function boostAmois() {
    if (localStorage.getItem('amois_boosted')) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const amois = users.find(u => u.username === 'amois');
    if (!amois) return;

    const sysIds = users.filter(u => u.id.startsWith('sys_')).map(u => u.id);

    // Follow
    let follows = JSON.parse(localStorage.getItem('follows') || '[]');
    sysIds.forEach(sid => {
        if (!follows.some(f => f.followerId === sid && f.followingId === amois.id)) {
            follows.push({ followerId: sid, followingId: amois.id });
        }
    });
    localStorage.setItem('follows', JSON.stringify(follows));

    // Like all posts
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const amoisPosts = posts.filter(p => p.userId === amois.id);
    let likes = JSON.parse(localStorage.getItem('likes') || '[]');
    amoisPosts.forEach(post => {
        sysIds.forEach(sid => {
            if (!likes.some(l => l.postId === post.id && l.userId === sid)) {
                likes.push({ postId: post.id, userId: sid });
            }
        });
    });
    localStorage.setItem('likes', JSON.stringify(likes));

    localStorage.setItem('amois_boosted', 'true');
})();
