// download-curated-images.js
// Usage: node download-curated-images.js
// Requires: npm install node-fetch@2

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // v2 for CommonJS

const images = [
  // AI-Powered Task Management
  {
    url: 'https://www.usemotion.com/blog/ai-task-manager',
    dest: 'public/projects/ai-task-manager-main.jpg'
  },
  {
    url: 'https://www.freepik.com/premium-ai-image/efficient-task-management-productivity-tools_80974084.htm',
    dest: 'public/projects/ai-task-manager-1.jpg'
  },
  {
    url: 'https://www.zenhub.com/ai-project-management-a-guide',
    dest: 'public/projects/ai-task-manager-2.jpg'
  },
  {
    url: 'https://www.amitjadhav.com/blogs/AI-in-Project-Management',
    dest: 'public/projects/ai-task-manager-3.jpg'
  },

  // Educational Platform
  {
    url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80', // Example Unsplash direct image
    dest: 'public/projects/education-platform-main.jpg'
  },
  {
    url: 'https://www.freepik.com/free-photos-vectors/learning-platform',
    dest: 'public/projects/education-platform-1.jpg'
  },
  {
    url: 'https://www.istockphoto.com/photos/interactive-learning',
    dest: 'public/projects/education-platform-2.jpg'
  },
  {
    url: 'https://pixabay.com/images/search/e-learning/',
    dest: 'public/projects/education-platform-3.jpg'
  },

  // Business Analytics Dashboard
  {
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80', // Example Unsplash direct image
    dest: 'public/projects/analytics-dashboard-main.jpg'
  },
  {
    url: 'https://www.freepik.com/free-photos-vectors/analytics-dashboard',
    dest: 'public/projects/analytics-dashboard-1.jpg'
  },
  {
    url: 'https://www.vecteezy.com/free-photos/data-analytics-dashboard',
    dest: 'public/projects/analytics-dashboard-2.jpg'
  },
  {
    url: 'https://www.shutterstock.com/search/business-analytics',
    dest: 'public/projects/analytics-dashboard-3.jpg'
  },

  // Testimonials
  {
    url: 'https://goldhouse.org/wp-content/uploads/2022/05/Sarah-Lee-Headshot.jpg', // Example direct image
    dest: 'public/images/testimonial-sarah-lee.jpg'
  },
  {
    url: 'https://static.toiimg.com/photo/msid-87930513/87930513.jpg', // Example direct image for David Kim
    dest: 'public/images/testimonial-david-kim.jpg'
  },
  {
    url: 'https://www.womenofwearables.com/uploads/1/2/1/6/121637478/published/priya-patel.jpg', // Example direct image for Priya Patel
    dest: 'public/images/testimonial-priya-patel.jpg'
  }
];

// Helper to download a file
async function downloadImage(url, dest) {
  try {
    // Ensure directory exists
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

    const fileStream = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
    console.log(`Downloaded: ${dest}`);
  } catch (err) {
    console.error(`Error downloading ${url}: ${err.message}`);
  }
}

(async () => {
  for (const img of images) {
    await downloadImage(img.url, img.dest);
  }
})();