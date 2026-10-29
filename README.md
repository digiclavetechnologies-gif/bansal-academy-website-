# The Bansal Academy

A responsive React + Vite website built for The Bansal Academy. The site uses Tailwind CSS, React Router, Framer Motion and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Edit academy details

The public business details and editable content live in one place: [`src/config.js`](./src/config.js). Update the academy's address, phone, course list, optional per-class `timing`, `mode`, and `fee`, reviews, founder information, and confirmed production URL there. Empty course details are intentionally hidden.

The supplied academy logo is used in the header, footer, favicon and social preview image. The founder name, photo, qualifications, experience, story, teaching timeline, vision, and message have not been supplied. Add verified details to the `founder` object when ready.

## Replace the reels

The academy's H.264 MP4 videos and matching posters are included in `public/reels/`. Their Instagram destinations are configured in `src/config.js`. Local videos autoplay muted and loop while visible, pause off screen, and provide a mute control. If a video file is missing, the poster and play control link to its Instagram reel.

## Add verified reviews

Only the two review texts supplied by the academy are currently displayed. Add additional confirmed review text and the reviewer's name (only when permission and attribution are verified) to the `reviews` array in `src/config.js`. Do not infer names or write sample reviews. Motion is disabled for visitors who prefer reduced motion.

## Enquiries and privacy

The enquiry form validates Indian mobile numbers and opens WhatsApp with the student's details prefilled. The form does not store submissions on this website. The optional `formspreeEndpoint` in `src/config.js` is reserved for a future, explicitly configured form backend; no endpoint is currently active. For students under 18, a parent or guardian should submit the form.

## Production setup

Before a future custom-domain launch, set `config.siteUrl` in `src/config.js` and update `public/sitemap.xml` and `public/robots.txt` to that canonical domain. The current production deployment uses `https://the-bansal-academy.vercel.app`. Verify that the hosting provider supports the SPA fallback for React Router; Vercel does so for Vite deployments. Review the Content Security Policy in `vercel.json` if hosting integrations or assets change. The app uses Google Fonts and the Google Maps embed, so those hosts are allowed by the policy.

Deploy the repository to Vercel and use the Vite build defaults (`npm run build`, output directory `dist`). No API keys, secrets, payment flow, or database are required.
# bansal-academy-website-
