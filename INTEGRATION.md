# WebHaru Utils v1 - Integration Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Add to Webflow Footer

Go to **Project Settings > Custom Code > Footer Code** and paste:

```html
<style>
:root { --wu-brand: #005AC8; } /* Your brand color */

.wu-btn {
  padding: 10px 16px;
  border: 2px solid var(--wu-brand);
  background: white;
  color: var(--wu-brand);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.wu-btn:hover:not(:disabled) {
  background: var(--wu-brand);
  color: white;
}

.wu-btn.is-active,
.wu-btn.wu-page.is-active {
  background: var(--wu-brand);
  color: white;
}

.wu-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.wu-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.wu-ellipsis {
  padding: 0 8px;
  color: #999;
}

.wu-info {
  padding: 0 12px;
  font-weight: 600;
}
</style>

<script src="https://masato-haru.github.io/webharu-utils/assets/webharu-utils.v1.js" defer></script>
```

### Step 2: Add Data Attributes

Add `data-wu` attributes to your Webflow elements. See examples below.

### Step 3: Publish

Click **Publish** in Webflow. Done! ✅

---

## 📋 Usage Examples

### Pagination

**Collection List:**
1. Add ID to collection wrapper (e.g., `news-list`)
2. Add attribute: `data-wu="paginate"`
3. Add attribute: `data-wu-per="9"` (items per page)

**Pagination Controls:**
1. Create a div element
2. Add attribute: `data-wu="pg-controls"`
3. Add attribute: `data-wu-for="news-list"` (match your list ID)

**Result:**
```html
<div id="news-list" class="w-dyn-items" data-wu="paginate" data-wu-per="9">
  <!-- Collection items -->
</div>

<div data-wu="pg-controls" data-wu-for="news-list"></div>
```

---

### Filter (AND Condition)

**Filter Buttons:**
1. Create button elements
2. Add attribute: `data-wu="filter"`
3. Add attribute: `data-wu-key="tech"` (filter key)
4. Add attribute: `data-wu-scope="#news-list"` (target list)

**Collection Items:**
1. Add attribute: `data-wu-tags="tech,featured"` (comma-separated tags)

**Result:**
```html
<button data-wu="filter" data-wu-key="tech" data-wu-scope="#news-list">Tech</button>
<button data-wu="filter" data-wu-key="featured" data-wu-scope="#news-list">Featured</button>

<div id="news-list" class="w-dyn-items" data-wu="paginate" data-wu-per="9">
  <div class="w-dyn-item" data-wu-tags="tech,featured">Item 1</div>
  <div class="w-dyn-item" data-wu-tags="tech">Item 2</div>
</div>
```

**Behavior:**
- Click "Tech" → shows only tech items
- Click "Featured" → shows only items with BOTH tech AND featured

---

### Sort

**Sort Buttons:**
1. Create button elements
2. Add attribute: `data-wu="sort"`
3. Add attribute: `data-wu-key="date"` (or "title")
4. Add attribute: `data-wu-order="desc"` (or "asc")
5. Add attribute: `data-wu-for="news-list"` (target list ID)

**Collection Items:**
1. Add attribute: `data-wu-date="2025-01-20"` (ISO format)
2. Add attribute: `data-wu-title="Article Title"`

**Result:**
```html
<button data-wu="sort" data-wu-key="date" data-wu-order="desc" data-wu-for="news-list">
  Newest First
</button>

<div id="news-list">
  <div class="w-dyn-item" data-wu-date="2025-01-20" data-wu-title="News">...</div>
</div>
```

---

### Load More

**List:**
1. Add ID to collection wrapper
2. Add attribute: `data-wu="loadmore"`
3. Add attribute: `data-wu-initial="6"` (initially visible)
4. Add attribute: `data-wu-step="3"` (load per click)

**Button:**
1. Create button
2. Add attribute: `data-wu="loadmore-btn"`
3. Add attribute: `data-wu-for="posts"` (match list ID)

**Result:**
```html
<div id="posts" data-wu="loadmore" data-wu-initial="6" data-wu-step="3">
  <div class="w-dyn-item">Post 1</div>
  <!-- More items -->
</div>

<button data-wu="loadmore-btn" data-wu-for="posts">Load More</button>
```

---

### Table of Contents

**TOC Container:**
1. Create div for TOC
2. Add attribute: `data-wu="toc"`
3. Add attribute: `data-wu-for="#article-body"` (target selector)
4. Optional: `data-wu-headings="h2,h3"` (default: h2,h3)

**Result:**
```html
<div data-wu="toc" data-wu-for="#article-body"></div>

<article id="article-body">
  <h2>Section 1</h2>
  <p>Content...</p>
  <h3>Subsection</h3>
</article>
```

**Auto-generated:**
- Links to all headings
- Adds IDs if missing
- h3 gets indentation class

---

### External Links

**Container:**
1. Wrap your content in a div
2. Add attribute: `data-wu="ext-links"`

**Result:**
```html
<div data-wu="ext-links">
  <a href="https://example.com">External</a>
  <a href="/local">Internal</a>
</div>
```

**Automatic:**
- External links get `target="_blank"` and `rel="noopener"`
- Internal links unchanged
- mailto/tel links ignored

---

### Form Guard

**Form:**
1. Add div anywhere inside form
2. Add attribute: `data-wu="form-guard"`
3. Optional: `data-wu-timeout="10000"` (ms, default: 10000)
4. Optional: `data-wu-label-sending="Sending..."` (button text)

**Result:**
```html
<form>
  <div data-wu="form-guard" data-wu-timeout="5000"></div>
  <input type="email" name="email">
  <button type="submit">Submit</button>
</form>
```

**Behavior:**
- Disables submit button on submit
- Shows "Sending..." text
- Re-enables after timeout

---

### UTM Parameters

**Form:**
1. Add div inside form
2. Add attribute: `data-wu="utm"`
3. Add hidden inputs with UTM names

**Result:**
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
- Reads UTM from URL: `?utm_source=google&utm_medium=cpc`
- Populates hidden inputs
- Only fills if input is empty

---

### Video Autoplay

**Container:**
1. Wrap video in div
2. Add attribute: `data-wu="video"` to container
3. Add attribute: `data-wu-auto` to video tag

**Result:**
```html
<div data-wu="video">
  <video data-wu-auto src="video.mp4" muted loop></video>
</div>
```

**Behavior:**
- Plays when 25% visible
- Pauses when out of view
- Uses Intersection Observer

---

### Scrollspy

**Navigation:**
1. Add attribute: `data-wu="scrollspy"` to nav
2. Add attribute: `data-wu-link="section1"` to each link

**Sections:**
1. Add attribute: `data-wu-spy="section1"` to each section

**Result:**
```html
<nav data-wu="scrollspy">
  <a href="#section1" data-wu-link="section1">Section 1</a>
  <a href="#section2" data-wu-link="section2">Section 2</a>
</nav>

<section data-wu-spy="section1">Content 1</section>
<section data-wu-spy="section2">Content 2</section>
```

**Behavior:**
- Adds `is-active` class when section 50% visible

**CSS for active state:**
```css
[data-wu="scrollspy"] a.is-active {
  font-weight: bold;
  border-left: 3px solid var(--wu-brand);
}
```

---

### Text Trim

**Container:**
1. Wrap in div with `data-wu="trim"`
2. Add class `js-trim` to text element
3. Add attribute: `data-wu-max="150"` (character limit)
4. Optional: `data-wu-label-more="Read more"`

**Result:**
```html
<div data-wu="trim">
  <p class="js-trim" data-wu-max="150">
    Long text that will be truncated at 150 characters...
  </p>
</div>
```

**Behavior:**
- Truncates at character count
- Adds "Read more" button
- Button reveals full text

---

### Breadcrumbs

**Navigation:**
1. Create nav element
2. Add attribute: `data-wu="breadcrumbs"`
3. Optional: `data-wu-label-home="Home"` (home label)

**Result:**
```html
<nav data-wu="breadcrumbs" data-wu-label-home="Home"></nav>
```

**Auto-generated from URL:**
- `/blog/tech/article` → Home > Blog > Tech > Article
- Converts hyphens to spaces
- Decodes URL encoding

**CSS for styling:**
```css
[data-wu="breadcrumbs"] ol {
  display: flex;
  list-style: none;
  gap: 8px;
}

[data-wu="breadcrumbs"] li::after {
  content: "›";
  margin-left: 8px;
}

[data-wu="breadcrumbs"] li:last-child::after {
  content: "";
}
```

---

## 🎨 Customizing Brand Color

### Method 1: CSS Variable (Recommended)

Change the color in your stylesheet:

```css
:root {
  --wu-brand: #FF5733; /* Your brand color */
}
```

All buttons and UI elements update automatically!

### Method 2: JavaScript

```javascript
WU.brandColor('#FF5733');
```

### Method 3: Meta Tag

```html
<meta name="wu-brand-color" content="#FF5733">
```

---

## 🔄 Dynamic Content (AJAX)

After loading content via Webflow's native pagination or AJAX:

```javascript
// Re-initialize all features
WU.init();
```

Or with Webflow's callback:

```javascript
Webflow.push(function() {
  WU.init();
});
```

**Safe to call multiple times** - won't double-bind events.

---

## 🧪 Testing Your Integration

### 1. Check Console

Open browser DevTools (F12) and check console for:

```
WebHaru Utils loaded: {init: ƒ, pagination: {…}, brandColor: ƒ, utils: {…}}
```

No errors = successful integration ✅

### 2. Test Pagination

1. Click through pages
2. Check URL hash updates: `#wu:yourlist=2`
3. Refresh page - should stay on same page

### 3. Test Filter

1. Click filter button - should get `is-active` class
2. Items without tag should hide
3. Click multiple filters - only items with ALL tags show (AND condition)

### 4. Test Brand Color

1. Change `--wu-brand` in CSS
2. All buttons should update color immediately

---

## 🐛 Troubleshooting

### Features not working?

**Check:**
1. ✅ Script is in Footer Code (not Header)
2. ✅ Added `defer` attribute to script tag
3. ✅ Published site (features only work on published site)
4. ✅ Correct data attributes (check spelling)
5. ✅ IDs are unique (no duplicate IDs)
6. ✅ Browser cache cleared (Ctrl+Shift+R / Cmd+Shift+R)

### Pagination not syncing?

**Check:**
1. ✅ List has unique ID
2. ✅ Controls have matching `data-wu-for` value
3. ✅ `data-wu-per` is a number, not text

### Filter not working?

**Check:**
1. ✅ Items have `data-wu-tags` (comma-separated)
2. ✅ Filter buttons have matching `data-wu-key`
3. ✅ `data-wu-scope` matches list selector (#id or .class)

### Style issues?

**Check:**
1. ✅ Added the CSS from Step 1
2. ✅ `--wu-brand` is defined in `:root`
3. ✅ No conflicting CSS overriding WU styles

---

## 📞 Support

- **Documentation**: https://github.com/Masato-haru/webharu-utils
- **Live Demo**: https://masato-haru.github.io/webharu-utils/test-refactored.html
- **Issues**: https://github.com/Masato-haru/webharu-utils/issues

---

## ✅ Quick Checklist

- [ ] Added script to Footer Code
- [ ] Added CSS styles
- [ ] Changed `--wu-brand` to my color
- [ ] Added `data-wu` attributes to elements
- [ ] Published site
- [ ] Tested in browser
- [ ] Cleared cache if issues
- [ ] Checked browser console for errors

---

**Happy building!** 🎉

Generated with Claude Code
