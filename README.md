# Perseon Frontend Boilerplate

A modern, type-safe React boilerplate built with TanStack Router, TanStack Query, and best-in-class tools for building scalable web applications.

## 🚀 Features

### Core Technologies
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety throughout the application
- **Vite** - Lightning-fast build tool and dev server
- **TanStack Router** - 100% type-safe routing with nested layouts and loaders
- **TanStack Query** - Powerful asynchronous state management and data fetching
- **Zustand** - Lightweight, fast state management

### UI & Styling
- **Shadcn/ui** - Beautiful, accessible components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Theme Support** - Dark/Light/System theme switching
- **RTL Support** - Right-to-left layout support for Persian/Arabic
- **Custom Fonts** - IranSansX Persian font integration

### Developer Experience
- **Hot Module Replacement** - Instant updates during development
- **Type-Safe Navigation** - Auto-generated route types
- **DevTools Integration** - TanStack Router and Query devtools
- **ESLint & Prettier** - Code quality and formatting
- **Vitest** - Fast unit testing framework

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── providers/          # React context providers
├── routes/             # File-based routing (TanStack Router)
├── store/              # Zustand state stores
└── styles.css          # Global styles and Tailwind imports
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MehrshadSB/perseon.git
cd perseon
git checkout boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 🧩 Key Features Explained

### Type-Safe Routing
Routes are defined as files in the `src/routes/` directory. TanStack Router automatically generates type-safe navigation:

```tsx
// Navigate with full type safety
<Link to="/users/$userId" params={{ userId: "123" }} />
```

### Data Fetching with Loaders
Combine routing and data fetching seamlessly:

```tsx
export const Route = createFileRoute('/users')({
  loader: async () => {
    return fetchUsers();
  },
  component: UsersComponent,
});
```

### State Management
Use Zustand for client-side state:

```tsx
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Theme Switching
Built-in theme provider with persistence:

```tsx
<ThemeProvider defaultTheme="light" storageKey="app-theme">
  <App />
</ThemeProvider>
```

## 🎨 Customization

### Adding New Routes
Create a new file in `src/routes/` following the file-based routing convention:

```tsx
// src/routes/about.tsx
export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return <div>About Page</div>;
}
```

### Adding UI Components
Use Shadcn/ui CLI to add new components:

```bash
npx shadcn@latest add [component-name]
```

### Styling
- Modify `src/styles.css` for global styles
- Use Tailwind classes for component styling
- CSS variables are defined for theming

## 🧪 Testing

Run tests with Vitest:

```bash
npm run test
```

## 🚀 Deployment

Build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📚 Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
