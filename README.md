# John Robinson - Freelance Developer & Systems Consultant

Professional portfolio and services website for John Robinson, specializing in web development, automation, and system consulting.

## 🚀 Features

- Modern, responsive design with dark mode support
- Portfolio showcase with project details
- Service offerings and booking system
- Contact form with email notifications
- SEO optimized for better visibility

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Prisma with SQLite
- **Deployment**: Vercel
- **Email**: Custom email service

## 📦 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnLindonRobinson/johnlindon.com.git
   cd johnlindon.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 License

This project is private and confidential. All rights reserved.

## 📞 Contact

For inquiries, please use the contact form on the website or email john@johnlindon.com 