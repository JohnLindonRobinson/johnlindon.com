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

## Testing

### Test Infrastructure
- **Framework**: Vitest with React Testing Library
- **Environment**: JSDOM for component testing
- **Coverage**: V8 provider with HTML, JSON, and text reporting
- **Types**: TypeScript for type-safe tests

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure
```
src/
├── components/
│   ├── __tests__/          # Component tests
│   ├── ui/__tests__/       # UI component tests
│   ├── sections/__tests__/ # Section component tests
│   └── forms/__tests__/    # Form component tests
├── app/
│   └── api/
│       └── __tests__/      # API endpoint tests
└── test/
    └── setup.ts            # Test configuration
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Security Tests**: Form and API security validation
- **Accessibility Tests**: WCAG compliance checks
- **E2E Tests**: Full user flow validation (coming soon)

### Coverage Goals
- Components: 80%+ coverage
- API Endpoints: 90%+ coverage
- Critical Paths: 100% coverage

For detailed testing documentation, see [Test Implementation Plan](docs/testing/test-implementation-plan.md) 