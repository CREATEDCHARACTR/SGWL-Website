import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const portfolioDir = path.join(__dirname, 'portfolio');
const imagesDir = path.join(portfolioDir, 'images');
const outputFile = path.join(portfolioDir, 'portfolio.json');

const categories = {
    'wedding': { title: "Wedding Photography", description: "Capturing love stories" },
    'headshots': { title: "Professional Headshots", description: "Corporate & personal branding" },
    'portrait': { title: "Portrait Photography", description: "Individual & family portraits" },
    'event': { title: "Event Photography", description: "Corporate events, conferences, parties" },
    'real-estate': { title: "Real Estate Photography", description: "Property listings & virtual tours" },
    'car': { title: "Automotive Photography", description: "Car showcases & detail shots" },
    'newborn': { title: "Newborn Photography", description: "Precious moments with baby" },
    'maternity': { title: "Maternity Photography", description: "Expecting mothers & pregnancy portraits" },
    'fashion': { title: "Fashion & Lifestyle", description: "Fashion shoots & lifestyle imagery" },
    'birthday': { title: "Birthday Photography", description: "Birthday events & photography" },
    'engagement': { title: "Engagement Photography", description: "Engagement events & photography" },
    'graduation': { title: "Graduation Photography", description: "Graduation events & photography" },
    'clothing': { title: "Clothing Photography", description: "Clothing brand showcases" },
    'family': { title: "Family Photography", description: "Family moments" }
};

const portfolioData = {
    photography: {},
    music: {
        "original": {
            "title": "Original Music",
            "description": "Original compositions & releases",
            "items": []
        }
    }
};

// Helper to format title from filename
function formatTitle(filename) {
    return filename
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/-/g, " ") // Replace dashes with spaces
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/Edit/g, "") // Remove "Edit"
        .replace(/\d+/g, "") // Remove numbers
        .trim();
}

try {
    const dirs = fs.readdirSync(imagesDir);

    dirs.forEach(dir => {
        const dirPath = path.join(imagesDir, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const categoryKey = dir.toLowerCase();
            const categoryInfo = categories[categoryKey] || {
                title: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " Photography",
                description: "Portfolio collection"
            };

            const items = [];
            const files = fs.readdirSync(dirPath);

            files.forEach(file => {
                if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    items.push({
                        id: `${categoryKey}-${file}`,
                        title: formatTitle(file) || "Untitled",
                        description: "",
                        image: `images/${dir}/${file}`,
                        date: new Date().toISOString().split('T')[0], // Default to today
                        featured: false
                    });
                }
            });

            if (items.length > 0) {
                portfolioData.photography[categoryKey] = {
                    ...categoryInfo,
                    items: items
                };
            }
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(portfolioData, null, 2));
    console.log(`Successfully generated portfolio.json with ${Object.keys(portfolioData.photography).length} categories.`);

} catch (err) {
    console.error("Error generating portfolio:", err);
    process.exit(1);
}
