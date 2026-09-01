---
name: Lumina Learning
colors:
  surface: '#fbf8ff'
  surface-dim: '#d8d8f1'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#edecff'
  surface-container-high: '#e6e6ff'
  surface-container-highest: '#e0e0fa'
  on-surface: '#181a2c'
  on-surface-variant: '#464555'
  inverse-surface: '#2d2f42'
  inverse-on-surface: '#f1efff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#4849da'
  primary: '#4343d5'
  on-primary: '#ffffff'
  primary-container: '#5d5fef'
  on-primary-container: '#faf7ff'
  inverse-primary: '#c1c1ff'
  secondary: '#5557a0'
  on-secondary: '#ffffff'
  secondary-container: '#aeafff'
  on-secondary-container: '#3e3f87'
  tertiary: '#2e5f76'
  on-tertiary: '#ffffff'
  tertiary-container: '#497890'
  on-tertiary-container: '#f2f9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2e2bc2'
  secondary-fixed: '#e1dfff'
  secondary-fixed-dim: '#c1c1ff'
  on-secondary-fixed: '#0f0d5a'
  on-secondary-fixed-variant: '#3d3e87'
  tertiary-fixed: '#c1e8ff'
  tertiary-fixed-dim: '#9dcde7'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#174c62'
  background: '#fbf8ff'
  on-background: '#181a2c'
  surface-variant: '#e0e0fa'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

This design system targets Gen-Z learners through a high-end, contemporary EdTech aesthetic. The visual narrative balances the rigor of academic excellence with a welcoming, approachable atmosphere.

The design style is **Modern / Minimalist** with a subtle **Tactile** influence. It prioritizes clarity and focus, utilizing generous whitespace to reduce cognitive load. The emotional response should be one of "calm productivity"—where the interface feels like a supportive mentor rather than a rigid institution. High-quality typography and a refined color palette elevate the experience from a standard utility to a premium educational service.

## Colors

The palette is built on a foundation of **Off-White (#FCFCFD)** and **White (#FFFFFF)** to ensure a clean, airy environment. 

- **Primary:** A sophisticated "Intelligence Blue" used for primary actions and critical focus states.
- **Accents:** A collection of soft pastels (Lavender, Mint, Peach, Powder Blue) are used for category coding, progress indicators, and decorative backgrounds to maintain a friendly and motivating vibe.
- **Typography:** Headlines and primary body text use a deep **Dark Navy (#1A1C2E)** to ensure high contrast and readability against the pastel accents.
- **Semantic:** Use Mint for "Success/Completed," Peach for "Urgent/Warning," and Powder Blue for "Information/New."

## Typography

The typography system uses a pairing of **Plus Jakarta Sans** for headlines to provide a modern, friendly character, and **Inter** for body text to ensure maximum legibility during long reading sessions.

- **Headlines:** Use Bold or Extra Bold weights for clear information hierarchy.
- **Body Text:** Stick to Regular weight for content-heavy sections. Use Medium for sub-headers within body text.
- **Labels:** Small caps or slightly increased letter spacing should be applied to `label-bold` for metadata and category tags to distinguish them from standard prose.

## Layout & Spacing

Designed for **Mobile-First** interaction, the system utilizes a 4-column fluid grid with 20px side margins and 16px gutters.

- **Vertical Rhythm:** Follow an 8px scale. Group related elements with 8px or 12px; separate distinct sections with 32px or 48px.
- **Touch Targets:** Minimum touch target size is 44x44px.
- **Safe Areas:** Ensure content respects the notch and home indicator areas on modern mobile devices.
- **Content Stacks:** Use vertical stacks for lesson lists and horizontal carousels for course recommendations to maximize the limited horizontal real estate.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Soft Ambient Shadows**. The system avoids heavy drop shadows to maintain its clean, premium feel.

- **Level 0 (Base):** Off-white background.
- **Level 1 (Cards):** White surface with a 1px border (#F0F0F5). No shadow.
- **Level 2 (Active/Floating):** White surface with a very soft, diffused shadow (Blur: 20px, Y: 4px, Color: #1A1C2E @ 4% opacity).
- **Overlays:** Use a 40% opacity blur (backdrop-filter: blur(8px)) for modals and navigation drawers to maintain context of the underlying content.

## Shapes

The shape language is consistently **Rounded**, reinforcing the "Friendly" brand personality.

- **Standard Elements:** Buttons, input fields, and small cards use a **0.5rem (8px)** radius.
- **Large Containers:** Content sections and main cards use a **1rem (16px)** radius.
- **Interactive Pill:** Use fully rounded (pill-shaped) borders for tags, chips, and the primary search bar.
- **Progress Bars:** Use a 100px radius for caps to create a soft, continuous look.

## Components

### Buttons
- **Primary:** Solid Primary Blue with white text. Pill-shaped or 8px rounded.
- **Secondary:** Lavender background with Primary Blue text. No border.
- **Ghost:** Transparent background with Primary Blue border (1px) or text-only.

### Cards
- White background, 1px light border, 16px padding. 
- Use the pastel accent colors as top-border strips (4px) or background tints for icons within the card to denote categories (e.g., "Mathematics" gets a Blue tint).

### Progress Indicators
- **Bars:** 8px height. The "track" is a very light grey or the pastel background; the "indicator" is the primary color or a vibrant success green.
- **Circular:** For lesson completion, use a stroke-width of 4px for a delicate, modern look.

### Input Fields
- 48px height minimum. 1px border (#E2E2E9). 
- Active state: Border becomes Primary Blue with a 2px outer "halo" in the lavender accent color (20% opacity).

### Chips/Tags
- Small, pill-shaped. Background uses the pastel palette (e.g., Peach for "Expert Level," Mint for "New"). Text color should be a darker version of the background for contrast.

### Charts & Data
- Use clean line charts with 2px stroke width. 
- Data points should be rounded. 
- Area charts should use a vertical gradient from the accent color to transparent.