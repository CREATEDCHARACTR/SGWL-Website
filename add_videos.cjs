const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const newVideos = [
    'https://youtube.com/shorts/ahsoryG6zSs?si=5vnGcB3krDl-OrfV',
    'https://youtu.be/H82hlYSxbng?si=qKncAlJJwg5TAcSI',
    'https://youtu.be/g4tI0nNqcQ8?si=kjTv2BKCci10xecA',
    'https://youtu.be/_knZ5wYc8zs?si=jlzdVIlP9L7fP6EN',
    'https://youtube.com/shorts/Ffq4DEZ8f6s?si=C-2ccmu4BrslzfUH',
    'https://youtu.be/1lzS0Imzl-8?si=-WajGrPzCI7T4Cod'
];

const portfolioPath = 'portfolio/portfolio.json';
const publicPath = 'public/portfolio-data.json';
const data = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

// Ensure directory exists
if (!fs.existsSync('public/images/video')) {
    fs.mkdirSync('public/images/video', { recursive: true });
}

// Helper to extract ID
function getVideoId(url) {
    if (url.includes('shorts/')) {
        return url.split('shorts/')[1].split('?')[0];
    }
    if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
    }
    return null;
}

// Get existing IDs to check for duplicates
const existingIds = new Set(data.video.items.map(item => item.id.replace('video-', '')));

let addedCount = 0;

newVideos.forEach((url, index) => {
    const id = getVideoId(url);
    if (!id) {
        console.error(`Could not extract ID from ${url}`);
        return;
    }

    if (existingIds.has(id)) {
        console.log(`Skipping duplicate: ${id}`);
        return;
    }

    const thumbPath = `public/images/video/thumb-${id}.jpg`;
    const webPath = `images/video/thumb-${id}.jpg`;

    console.log(`Downloading thumbnail for ${id}...`);
    try {
        // Try maxresdefault first, fall back to hqdefault if fails (common for some shorts/older videos)
        try {
            execSync(`curl -f -L -o "${thumbPath}" "https://img.youtube.com/vi/${id}/maxresdefault.jpg"`, { stdio: 'pipe' });
        } catch (e) {
            console.log(`maxresdefault failed for ${id}, trying hqdefault...`);
            execSync(`curl -f -L -o "${thumbPath}" "https://img.youtube.com/vi/${id}/hqdefault.jpg"`);
        }

        // Add to portfolio data
        data.video.items.push({
            id: `video-${id}`,
            title: `Video ${data.video.items.length + 1}`,
            description: '',
            thumbnail: webPath,
            videoUrl: url,
            date: '2025-11-29',
            featured: false
        });
        addedCount++;
    } catch (error) {
        console.error(`Failed to download thumbnail for ${id}:`, error.message);
    }
});

const json = JSON.stringify(data, null, 4);
fs.writeFileSync(portfolioPath, json);
fs.writeFileSync(publicPath, json);
console.log(`Added ${addedCount} new videos successfully.`);
