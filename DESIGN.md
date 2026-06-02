---
name: Station CHARAFATE Management System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5e3f3c'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#936e6a'
  outline-variant: '#e8bcb7'
  surface-tint: '#c00015'
  primary: '#bb0014'
  on-primary: '#ffffff'
  primary-container: '#e71421'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4ac'
  secondary: '#8c4f00'
  on-secondary: '#ffffff'
  secondary-container: '#fd9923'
  on-secondary-container: '#663800'
  tertiary: '#ba0916'
  on-tertiary: '#ffffff'
  tertiary-container: '#de2d2c'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#ffdcbf'
  secondary-fixed-dim: '#ffb874'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6b3b00'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ac'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000d'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-bold:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Barlow Condensed
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  touch-target-min: 44px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  container-max: 1440px
---

## Brand & Style
The design system for this gas station management platform is built on an **Industrial-Professional SaaS** aesthetic. It prioritizes high-performance utility, rugged reliability, and immediate clarity under high-glare conditions common in forecourt environments.

The style is characterized by **High-Contrast Minimalism** mixed with **Industrial Precision**. It utilizes heavy verticality in its display typography to mirror the architectural signage of the station, balanced against a highly functional, accessible body system for complex data entry and logistics management.

**Target Audience:** Station managers, forecourt supervisors, and back-office administrators in the Moroccan energy sector.
**Emotional Response:** Efficient, authoritative, robust, and technologically advanced.

## Colors
This palette leverages the iconic TotalEnergies identity while optimizing for a management software context.

- **Primary Red (#EE1C25):** Used strictly for primary calls-to-action, branding elements, and critical interaction points.
- **KPI Orange (#F7941D):** Reserved for highlights, secondary metrics, and warning-state gauges.
- **Neutral Stack:** A combination of Deep Black (#1A1A1A) for navigation structures and Dark Gray (#3A3A3A) for secondary containers ensures depth. Surface White (#FFFFFF) provides maximum contrast for data tables and forms.
- **Functional Logic:** The palette follows a strict hierarchy where red signifies action or danger, orange signifies attention, and dark neutrals provide the industrial scaffolding.

## Typography
The typography system is split into two distinct functional roles:

1.  **Display & Headers (Barlow Condensed):** A high-impact, condensed sans-serif that maximizes horizontal space in data-heavy headers. Used exclusively for titles, KPI labels, and navigation. All headers should be set in Uppercase to maintain the industrial "signage" look.
2.  **Interface & Body (DM Sans):** A modern, geometric sans-serif with a high x-height for readability on screens. This handles all tabular data, form labels, and descriptive text.

**Emphasis:** Use font weight over color for hierarchy to ensure readability in bright sunlight.

## Layout & Spacing
The layout uses a **12-column Fluid Grid** for content areas, anchored by a fixed **Dark Sidebar** (280px).

- **Spacing Rhythm:** Based on an 8px base unit (8, 16, 24, 32, 48, 64).
- **Touch Fidelity:** All interactive elements (buttons, inputs, list items) must maintain a minimum height of 44px to accommodate gloved or rapid touch input in a station environment.
- **Density:** Data tables use "Compact" spacing (8px cell padding) while dashboard cards use "Relaxed" spacing (24px internal padding) to separate key metrics visually.

## Elevation & Depth
This system uses **Structural Layering** rather than traditional soft shadows.

- **Surface Levels:** The background is light gray (#F5F5F5), while primary cards are pure white (#FFFFFF).
- **Accent Stripes:** Every primary card/module features a 4px solid top-border (accent stripe). Color-code these: Red for critical/actions, Orange for analytics, Dark Gray for general info.
- **Shadows:** Use a single, sharp shadow level for floating elements (modals/popovers): `0px 4px 12px rgba(0, 0, 0, 0.15)`. Avoid shadows on standard cards to maintain a clean, flat industrial look.
- **Sidebar Depth:** The sidebar is visually "sunken" using the Deep Black (#1A1A1A) color, creating a clear functional boundary.

## Shapes
The shape language is **Engineered & Precise**. 

- **Standard Radius:** 8px (`rounded-md`) for cards and input fields to soften the industrial edge while remaining professional.
- **Button Radius:** A tighter 2px radius is used for primary buttons to give them a "mechanical" and "sturdy" feel, differentiating them from container shapes.
- **Gauges:** Fuel level indicators should be semi-circular or linear with flat caps to reinforce the technical nature of the software.

## Components
- **Buttons:** Bold, uppercase labels using Barlow Condensed. Primary buttons use the Total Red (#EE1C25) background with white text. High contrast is mandatory.
- **Gauges:** Circular or vertical bar gauges for fuel levels. 
    - *Critical:* <20% volume (Red + Pulse animation).
    - *Warning:* 20-40% (Orange).
    - *Optimal:* >40% (Green).
- **Sidebar:** Dark theme (#1A1A1A). Active states use a solid 4px left-border in Total Red with a subtle #FFFFFF10 background tint on the row.
- **Data Tables:** High-density, zebra-striped using Light Gray (#F9F9F9). Header rows must be Dark Gray (#3A3A3A) with white uppercase text.
- **Inputs:** 1px solid border (#B0A99A). On focus, border thickens to 2px and changes to Total Red.
- **Chips/Badges:** Square-edged (2px radius) to match buttons. Used for status indicators like "Fuel Delivery Pending" or "Pump Active."