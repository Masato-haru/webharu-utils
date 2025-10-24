# WebHaru Utils v1 - Refactored Version

## 🚀 What's New

This is a **complete refactoring** of the WebHaru Utils v1 library with significant improvements in reliability, maintainability, and developer experience.

### Key Improvements

1. **✅ Modern JavaScript**
   - Uses `const` and `let` instead of `var`
   - Arrow functions and template literals
   - Proper scoping and block-level declarations

2. **✅ Modular Architecture**
   - Each feature is in its own module (Pagination, Filter, Sort, etc.)
   - Clean separation of concerns
   - Easy to extend and maintain

3. **✅ Robust Null Safety**
   - Comprehensive null checks before DOM operations
   - Defensive programming patterns
   - No runtime errors from missing elements

4. **✅ Real-time Brand Color Updates**
   - CSS variable `--wu-brand` updates immediately when color changes
   - Live preview in the snippet builder
   - No page reload required

5. **✅ Auto-initialization**
   - `WU.initAll()` automatically detects and initializes available features
   - Re-run `WU.init()` after AJAX/dynamic content loads
   - Idempotent initialization (safe to call multiple times)

6. **✅ Fixed Critical Bugs**
   - **Filter Module**: Fixed undefined `show` variable (was causing filters to fail)
   - **Trim Module**: Fixed undefined `on()` function reference
   - **Hash Sync**: Proper pagination state persistence
   - **Event Delegation**: Consistent event binding patterns

7. **✅ Better Documentation**
   - Extensive inline comments
   - Clear module boundaries
   - Public API documentation

---

## 📦 Installation

### Option 1: Inline (Recommended for Quick Setup)

Add this to your Webflow project's **Footer Code** (Project Settings > Custom Code > Footer Code):

```html
<style>
:root {
  --wu-brand: #005AC8; /* Your brand color */
}
.wu-btn {
  padding: 8px 16px;
  border: 1px solid var(--wu-brand);
  background: white;
  color: var(--wu-brand);
  cursor: pointer;
}
.wu-btn:hover:not(:disabled) {
  background: var(--wu-brand);
  color: white;
}
.wu-btn.is-active, .wu-btn.wu-page.is-active {
  background: var(--wu-brand);
  color: white;
}
.wu-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.wu-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}
.wu-ellipsis {
  padding: 0 4px;
}
</style>

<script src="https://YOUR-DOMAIN.com/assets/webharu-utils.v1.js" defer></script>
```

### Option 2: External File (Recommended for Production)

1. Upload `assets/webharu-utils.v1.js` to your hosting
2. Add to Webflow Footer Code:

```html
<style>
:root { --wu-brand: #005AC8; }
/* Add the CSS from Option 1 above */
</style>

<script src="/path/to/webharu-utils.v1.js" defer></script>
```

### Option 3: CDN via GitHub Pages

After publishing to GitHub Pages:

```html
<script src="https://YOUR-USERNAME.github.io/webharu-utils/assets/webharu-utils.v1.js" defer></script>
```

---

## 🎯 Usage Examples

### 1. Pagination

```html
<!-- Collection List -->
<div class="w-dyn-items" id="news-list" data-wu="paginate" data-wu-per="9">
  <div class="w-dyn-item" data-wu-tags="tech,featured">
    <!-- Item content -->
  </div>
  <!-- More items -->
</div>

<!-- Pagination Controls -->
<div data-wu="pg-controls" data-wu-for="news-list"></div>
```

**Attributes:**
- `data-wu="paginate"` - Marks the collection list
- `data-wu-per="9"` - Items per page (default: 9)
- `data-wu="pg-controls"` - Pagination button container
- `data-wu-for="news-list"` - Links controls to the list by ID

**Custom Labels:**
```html
<div data-wu="pg-controls"
     data-wu-for="news-list"
     data-wu-label-prev="Previous"
     data-wu-label-next="Next"></div>
```

---

### 2. Filter (AND Condition)

```html
<!-- Filter Buttons -->
<button data-wu="filter" data-wu-key="tech" data-wu-scope="#news-list">Tech</button>
<button data-wu="filter" data-wu-key="featured" data-wu-scope="#news-list">Featured</button>

<!-- Filtered List (must have ID or class matching scope) -->
<div id="news-list" data-wu="paginate" data-wu-per="9">
  <div class="w-dyn-item" data-wu-tags="tech,featured">Tech & Featured</div>
  <div class="w-dyn-item" data-wu-tags="tech">Tech Only</div>
  <div class="w-dyn-item" data-wu-tags="featured">Featured Only</div>
</div>
```

**How it works:**
- Click "Tech" → shows only items with `tech` tag
- Click "Featured" → shows only items with BOTH `tech` AND `featured` tags (AND condition)
- Click again to deactivate

---

### 3. Sort

```html
<!-- Sort Buttons -->
<button data-wu="sort" data-wu-key="date" data-wu-order="desc" data-wu-for="news-list">Newest First</button>
<button data-wu="sort" data-wu-key="title" data-wu-order="asc" data-wu-for="news-list">A-Z</button>

<!-- List Items with Sort Data -->
<div id="news-list">
  <div class="w-dyn-item" data-wu-date="2025-01-15" data-wu-title="Breaking News">...</div>
  <div class="w-dyn-item" data-wu-date="2025-01-10" data-wu-title="Another Story">...</div>
</div>
```

**Sort Keys:**
- `date` - Sorts by `data-wu-date` attribute (ISO date format)
- `title` - Sorts by `data-wu-title` attribute (alphabetical)

**Sort Orders:**
- `asc` - Ascending (default)
- `desc` - Descending

---

### 4. Load More

```html
<!-- List -->
<div id="posts" data-wu="loadmore" data-wu-initial="6" data-wu-step="3">
  <div class="w-dyn-item">Post 1</div>
  <div class="w-dyn-item">Post 2</div>
  <!-- More items -->
</div>

<!-- Load More Button -->
<button data-wu="loadmore-btn" data-wu-for="posts">Load More</button>
```

**Attributes:**
- `data-wu-initial="6"` - Show 6 items initially
- `data-wu-step="3"` - Load 3 more items each click

---

### 5. Table of Contents (TOC)

```html
<!-- TOC Container -->
<div data-wu="toc" data-wu-for="#article-body" data-wu-headings="h2,h3"></div>

<!-- Content with Headings -->
<article id="article-body">
  <h2>Introduction</h2>
  <p>Content...</p>

  <h2>Main Topic</h2>
  <h3>Subtopic</h3>
  <p>Content...</p>
</article>
```

**Auto-generated:**
- Creates `<ul>` with links to headings
- Automatically adds IDs to headings if missing
- `h3` gets class `wu-depth-2` for indentation

---

### 6. External Links

```html
<!-- Add to a container -->
<div data-wu="ext-links">
  <a href="https://example.com">External Link</a>
  <a href="/local-page">Internal Link</a>
</div>
```

**Automatic behavior:**
- External links get `target="_blank"` and `rel="noopener"`
- Internal links remain unchanged
- `mailto:` and `tel:` links are ignored

---

### 7. Form Guard (Prevent Double Submit)

```html
<form>
  <!-- Add anywhere inside form -->
  <div data-wu="form-guard"
       data-wu-timeout="10000"
       data-wu-label-sending="Sending..."></div>

  <input type="text" name="email">
  <button type="submit">Submit</button>
</form>
```

**Behavior:**
- Disables submit button on form submission
- Changes button text to "Sending..."
- Re-enables after 10 seconds (default: 10000ms)

---

### 8. UTM Parameters

```html
<form>
  <div data-wu="utm">
    <input type="hidden" name="utm_source">
    <input type="hidden" name="utm_medium">
    <input type="hidden" name="utm_campaign">
  </div>
</form>
```

**Automatic:**
- Reads UTM parameters from URL query string
- Populates matching hidden inputs
- Only fills if input is empty

---

### 9. Video Autoplay (Intersection Observer)

```html
<div data-wu="video">
  <video data-wu-auto src="video.mp4" muted loop></video>
</div>
```

**Behavior:**
- Video plays when 25% visible
- Video pauses when out of view
- Requires `IntersectionObserver` support (modern browsers)

---

### 10. Scrollspy

```html
<!-- Navigation -->
<nav data-wu="scrollspy">
  <a href="#section1" data-wu-link="section1">Section 1</a>
  <a href="#section2" data-wu-link="section2">Section 2</a>
</nav>

<!-- Content Sections -->
<section id="section1" data-wu-spy="section1">...</section>
<section id="section2" data-wu-spy="section2">...</section>
```

**Behavior:**
- Adds `is-active` class to nav link when section is 50% visible
- Automatic scroll highlighting

---

### 11. Text Trim (Read More)

```html
<div data-wu="trim">
  <p class="js-trim" data-wu-max="150" data-wu-label-more="Read more">
    Long text content that will be trimmed at 150 characters...
  </p>
</div>
```

**Behavior:**
- Truncates text at specified character count
- Adds "Read more" button
- Button reveals full text when clicked

---

### 12. Breadcrumbs

```html
<nav data-wu="breadcrumbs" data-wu-label-home="Home"></nav>
```

**Auto-generated from URL:**
- `/blog/tech/article-name` → Home > Blog > Tech > Article Name
- Converts hyphens to spaces
- Decodes URL encoding

---

## 🎨 Brand Color Customization

The refactored version supports **real-time brand color updates** via CSS variables:

```css
:root {
  --wu-brand: #005AC8; /* Change this to your brand color */
}
```

Or programmatically:

```javascript
WU.brandColor('#FF5733');
```

Or via meta tag:

```html
<meta name="wu-brand-color" content="#FF5733">
```

---

## 🔄 Dynamic Content & Re-initialization

After loading content via AJAX or Webflow's native pagination:

```javascript
// Re-initialize all features
WU.init();

// Or use Webflow's callback
Webflow.push(function() {
  WU.init();
});
```

**Safe to call multiple times** - idempotent initialization prevents double-binding.

---

## 🧪 Testing Pagination & Filter

### Test Pagination:
1. Create a collection list with 20+ items
2. Add `data-wu="paginate" data-wu-per="5" id="test-list"`
3. Add controls: `<div data-wu="pg-controls" data-wu-for="test-list"></div>`
4. Click through pages - URL hash should update (`#wu:test-list=2`)
5. Refresh page - should stay on same page

### Test Filter:
1. Add tags to items: `data-wu-tags="tech,featured"`
2. Add filter buttons with `data-wu="filter" data-wu-key="tech" data-wu-scope="#test-list"`
3. Click "Tech" → only tech items show
4. Click "Featured" → only items with BOTH tags show (AND condition)
5. Pagination should recalculate automatically

---

## 📁 File Structure

```
/
├── scripts/
│   ├── src/
│   │   ├── webharu-utils.js              # Original (deprecated)
│   │   └── webharu-utils-refactored.js   # New modular version ✨
│   └── build.js                           # Build script
├── assets/
│   ├── webharu-utils.v1.js               # Minified (17KB)
│   └── webharu-utils.v1.readable.js      # Readable for debugging
└── app/
    └── index.html                         # Snippet Builder UI
```

---

## 🐛 Bug Fixes from Original

| Bug | Original Code | Fixed Code |
|-----|--------------|-----------|
| Filter undefined `show` | `if(show){...}` | `if(shouldShow){...}` |
| Trim undefined `on()` | `on(d,'click',...)` | `o(d,'click',...)` |
| Missing null checks | Direct element access | `if (!element) return;` |
| Inconsistent `var` usage | `var` everywhere | `const`/`let` |
| No hash state validation | Assumed hash exists | `hashGet()` with fallback |

---

## 🚀 Performance

- **Minified size**: 17KB (gzipped: ~6KB)
- **Zero dependencies**: Pure JavaScript
- **Lazy initialization**: Features only initialize if elements exist
- **Event delegation**: Efficient for dynamic content

---

## 🛠 Development

### Build Commands

```bash
# Build minified + readable versions
npm run build

# Run tests (if configured)
npm test
```

### Adding New Features

1. Create a new module in `webharu-utils-refactored.js`:

```javascript
const NewFeatureModule = (() => {
  const init = () => {
    bindFeature('new-feature', (element, dataset) => {
      // Your feature logic
    });
  };

  const initEvents = () => {
    on(doc, 'click', attrSel('new-feature'), function(ev) {
      // Event handlers
    });
  };

  return { init, initEvents };
})();
```

2. Add to `initAll()`:

```javascript
const initAll = () => {
  // ... existing modules
  NewFeatureModule.init();
  NewFeatureModule.initEvents();
};
```

---

## 📞 Support

- **Repository**: https://github.com/YOUR-USERNAME/webharu-utils
- **Documentation**: https://masato-haru.github.io/webharu-utils/
- **Issues**: File bugs on GitHub Issues

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## ✅ Migration Checklist

If upgrading from the old version:

- [ ] Backup your current implementation
- [ ] Replace `webharu-utils.v1.js` with refactored version
- [ ] Test pagination hash sync
- [ ] Test filter AND condition logic
- [ ] Verify brand color CSS variable works
- [ ] Test with Webflow Ajax if used
- [ ] Check console for any warnings
- [ ] Re-run `WU.init()` after dynamic content loads

---

**Happy coding!** 🎉
