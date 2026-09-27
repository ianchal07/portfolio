# Anchal Sharma, portfolio

Static site, no build step. Open `index.html` locally or deploy the folder to GitHub Pages.

- `index.html`: all content
- `css/style.css`: light and dark themes (follows the system setting, with a toggle)
- `scripts/site.js`: theme toggle, mobile menu, hero pipeline animation
- `Anchal_sharma_resume.pdf`: replace with the latest Overleaf export when it changes

The contact form posts to Formspree (`https://formspree.io/f/xrgvqbyk`).

## Adding certifications and awards

The "Certifications and awards" section is hidden until it has at least one entry,
and its menu link appears automatically when it does.

1. Open `index.html` and search for `CERTIFICATION TEMPLATE` or `AWARD TEMPLATE`.
2. Copy the `<li class="recog-item reveal">...</li>` block, paste it above the template
   (outside the `<!-- -->` comment), and fill in the year, name and organisation.
3. For certifications, set the credential link, or delete that line if there isn't one.
4. Order entries newest first.

If only one kind has entries (only certifications, say), that column fills the section
on its own and the empty one stays hidden.

## Visitor stats (GoatCounter)

Stats are off until you add your code.

1. Sign up free at https://www.goatcounter.com and pick a code (for example `anchal`, giving `anchal.goatcounter.com`).
2. In `index.html`, find `<meta name="goatcounter" content="">` and put your code between the quotes: `content="anchal"`.
3. Push. Your dashboard shows page views, where visitors came from, and these clicks:
   `resume-download`, `email-click`, `linkedin-click`, `github-click`, `contact-form-sent`.

## Link preview

`images/og-card.jpg` (1200x630) is the card LinkedIn, WhatsApp and X show when your link is shared.
The tags point to `https://ianchal07.github.io/portfolio/`; update them if the site moves to another address.
After deploying, you can refresh LinkedIn's cached preview with the LinkedIn Post Inspector.

## Now and Availability

- "Now" is just above "Get in touch". Update the three lines and the date every few months.
- Availability rows are in the contact section. Any row left empty is hidden, so fill in
  `Notice period` when you're ready to show it.
