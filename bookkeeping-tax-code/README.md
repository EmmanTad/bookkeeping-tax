# Bookkeeping and Tax Services — static website

Plain HTML + CSS + JavaScript, styled with Tailwind CSS v4 (loaded from CDN).

- Open `index.html` in any browser — no build step needed.
- `css/styles.css` — animations (fade-up hero, scroll reveal, card hover, menu transitions).
- `js/main.js` — mobile menu, Services dropdown, scroll reveal, number counters, back-to-top, contact form.
- Brand colors/fonts live in the `<style type="text/tailwindcss">` block of each page.
- To host: upload the whole folder to any static host (Netlify, GitHub Pages, cPanel, etc.).

Note: the contact form only shows a thank-you message; connect it to a form service
(e.g. Formspree) by setting the form's `action` and removing the submit handler in main.js.
