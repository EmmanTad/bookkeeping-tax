# Bookkeeping and Tax Services — static website

Plain HTML + CSS + JavaScript, styled with Tailwind CSS v4 (loaded from CDN).

- Open `index.html` in any browser — no build step needed.
- `css/styles.css` — animations (word-by-word hero headline, drifting hero glow, scroll reveal, card/icon hover, button shine, parallax images, scroll progress bar, menu transitions). Respects `prefers-reduced-motion`.
- `js/main.js` — mobile menu, Services dropdown, auto scroll-reveal on every page, hero headline split, parallax, scroll progress, number counters, back-to-top, contact form.
- Brand colors/fonts live in the `<style type="text/tailwindcss">` block of each page.
- To host: upload the whole folder to any static host (Netlify, GitHub Pages, cPanel, etc.).

Note: the contact form only shows a thank-you message; connect it to a form service
(e.g. Formspree) by setting the form's `action` and removing the submit handler in main.js.
