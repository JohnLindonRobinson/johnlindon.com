# Required Images

## Profile Images
- `/public/images/profile.jpg` - Professional headshot for About page
  - Recommended size: 400x400px, square format
  - Should be well-lit, professional, and friendly
  - File size: < 100KB
  - Format: JPG or WebP
  - Background: Neutral or blurred professional setting

## Service Icons
- `/public/images/services/automation.svg` - Icon for Automation service
  - Should represent automation/robotics
  - File size: < 20KB
  - Format: SVG (preferred) or PNG with transparency
  - Color: Should work in both light and dark modes

- `/public/images/services/webdev.svg` - Icon for Web Development service
  - Should represent web development/coding
  - File size: < 20KB
  - Format: SVG (preferred) or PNG with transparency
  - Color: Should work in both light and dark modes

- `/public/images/services/notion.svg` - Icon for Notion Systems service
  - Should represent productivity/notion
  - File size: < 20KB
  - Format: SVG (preferred) or PNG with transparency
  - Color: Should work in both light and dark modes

- `/public/images/services/edtech.svg` - Icon for EdTech service
  - Should represent education/learning
  - File size: < 20KB
  - Format: SVG (preferred) or PNG with transparency
  - Color: Should work in both light and dark modes

- `/public/images/services/game.svg` - Icon for Game Tools service
  - Should represent gaming/game development
  - File size: < 20KB
  - Format: SVG (preferred) or PNG with transparency
  - Color: Should work in both light and dark modes

## Portfolio Project Images
- `/public/images/portfolio/tcquick.jpg` - TCQuick project screenshot
  - Recommended size: 1200x800px
  - Should show the main interface or key feature
  - File size: < 200KB
  - Format: JPG or WebP
  - Include alt text describing the project

- `/public/images/portfolio/bullsheet.jpg` - BullSheet project screenshot
  - Recommended size: 1200x800px
  - Should show the main interface or key feature
  - File size: < 200KB
  - Format: JPG or WebP
  - Include alt text describing the project

- `/public/images/portfolio/mtg-analyzer.jpg` - MTG Analyzer project screenshot
  - Recommended size: 1200x800px
  - Should show the main interface or key feature
  - File size: < 200KB
  - Format: JPG or WebP
  - Include alt text describing the project

- `/public/images/portfolio/notion-systems.jpg` - Notion Systems project screenshot
  - Recommended size: 1200x800px
  - Should show the main interface or key feature
  - File size: < 200KB
  - Format: JPG or WebP
  - Include alt text describing the project

- `/public/images/portfolio/edtech.jpg` - EdTech project screenshot
  - Recommended size: 1200x800px
  - Should show the main interface or key feature
  - File size: < 200KB
  - Format: JPG or WebP
  - Include alt text describing the project

## Hero Section
- `/public/images/hero-bg.jpg` - Background image for hero section
  - Recommended size: 1920x1080px
  - Should be subtle, not distracting from text
  - File size: < 300KB
  - Format: JPG or WebP
  - Consider dark overlay for text readability

## Additional Assets
- `/public/images/favicon.ico` - Website favicon
  - Size: 32x32px
  - Should be simple and recognizable
  - Format: ICO
  - Multiple sizes recommended (16x16, 32x32, 48x48)

- `/public/images/logo.svg` - Website logo (if applicable)
  - Should be simple and scalable
  - File size: < 50KB
  - Format: SVG
  - Color: Should work in both light and dark modes

## Image Requirements
- All images should be optimized for web use
- Recommended formats:
  - Photos: JPG or WebP
  - Icons: SVG or PNG with transparency
  - Backgrounds: JPG or WebP
- Maximum file sizes:
  - Profile photo: 100KB
  - Service icons: 20KB
  - Portfolio images: 200KB
  - Hero background: 300KB

## Image Optimization Tips
1. Use image compression tools before adding to project
   - Recommended tools: TinyPNG, ImageOptim, Squoosh
2. Consider using next/image for automatic optimization
3. Provide multiple sizes for responsive design
4. Use descriptive filenames and alt text
5. Consider using a CDN for production deployment
6. Test images in both light and dark modes
7. Ensure proper contrast for accessibility
8. Consider using placeholder images during development

## Directory Structure
```
public/
├── images/
│   ├── profile.jpg
│   ├── hero-bg.jpg
│   ├── favicon.ico
│   ├── logo.svg
│   ├── services/
│   │   ├── automation.svg
│   │   ├── webdev.svg
│   │   ├── notion.svg
│   │   ├── edtech.svg
│   │   └── game.svg
│   └── portfolio/
│       ├── tcquick.jpg
│       ├── bullsheet.jpg
│       ├── mtg-analyzer.jpg
│       ├── notion-systems.jpg
│       └── edtech.jpg
``` 