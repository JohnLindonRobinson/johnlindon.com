# John Lindon's Personal Website

A modern, performant personal website built with Next.js, TypeScript, and Framer Motion.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 🎨 Smooth animations using Framer Motion
- 📱 Fully responsive design
- 🔒 Secure contact form with input validation
- 📅 Motion calendar integration
- ✅ Comprehensive test coverage
- 🌐 Cross-browser compatibility
- ♿ WCAG 2.1 AA compliant

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnLindonRobinson/johnlindon.com.git
   cd johnlindon.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your values.

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

### Testing

Run the test suite:
```bash
npm run test
```

For specific test files:
```bash
npm run test src/app/api/__tests__/contact.security.test.ts -- --run
```

View test coverage:
```bash
npm run test:coverage
```

### Building

Create a production build:
```bash
npm run build
```

### Deployment

The site is automatically deployed to Vercel on push to the main branch.

## Project Structure

```
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── docs/            # Documentation
└── tests/           # Test files
```

## Testing Strategy

- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for animations
- Accessibility testing
- Cross-browser testing

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

John Lindon Robinson - [Contact Form](https://johnlindon.com/contact) 