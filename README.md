# Vastra by Varahi

Responsive saree and dress boutique with a burgundy and ivory visual identity, locally hosted Outfit and Plus Jakarta Sans fonts, and readable dark text.

## Run locally

Install Node.js 20 or newer:

    npm install
    npm run dev

Open http://localhost:4173. Stop with Ctrl+C. The server also listens on your local network; a phone on the same Wi-Fi can use the computer's local IP and port 4173 if Windows Firewall permits it. Use the deployed URL from any network.

This is a static website with no build step. Deployment files are in dist/. Set the PORT environment variable to change the local port.

## Features

- Category and occasion filters, search, price sorting and product details.
- Dress sizes, shopping bag, quantity controls and mobile shopping bar.
- WhatsApp ordering to +91 8341676998 with items, sizes, quantities and estimated total.
- FAQs, direct WhatsApp questions and telephone contact.
- No customer database, forms, analytics, cookies, localStorage or sessionStorage. The bag is in memory and clears on refresh. WhatsApp opens an editable message for the visitor to send.

The eight collection entries and prices are illustrative content. Visitors are asked to confirm actual photos, availability, fabric, delivery and final prices on WhatsApp.

## GitHub Pages

.github/workflows/pages.yml publishes dist/ on pushes to main. Select GitHub Actions as the source in repository Settings > Pages before the first deployment. All asset paths support the repository subpath /vastra/.

## Verification

    npm run check
    node verify.mjs

Browser verification uses Playwright and Microsoft Edge. Set BROWSER_PATH for another compatible browser. Checks cover seven viewport sizes, local fonts, normal text contrast, shopping and WhatsApp flows, keyboard dismissal, mobile controls, FAQs and no persistent storage. The test server uses port 4174 and stops after checking.

## Asset provenance

Logo: website-ready reproduction of the supplied reference, made using the built-in image generation tool. The original attachment file was unavailable locally. The prompt preserved the full artwork, lettering, proportions and burgundy/gold colours. Saved at dist/assets/logo.png.

Photography: Unsplash for the festive saree and dresses; Tata CLiQ for the pink saree; MySilkLove for cotton sarees; Pernia's Pop-Up Shop for ivory organza; Zilikaa for the gold saree. Source URLs are in download-assets.mjs. These are styling references, not confirmed inventory.

Fonts: Outfit and Plus Jakarta Sans from Google Fonts, under the SIL Open Font License. See dist/assets/font-licenses.txt.

## Phone experience

The dedicated dist/mobile.css layout applies at 600px and below: a compact editorial hero, first-screen category row, always-visible search, two-column shopping cards, swipeable occasion edits, four-item bottom navigation, and full-screen product and bag views. Mobile search stays in sync with collection filters and desktop search. All customer selections remain in memory only.
