# Demo Styling System

This directory contains the comprehensive styling system for the Kiroween demo mode.

## Files

- **demo.css** - Main demo styling file with all visual enhancements
- **demo-test.html** - Test page to preview all demo styles

## Features

### 1. Particle Effects
- Floating particle animations for dramatic effects
- Particle burst effects for emphasis
- Configurable particle colors and trajectories

### 2. Glowing Effects
- Pulsing glow animations
- Static glow effects
- Hover-triggered glows
- Customizable glow intensity

### 3. Smooth Transitions
- Fade in/out animations
- Slide in from all directions
- Scale in effects
- Smooth state transitions

### 4. Loading Animations
- Spinning loader with glow effect
- Animated dots for loading text
- Progress bar with shine effect

### 5. Component Styling

#### Theme Showcase
- Side-by-side comparison panels
- Highlighted transformations
- Hover tooltips showing original text
- Smooth panel transitions

#### Statistics Display
- Animated counter effects
- Glowing statistics cards
- Breakdown visualization
- Hover effects with tooltips

#### Intro Screen
- Dramatic logo animations
- Gradient text effects
- Pulsing button with ripple effect

### 6. Presentation Mode
- 1.5x font scaling for projector visibility
- High contrast colors for better readability
- Hidden non-essential UI elements
- Enhanced glow effects

### 7. Responsive Design
- Optimized for large displays (projectors)
- Tablet landscape support
- Mobile-friendly layouts
- Adaptive grid systems

## CSS Variables

The styling system uses CSS custom properties for easy customization:

```css
--demo-glow-primary: #8a2be2;
--demo-glow-secondary: #9370db;
--demo-particle-color: #ba55d3;
--demo-highlight: #ff00ff;
--demo-success: #00ff00;
--demo-font-scale: 1;
--demo-spacing-scale: 1;
```

## Usage

### In HTML
```html
<link rel="stylesheet" href="../demo/styles/demo.css">
```

### Applying Effects

#### Particle Effects
```html
<div class="particle-container">
  <div class="particle" style="--tx: 100px; --ty: -100px;"></div>
</div>
```

#### Glowing Effects
```html
<button class="glow-pulse">Glowing Button</button>
<div class="glow-hover">Hover for glow</div>
```

#### Transitions
```html
<div class="fade-in-up">Animated content</div>
<div class="slide-in-left">Sliding content</div>
```

#### Loading
```html
<div class="demo-loading-spinner"></div>
<p class="demo-loading-text">Loading</p>
```

## Presentation Mode

Activate presentation mode by adding the class to body:

```javascript
document.body.classList.add('presentation-mode');
```

This will:
- Scale fonts by 1.5x
- Increase spacing by 1.3x
- Hide control sections
- Enhance contrast for projectors
- Strengthen glow effects

## Accessibility

The styling system respects user preferences:

- **Reduced Motion**: Animations are disabled when `prefers-reduced-motion` is set
- **High Contrast**: Enhanced borders and colors in high contrast mode
- **Print**: Demo components are hidden in print mode

## Browser Compatibility

Tested and optimized for:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

All animations use:
- CSS transforms for hardware acceleration
- RequestAnimationFrame for smooth animations
- Efficient selectors to minimize repaints
- Optimized keyframe animations

## Testing

Open `demo-test.html` in a browser to preview all styling effects and verify they work correctly.

## Integration

The demo styles are automatically loaded when the demo mode is active. They extend the base application styles without overriding core functionality.
