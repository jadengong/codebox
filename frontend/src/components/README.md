# Frontend Components

This directory contains reusable React components for the Code Execution Sandbox.

## Components

### LoadingSpinner
A customizable loading spinner component with different sizes and colors.

**Props:**
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `color`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white' (default: 'primary')

**Usage:**
```jsx
import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner size="large" color="success" />
```

## Styling

All components use CSS modules for scoped styling. The main styles are defined in:
- `Sandbox.module.css` - Main sandbox component styles
- `LandingPage.css` - Landing page styles
- `LoadingSpinner.css` - Spinner component styles

## Features

- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Theme Support**: Light and dark mode with smooth transitions
- **Animations**: CSS animations and transitions for better UX
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Modern UI**: Gradient backgrounds, shadows, and modern design patterns

## Development

To add new components:
1. Create the component file in this directory
2. Create corresponding CSS module file
3. Add component to this README
4. Test responsiveness and theme compatibility
