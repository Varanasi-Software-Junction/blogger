# Blogger CRX Asset Pack (v1)

Repository root (GitHub Pages) base:
https://varanasi-software-junction.github.io/blogger/

Files:
- crx_styles_v1.css     -> site CSS (link in theme head)
- crx_ui_v1.js         -> UI loader & helpers (script defer)
- crx_affiliates.json  -> affiliate product collection
- crx_bio.html         -> single 'bio' widget fragment
- crx_donate.html      -> donation fragment
- crx_slider_template.html -> slider card template

How to install:
1. Push these files to the repo root (main branch).
2. Confirm GitHub Pages is enabled and files are accessible via the base URL.
3. In Blogger Theme → Edit HTML:
   - Add in head: <link rel="stylesheet" href="https://varanasi-software-junction.github.io/blogger/crx_styles_v1.css">
   - Add before </body>: <script src="https://varanasi-software-junction.github.io/blogger/crx_ui_v1.js" defer></script>
4. Use placeholders in your post template (single post pages):
   - Affiliates: <div id="crx_affiliate_block" data-crx-widget="affiliate"></div>
   - Bio: <div data-crx-widget="bio"></div>
   - Donate: <div data-crx-widget="donate"></div>

5. Replace affiliate links in crx_affiliates.json with your Amazon Associate tag.
6. Optional: Add avatar file champak-avatar.jpg to repo or change crx_bio.html.

Notes:
- Slider: use crx_initSlider() to initialize Swiper after populating slide container.
- For widget edits, update the fragment HTML file and bump the JS/CSS version querystring in your theme to bust cache.
