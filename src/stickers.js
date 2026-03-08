// THE SPACE v2.0 — Sticker Library
// 34 SVG stickers across 6 categories, stroke-based with category accent colors

export const STICKER_SIZE = { M: 64, L: 96 };

export function isDarkBackground(hex) {
    if (!hex) return false;
    const c = hex.replace('#', '');
    if (c.length !== 6) return false;
    const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
    return ((0.299 * r + 0.587 * g + 0.114 * b) / 255) < 0.5;
}

// mk(mainPaths, accentMarkup, accentLight, accentDark)
// mainPaths rendered in primary stroke color, stroke-width 1
// accentMarkup uses $ as placeholder for accent color
function mk(paths, accent, acL, acD) {
    return (v) => {
        const isDark = typeof v === 'boolean' ? v : isDarkBackground(v);
        const p = isDark ? '#F5F0E8' : '#1A1A1A';
        const a = isDark ? acL : acD;
        return '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<g stroke="' + p + '" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' + paths + '</g>' +
            accent.replace(/\$/g, a) +
            '</svg>';
    };
}

// Category accent pairs: [light-on-dark-bg, dark-on-light-bg]
const AM = ['#FFD166', '#B8860B']; // MIND — gold
const AC = ['#FF8A80', '#C62828']; // CREATE — coral
const AS = ['#B39DDB', '#5E35B1']; // SPACE — purple
const AN = ['#81C784', '#2E7D32']; // NATURE — green
const AI = ['#FFB74D', '#E65100']; // SIGNAL — orange
const AO = ['#F48FB1', '#AD1457']; // MOOD — rose

export const STICKER_CATEGORIES = [
    {
        id: 'mind', name: 'MIND',
        stickers: [
            { id: 'lightbulb', name: 'Lightbulb', svg: mk(
                '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
                '<circle cx="12" cy="8" r="2.5" fill="$" opacity="0.5"/>', ...AM
            )},
            { id: 'brain', name: 'Brain', svg: mk(
                '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>',
                '<circle cx="12" cy="12" r="1.5" fill="$" opacity="0.6"/>', ...AM
            )},
            { id: 'book', name: 'Book', svg: mk(
                '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
                '<path d="M15 5v5l-1.5-1.5L12 10" stroke="$" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', ...AM
            )},
            { id: 'eye', name: 'Eye', svg: mk(
                '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>',
                '<circle cx="12" cy="12" r="3" fill="$" opacity="0.35" stroke="$" stroke-width="1"/>', ...AM
            )},
            { id: 'cloud', name: 'Cloud', svg: mk(
                '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
                '', ...AM
            )},
        ]
    },
    {
        id: 'create', name: 'CREATE',
        stickers: [
            { id: 'pencil', name: 'Pencil', svg: mk(
                '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
                '<circle cx="4" cy="20" r="1.5" fill="$" opacity="0.6"/>', ...AC
            )},
            { id: 'brush', name: 'Brush', svg: mk(
                '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02Z"/>',
                '<circle cx="5" cy="18" r="2" fill="$" opacity="0.5"/>', ...AC
            )},
            { id: 'scissors', name: 'Scissors', svg: mk(
                '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
                '<circle cx="12" cy="12" r="1.5" fill="$" opacity="0.6"/>', ...AC
            )},
            { id: 'sparkle', name: 'Sparkle', svg: mk(
                '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
                '<circle cx="12" cy="12" r="2" fill="$" opacity="0.5"/>', ...AC
            )},
            { id: 'rocket', name: 'Rocket', svg: mk(
                '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
                '<circle cx="16" cy="8" r="1.5" fill="$" opacity="0.6"/>', ...AC
            )},
            { id: 'needle', name: 'Needle', svg: mk(
                '<path d="m3 21 8.5-8.5"/><path d="M14.5 9.5 17 12"/><path d="m11 6.5 6.5 6.5"/><path d="m16.5 2 5.5 5.5-11 11L5.5 13Z"/>',
                '<circle cx="3" cy="21" r="1.5" fill="$" opacity="0.7"/>', ...AC
            )},
        ]
    },
    {
        id: 'space', name: 'SPACE & TIME',
        stickers: [
            { id: 'moon', name: 'Moon', svg: mk(
                '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
                '<circle cx="17" cy="5" r="1" fill="$"/><circle cx="20" cy="9" r="0.7" fill="$"/>', ...AS
            )},
            { id: 'star', name: 'Star', svg: mk(
                '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
                '<circle cx="12" cy="12" r="2" fill="$" opacity="0.4"/>', ...AS
            )},
            { id: 'comet', name: 'Comet', svg: mk(
                '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
                '<circle cx="9" cy="3" r="1.5" fill="$" opacity="0.7"/>', ...AS
            )},
            { id: 'infinity', name: 'Infinity', svg: mk(
                '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
                '<circle cx="12" cy="12" r="1.5" fill="$" opacity="0.6"/>', ...AS
            )},
            { id: 'clock', name: 'Clock', svg: mk(
                '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
                '<circle cx="12" cy="12" r="1.5" fill="$" opacity="0.6"/>', ...AS
            )},
            { id: 'hourglass', name: 'Hourglass', svg: mk(
                '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
                '<circle cx="12" cy="12" r="1.5" fill="$" opacity="0.7"/>', ...AS
            )},
        ]
    },
    {
        id: 'nature', name: 'NATURE',
        stickers: [
            { id: 'leaf', name: 'Leaf', svg: mk(
                '<path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 2 20 2s-1 5-3 10c-1 2.5-2.5 4.5-4 6"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
                '<circle cx="14" cy="8" r="1.5" fill="$" opacity="0.5"/>', ...AN
            )},
            { id: 'branch', name: 'Branch', svg: mk(
                '<path d="M12 22v-7"/><path d="M12 15l-4-4"/><path d="M12 15l4-4"/><path d="M12 11V8"/><path d="M12 8l-3-3"/><path d="M12 8l3-3"/><path d="M12 5V2"/>',
                '<circle cx="12" cy="15" r="1.5" fill="$" opacity="0.6"/><circle cx="12" cy="8" r="1.5" fill="$" opacity="0.6"/>', ...AN
            )},
            { id: 'wave', name: 'Wave', svg: mk(
                '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
                '', ...AN
            )},
            { id: 'crystal', name: 'Crystal', svg: mk(
                '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
                '<circle cx="12" cy="9" r="1.5" fill="$" opacity="0.5"/>', ...AN
            )},
            { id: 'mushroom', name: 'Mushroom', svg: mk(
                '<path d="M12 2C7 2 3 5.5 3 10h18c0-4.5-4-8-9-8Z"/><path d="M9 10v8a3 3 0 0 0 6 0v-8"/>',
                '<circle cx="8" cy="6" r="1.2" fill="$" opacity="0.6"/><circle cx="14" cy="5" r="1" fill="$" opacity="0.6"/><circle cx="11" cy="8" r="0.8" fill="$" opacity="0.4"/>', ...AN
            )},
            { id: 'stone', name: 'Stone', svg: mk(
                '<path d="M4 15s1-1 4-1 4 2 8 2 4-1 4-1V3s-1 1-4 1-4-2-8-2-4 1-4 1Z"/><line x1="4" y1="15" x2="4" y2="22"/>',
                '', ...AN
            )},
        ]
    },
    {
        id: 'signal', name: 'SIGNAL',
        stickers: [
            { id: 'lightning', name: 'Lightning', svg: mk(
                '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
                '<circle cx="10" cy="10" r="1.5" fill="$" opacity="0.5"/>', ...AI
            )},
            { id: 'envelope', name: 'Envelope', svg: mk(
                '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
                '<circle cx="12" cy="14" r="1.5" fill="$" opacity="0.5"/>', ...AI
            )},
            { id: 'code', name: 'Code', svg: mk(
                '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
                '<line x1="14" y1="6" x2="10" y2="18" stroke="$" stroke-width="1" stroke-linecap="round"/>', ...AI
            )},
            { id: 'chart', name: 'Chart', svg: mk(
                '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/>',
                '<circle cx="12" cy="4" r="1.5" fill="$" opacity="0.6"/>', ...AI
            )},
            { id: 'flag', name: 'Flag', svg: mk(
                '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z"/><line x1="4" y1="22" x2="4" y2="15"/>',
                '<circle cx="4" cy="3" r="1.5" fill="$" opacity="0.6"/>', ...AI
            )},
        ]
    },
    {
        id: 'mood', name: 'MOOD',
        stickers: [
            { id: 'crown', name: 'Crown', svg: mk(
                '<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z"/><path d="M4 18h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4Z"/>',
                '<circle cx="12" cy="10" r="1.5" fill="$" opacity="0.6"/>', ...AO
            )},
            { id: 'fire', name: 'Fire', svg: mk(
                '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
                '<circle cx="12" cy="14" r="2" fill="$" opacity="0.4"/>', ...AO
            )},
            { id: 'diamond', name: 'Diamond', svg: mk(
                '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
                '<circle cx="12" cy="9" r="1.5" fill="$" opacity="0.5"/>', ...AO
            )},
            { id: 'anchor', name: 'Anchor', svg: mk(
                '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
                '<circle cx="12" cy="5" r="1.5" fill="$" opacity="0.5"/>', ...AO
            )},
            { id: 'coffee', name: 'Coffee', svg: mk(
                '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
                '', ...AO
            )},
            { id: 'bottle', name: 'Bottle', svg: mk(
                '<path d="M10 2h4"/><path d="M10 2v4a2 2 0 0 1-.5 1.3L7 10a2 2 0 0 0-.5 1.3V20a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-8.7a2 2 0 0 0-.5-1.3l-2.5-2.7A2 2 0 0 1 14 6V2"/>',
                '<circle cx="12" cy="16" r="1.5" fill="$" opacity="0.5"/>', ...AO
            )},
        ]
    }
];

export function getStickerSvg(sticker, bgHex) {
    const isDark = isDarkBackground(bgHex);
    return sticker.svg(isDark);
}

export function getAllStickers() {
    return STICKER_CATEGORIES.flatMap(cat => cat.stickers.map(s => ({ ...s, category: cat.id, categoryName: cat.name })));
}
