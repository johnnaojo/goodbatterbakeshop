# goodbatterbakeshop.github.io

Static website for Good Batter Bakeshop, designed to run on GitHub Pages.

## Pages

- `index.html` - Home page
- `about.html` - Bakery summary and reviews
- `gallery.html` - Featured gallery with clickable thumbnails
- `contact.html` - Contact details and order request email form

## Theme

The site is locked to the `Pastel Patisserie` theme with the `assets/images/GBB-Circle.png` logo used across the navigation and brand areas.

## Adding gallery images

To add photos:

1. Upload image files into `assets/gallery/`
2. Ensure the file name matches the title you want the image to have; e.g. science-themed-chocolate-cake.jpg => "Science Themed Chocolate Cake"
3. Commit and push to GitHub
4. The gallery page will load those files automatically from the GitHub repository API

Supported formats include `png`, `jpg`, `jpeg`, `webp`, `gif`, and `svg`.

If the folder is empty or the API is unavailable, the site falls back to a small set of local gallery images already included in the repo.
