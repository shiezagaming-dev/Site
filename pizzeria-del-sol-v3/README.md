# Pizzeria del Sol — V3

A cinematic React + Vite + Three.js takeaway pizza site. The background is a real WebGL 3D scene that stays behind the full page, continuously rotates and responds to scroll progress: as the visitor scrolls, the pizza shifts position, floating ingredients descend toward it, and the oven glow intensifies. The pizza top uses a real pizza photograph texture; physical 3D crust, sauce, cheese, toppings, ember particles and oven lighting add depth.

## Run in GitHub Codespaces

```bash
cd /workspaces/Site
unzip -o pizzeria-del-sol-v3.zip
cd pizzeria-del-sol-v3
npm install
npm run dev
```

Open port `5173` from the Ports tab. If you already extracted the ZIP, run `cd /workspaces/Site/pizzeria-del-sol-v3` first.

## Included
- Full-screen fixed Three.js background (not a small framed scene)
- Continuous 3D rotation, pointer parallax, floating ember particles, falling ingredient animation and scroll-driven cooking progression
- Real pizza photo assets inspired by the user's supplied pizza references
- Cinematic editorial typography, responsive layout, animated photography and menu cards
- Category filters, add-to-cart, quantity controls, totals, and demo pickup checkout

## Important
The order checkout is a front-end demo only. It does not send orders, collect payments, or contact a real restaurant. Connect a backend and payment provider before taking live orders. Three.js requires WebGL support. The site uses Google Fonts if internet access is available, with serif/sans-serif fallbacks.
