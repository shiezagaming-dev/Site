# Pizzeria del Sol — cinematic takeaway website

A responsive React + Vite website for a fictional pizza takeaway brand. The design uses the user's supplied pizza photos, warm orange accents, editorial serif typography, animated photo treatments, scroll reveals, menu filters, pizza customisation, a working client-side cart, and a demo pickup checkout.

## Run locally / in GitHub Codespaces

```bash
npm install
npm run dev
```

Open port 5173 in Codespaces. For a production build:

```bash
npm run build
```

## What's working
- Responsive landing page, menu, brand story, takeaway section and footer
- Menu category filters
- Pizza size and extra topping customisation
- Cart add/remove quantity and live subtotal
- Demo pickup form and confirmation state
- CSS photo motion, animated ticker, reveal transitions, hover zooms, reduced-motion support
- User-provided pizza photos bundled locally under `src/assets`

## Before using this for a real restaurant
Checkout is intentionally a demo: it does not transmit orders, reserve pickup slots, or take payment. Add a backend/API, validated order persistence, real opening hours and address, and a payment provider before accepting real orders. Replace sample menu details/prices as needed.
