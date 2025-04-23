**Dynamic Implementation Decisions – johnlindon.com**

---

### ✅ Global Effects

- **Parallax Effect on Hero Logo:**
  - Subtle scroll-based parallax.
  - Logo moves slightly slower than scroll speed.
  - Scale remains constant to avoid overpowering layout.

- **Alternating Section Background Tints:**
  - Even sections: `#f5f3f8` (light purple tint)
  - Odd sections: `#fcfbfd` (near-white)
  - Purpose: improves visual flow and distinguishes content areas.

- **Navbar Indicator Animation:**
  - **Default**: Underline under current nav item.
  - **Hover**: Underline shrinks into a dot, travels across nav, expands to underline.
  - Uses transform scale/translate with smooth cubic-bezier timing.

---

### ✅ Services Page Wireframe Decisions

- **Structure**:
  - Left: Scroll-synced **Sidebar Navigation**
  - Right: Stacked service **Feature Cards**

- **Sidebar**:
  - Sticky on scroll
  - Each item has optional icon, label
  - Currently active item:
    - Enlarges slightly
    - Changes to accent color or background
    - Optionally shows an indicator arrow

- **Cards (Full Section)**:
  - Left: Service image or symbolic graphic
  - Right: Text block:
    - `Service Name`
    - One-liner summary
    - **What is it?**
    - **What do I deliver?** (bulleted list)
    - **Who is it for?**
    - Tags list
    - `Add to Enquiry` button (ghost or primary)
  - Alternating background tints like global sections

---

Let me know when we spec the blog or enquiry flow.

# Summary of Day 1

Absolutely—here’s a summary of what you’ve accomplished today on the **johnlindon.com** Figma wireframe and design system:

---

### ✅ **Visual Identity & Navigation**
- **Logo**: Built in Figma with typographic styling using Manrope, featuring a custom underline and dot flourish.
- **Navbar**: 
  - Finalised layout and spacing.
  - Settled on **active page underline** animation that travels and expands.
  - Decided to avoid hover underlines but keep animated indicator.

---

### ✅ **Hero Section**
- **Structure**:
  - Headline (2-line), supporting text, two CTAs.
  - Tagline with blinking cursor (e.g. `Specialising in #React |`)—potential for dynamic rotation.
  - Background: large abstract "J" logo with **parallax scroll effect** planned.
- **Style**: Strong spacing, responsive layout, and clean call-to-action alignment.

---

### ✅ **Services Section**
- **Card design**: Refined with:
  - Icon, title, description, tags, and action button.
  - Accent line and background pattern for visual consistency.
  - Size, padding, and radius decisions locked in.
- **Layout**: Grid of 3 cards with section tint to help break up visual space.

---

### ✅ **Featured Work Section**
- **New layout** to distinguish from service cards:
  - Side-by-side media and description split.
  - Tags and “Learn More” button.
  - Alternating tint background for rows.
- **Inspirations**: Transistor.fm style featured works.

---

### ✅ **Dynamic Effects Planning**
- **Parallax scroll** on hero logo.
- **Animated tagline** with rotating specialisations.
- **Navbar indicator** animation (expands/shrinks between nav links).

---

### ✅ **Services Page Wireframe**
- **Structure**:
  - Repeated service blocks with enhanced content: "What is it?", "What do I deliver?", "Who is it for?"
  - “Add to Enquiry” buttons per block.
  - Sticky or interactive **service index sidebar** for jumping between entries.
- **Purpose**: Deep-dive per service while keeping a clean, intuitive layout.

---

### ✅ **Implementation Plan (Documented)**
- You created a **markdown spec doc** that includes all dynamic and visual decisions, meant to guide final build.

---

You made **massive progress today**—you’ve got a coherent visual identity, strong design system, and a clear implementation strategy. Taking a break is well earned.

Let me know when you're back and ready to pick it up—next natural steps would be blog page, enquiry process, and mobile responsiveness.

Enjoy your food 🍜