# Vastra by Varahi

Responsive, static saree and dress storefront. Open `dist/index.html` directly, or run `npm start` and visit `http://localhost:4173`.

Collection filtering, search, price sorting, product dialogs, dress sizes, in-memory shopping bag, and WhatsApp ordering to +91 8341676998. No database, customer form, analytics, cookies, localStorage, or sessionStorage. Refreshing clears the bag. WhatsApp messages remain editable before sending.

The eight collection entries and prices are illustrative content, with a customer-facing instruction to confirm actual photos, availability, fabric and final pricing on WhatsApp.

Logo: website-ready reproduction of the supplied reference using the built-in image generation tool. Prompt: preserve the full supplied Vastra by Vaarahi logo, illustration, lettering, proportions and burgundy/gold colours; prepare a website-ready copy without redesign. Saved at `dist/assets/logo.png`. The original attachment file was unavailable to the local workspace.

Photography sources: Unsplash for the hero, festive saree and dresses; Tata CLiQ for the pink saree; MySilkLove for cotton sarees; Pernia's Pop-Up Shop for ivory organza; Zilikaa for the gold saree. Source image URLs are recorded in `download-assets.mjs`. These are styling references, not confirmed store inventory.

Run `npm run check` for JavaScript syntax. `verify.mjs` uses Playwright with an installed Microsoft Edge to check four viewport sizes, shopping interactions, image loading, WhatsApp message composition and absence of persistent browser storage. Install Playwright separately if repeating browser verification.
