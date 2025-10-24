# WebHaru Utils v1

A lightweight JavaScript utility library for Webflow that provides 12 essential features using only Custom Attributes.

## Features

- **Pagination** - Client-side pagination with customizable items per page
- **Filter** - AND-condition filtering for collection items
- **Sort** - Sort by date or title (ascending/descending)
- **Load More** - Progressive content loading
- **Table of Contents** - Auto-generated navigation from headings
- **External Links** - Automatic `target="_blank"` and `rel="noopener"` for external links
- **Form Guard** - Prevent multiple form submissions
- **UTM Parameters** - Auto-populate form fields with UTM parameters
- **Video Autoplay** - Intersection Observer-based video autoplay
- **Scrollspy** - Active navigation based on scroll position
- **Text Trim** - Truncate long text with "Read more" button
- **Breadcrumbs** - Auto-generated breadcrumb navigation

## Demo

Visit the Snippet Builder to generate custom code snippets:

[Open Snippet Builder](app/index.html)

## Quick Start

1. Copy the generated snippet from the Snippet Builder
2. Paste it into your Webflow project:
   - **Site-wide**: Project Settings > Custom Code > Footer Code
   - **Page-specific**: Page Settings > Footer Code

3. Add the appropriate `data-wu` attributes to your elements

## Documentation

- [Japanese Documentation](docs/README-ja.md)
- [Changelog](docs/CHANGELOG.md)

## Usage Example

### Pagination

```html
<!-- Collection List -->
<div class="w-dyn-items" id="news-list" data-wu="paginate" data-wu-per="9">
  <div class="w-dyn-item">...</div>
  <!-- More items -->
</div>

<!-- Pagination Controls -->
<div data-wu="pg-controls" data-wu-for="news-list"></div>
```

### External Links

```html
<div data-wu="ext-links">
  <a href="https://example.com">External Link</a>
  <!-- Will automatically get target="_blank" and rel="noopener" -->
</div>
```

## File Structure

```
/
├── app/              # Snippet Builder application
│   ├── index.html    # Main application
│   ├── app.js        # Builder logic
│   ├── app.css       # Builder styles
│   └── templates/    # Sample HTML templates
├── assets/           # Built library files
│   └── webharu-utils.v1.js
├── scripts/          # Build scripts
│   ├── build.js      # Build script
│   ├── test.js       # Test script
│   └── src/          # Source code
│       └── webharu-utils.js
├── docs/             # Documentation
│   ├── README-ja.md  # Japanese documentation
│   ├── CHANGELOG.md  # Version history
│   └── llms.txt      # AI prompt fragments
└── tests/            # Test files

```

## Build

```bash
npm run build
```

This will compile the source code from `scripts/src/` to `assets/webharu-utils.v1.js`.

## Test

```bash
npm run test
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for IntersectionObserver if needed)

## License

MIT

## Author

WebHaru Utils v1

## Contributing

This is a utility library for Webflow projects. Feel free to fork and customize for your needs.
