# 📘 Product Design Specification  
**Project**: John Robinson Freelance Website  
**Type**: Personal Portfolio & Service Landing Page  
**Owner**: John Robinson (Freelance Developer & Systems Consultant)  
**Date**: April 2025  
**Version**: 1.0

---

## 🔍 1. Purpose  
To establish an online presence for John Robinson as a freelance developer and consultant. The site will act as a **lead generation tool**, **portfolio showcase**, and **conversion funnel** for service-based work.

---

## 🎯 2. Objectives  

- Clearly communicate John’s skillset and unique positioning.
- Generate high-quality client leads through clear service offerings.
- Display portfolio projects in a credible, professional format.
- Make it easy for potential clients to contact or book John.
- Enable SEO- and link-friendly sharing (e.g. Upwork, LinkedIn, job boards).

---

## 👥 3. Target Audience  

- Small business owners (especially e-com or print-on-demand).
- Coaches, consultants, and remote-first teams.
- Startup founders needing MVPs or internal tools.
- Independent tutors, tuition centres, and edtech providers.
- Hobbyist or niche game devs (e.g., card game designers).

---

## 📄 4. Site Structure  

### **Homepage**  
- Hero: Value proposition + CTA  
- Summary of core services  
- Testimonials (if available)  
- Preview of portfolio projects  
- About Me  
- Contact CTA

### **Pages/Sections**  
1. **Services**  
   - Automation & Internal Tools  
   - Web App Development  
   - Notion & Productivity Systems  
   - EdTech & Tutoring Systems  
   - Game Logic Tools  

2. **Portfolio**  
   - Case studies or cards for TCQuick, BullSheet, MTG Analyzer, etc.  
   - Optional: Tag filters (Tech Used, Sector, Scope)

3. **About Me**  
   - Background and philosophy  
   - Skills and tech stack  
   - Link to CV or resume (PDF or page)  

4. **Contact**  
   - Embedded form  
   - Email and optional Calendly link  
   - Social media links (LinkedIn, GitHub, etc.)

---

## 🧩 5. Features & Functional Requirements  

| Feature | Description |
|--------|-------------|
| Responsive Design | Must work on desktop, tablet, and mobile |
| Service Cards | Clickable blocks that expand or link to service detail |
| Portfolio Grid | Display case studies or projects with tags |
| Contact Form | Email notification + success confirmation |
| SEO Metadata | Titles, descriptions, Open Graph, canonical links |
| Analytics | Google Analytics or Plausible |
| Performance Metrics | Lighthouse ≥ 90 across categories |
| Dark Mode (optional) | Theme toggle with persistence |
| CMS (optional) | For blogs, updates, or project additions |

---

## 🛠 6. Technical Stack Recommendations  

| Stack Area | Tool |
|------------|------|
| Framework | Next.js or Astro (for SSR and performance) |
| Styling | Tailwind CSS |
| Deployment | Vercel or Netlify |
| Forms | Formspree, Netlify Forms, or EmailJS |
| CMS (Optional) | Notion (via Super), Sanity, or MDX content |
| Analytics | Plausible (privacy friendly), or GA |
| Domain | `johnlindon.com` (already owned) |

---

## 🧪 7. Non-Functional Requirements  

- **Performance**: Fast initial load (<1.5s); lazy loading for images  
- **Accessibility**: WCAG 2.1 AA compliance  
- **Maintainability**: Easy to update content, ideally with markdown or CMS  
- **Security**: No client-side API keys exposed; form handling must use secure endpoint  
- **Privacy**: GDPR-compliant (if using contact forms or analytics)

---

## 📅 8. Timeline & Milestones  

| Phase | Deliverable | Target Date |
|-------|-------------|-------------|
| Planning | PDS, content finalization | Week 1 |
| Design | Layout mockups / wireframes | Week 2 |
| Development | MVP build (responsive + homepage) | Week 3 |
| Testing | QA across devices & browsers | Week 4 |
| Launch | Deploy to `johnlindon.com` | Week 5 |
| Post-launch | Analytics + portfolio updates | Ongoing |

---

## 📎 9. Assets Needed  
- Headshot or avatar for “About Me”  
- Logos/screenshots from projects (e.g., TCQuick UI, BullSheet dashboard)  
- Testimonial quotes (if available)  
- Calendar booking link (Calendly or similar)  
- Email address for contact forms  
- Optional blog content or case studies

---

## ✅ 10. Success Criteria  
- At least 3 inquiries in the first month post-launch.  
- Portfolio includes 3+ strong, detailed case studies.  
- Website speed and accessibility scores ≥ 90.  
- Minimal bounce rate and high contact conversion from service pages.
