(function () {
  const storageKey = 'wu_snippet_builder_state_v1';
  const state = {
    brandHex: '#005AC8',
    selected: [],
    values: {},
    errors: {},
    activeTab: 'inline'
  };
  const resources = {
    features: {},
    defaults: {},
    llms: {},
    templates: {},
    wuScript: ''
  };
  const dom = {};
  let toastTimer = 0;

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function fetchJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to load ' + url);
      }
      return res.json();
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('Failed to load ' + url);
      }
      return res.text();
    });
  }

  function initDomRefs() {
    dom.catalog = $('#feature-list');
    dom.tags = $('#tag-filters');
    dom.search = $('#search');
    dom.forms = $('#forms');
    dom.settingsEmpty = $('#settings-empty');
    dom.settingsInner = $('#settings-inner');
    dom.outputTabs = $$('.tab');
    dom.panels = $$('.panel');
    dom.outInline = $('#out-inline');
    dom.outExternal = $('#out-external');
    dom.outAttrs = $('#out-attrs');
    dom.outLlms = $('#out-llms');
    dom.attrTable = $('#attr-table');
    dom.btnCopy = $('#btn-copy');
    dom.btnZip = $('#btn-zip');
    dom.toast = $('#toast');
    dom.howto = $('#howto');
    dom.settingsTitle = $('#settings-title');
  }

  function loadResources() {
    return Promise.all([
      fetchJSON('./data/features.json').then(function (json) {
        resources.features = json;
      }),
      fetchJSON('./data/defaults.json').then(function (json) {
        resources.defaults = json;
      }),
      fetchJSON('./data/llms-parts.json').then(function (json) {
        resources.llms = json;
      }),
      fetchText('../assets/webharu-utils.v1.js').then(function (text) {
        resources.wuScript = text;
      }),
      fetchText('./templates/snippet-footer-inline.html').then(function (text) {
        resources.templates.inline = text;
      }),
      fetchText('./templates/snippet-footer-external.html').then(function (text) {
        resources.templates.external = text;
      })
    ])
      .then(function () {
        const featureKeys = Object.keys(resources.features);
        return Promise.all(
          featureKeys.map(function (key) {
            const info = resources.features[key];
            return fetchText('./templates/' + info.attrsSampleFile).then(function (text) {
              resources.templates[key] = text;
            });
          })
        );
      })
      .catch(function (err) {
        console.warn('[WU Builder]', err);
        throw err;
      });
  }

  function restoreState() {
    var stored;
    try {
      stored = localStorage.getItem(storageKey);
    } catch (err) {
      stored = null;
    }
    if (!stored) {
      applyDefaults();
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        state.brandHex = normalizeColor(parsed.brandHex || resources.defaults.brandHex || state.brandHex);
        state.selected = Array.isArray(parsed.selected) ? parsed.selected.filter(function (key) {
          return resources.features[key];
        }) : [];
        state.values = parsed.values && typeof parsed.values === 'object' ? parsed.values : {};
        state.activeTab = parsed.activeTab || 'inline';
      } else {
        applyDefaults();
      }
    } catch (err) {
      applyDefaults();
    }
  }

  function applyDefaults() {
    if (resources.defaults.brandHex) {
      state.brandHex = normalizeColor(resources.defaults.brandHex);
    }
    state.selected = [];
    state.values = {};
    state.activeTab = 'inline';
  }

  function saveState() {
    var payload = {
      brandHex: state.brandHex,
      selected: state.selected,
      values: state.values,
      activeTab: state.activeTab
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (err) {
      // ignore
    }
  }

  function normalizeColor(input) {
    if (!input) {
      return '#005AC8';
    }
    var hex = input.trim();
    if (hex[0] !== '#') {
      hex = '#' + hex;
    }
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
      hex = '#' + hex.slice(1).split('').map(function (c) {
        return c + c;
      }).join('');
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      return '#005AC8';
    }
    return '#' + hex.slice(1).toUpperCase();
  }

  function buildCatalog() {
    var features = resources.features;
    var keys = Object.keys(features).sort(function (a, b) {
      return (features[a].order || 0) - (features[b].order || 0);
    });
    dom.catalog.innerHTML = '';
    keys.forEach(function (key) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'feature-card';
      card.setAttribute('data-key', key);
      card.innerHTML = '<div class="title">' + features[key].label + '</div><div class="desc">' + (features[key].description || '') + '</div>';
      dom.catalog.appendChild(card);
    });
    buildTags(keys);
  }

  function buildTags(keys) {
    var map = {};
    keys.forEach(function (key) {
      (resources.features[key].tags || []).forEach(function (tag) {
        map[tag] = true;
      });
    });
    var tags = Object.keys(map).sort();
    dom.tags.innerHTML = '';
    tags.forEach(function (tag) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-filter';
      btn.textContent = '#' + tag;
      btn.setAttribute('data-tag', tag);
      dom.tags.appendChild(btn);
    });
  }

  function buildForms() {
    dom.forms.innerHTML = '';
    var brandField = document.createElement('div');
    brandField.className = 'field';
    brandField.innerHTML = '<label for="brand-hex">ブランドカラー (HEX)<span class="required">*</span></label><input id="brand-hex" type="text" value="' + state.brandHex + '" />';
    var error = document.createElement('div');
    error.className = 'error';
    error.id = 'error-brand-hex';
    brandField.appendChild(error);
    var preview = document.createElement('div');
    preview.className = 'preview';
    preview.id = 'brand-preview';
    preview.innerHTML = '<span class="page" data-role="prev">Prev</span><span class="page is-active" data-role="current">1</span><span class="page" data-role="next">Next</span>';
    brandField.appendChild(preview);
    dom.forms.appendChild(brandField);

    Object.keys(resources.features).forEach(function (key) {
      var info = resources.features[key];
      var form = document.createElement('form');
      form.id = 'form-' + key;
      form.setAttribute('data-key', key);
      form.hidden = state.selected.indexOf(key) === -1;
      var title = document.createElement('h3');
      title.textContent = info.label;
      form.appendChild(title);
      (info.inputs || []).forEach(function (input) {
        var field = document.createElement('div');
        field.className = 'field';
        var label = document.createElement('label');
        var labelText = input.label || input.name;
        label.innerHTML = labelText + (input.required ? '<span class="required">*</span>' : '');
        label.setAttribute('for', key + '-' + input.name);
        field.appendChild(label);
        var control;
        if (input.type === 'textarea') {
          control = document.createElement('textarea');
        } else {
          control = document.createElement('input');
          control.type = input.type || 'text';
        }
        control.id = key + '-' + input.name;
        control.name = input.name;
        if (input.placeholder) {
          control.placeholder = input.placeholder;
        }
        var val = getFieldValue(key, input.name);
        if (val == null && input.default != null) {
          val = input.default;
        }
        control.value = val != null ? val : '';
        field.appendChild(control);
        var err = document.createElement('div');
        err.className = 'error';
        err.setAttribute('role', 'alert');
        err.id = 'error-' + key + '-' + input.name;
        field.appendChild(err);
        form.appendChild(field);
      });
      dom.forms.appendChild(form);
    });
  }

  function getFieldValue(featureKey, name) {
    if (!state.values[featureKey]) {
      return null;
    }
    if (state.values[featureKey][name] == null) {
      return null;
    }
    return state.values[featureKey][name];
  }

  function attachEvents() {
    dom.catalog.addEventListener('click', function (ev) {
      var card = ev.target.closest('.feature-card');
      if (!card) {
        return;
      }
      var key = card.getAttribute('data-key');
      toggleFeature(key);
    });

    dom.tags.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.tag-filter');
      if (!btn) {
        return;
      }
      btn.classList.toggle('is-active');
      filterCatalog();
    });

    dom.search.addEventListener('input', debounce(filterCatalog, 120));

    dom.forms.addEventListener('input', function (ev) {
      var target = ev.target;
      if (target.id === 'brand-hex') {
        state.brandHex = normalizeColor(target.value);
        target.value = state.brandHex;
        updateBrandPreview();
        validateBrand();
        updateOutputs();
        saveState();
        return;
      }
      var form = target.closest('form');
      if (!form) {
        return;
      }
      var key = form.getAttribute('data-key');
      if (!state.values[key]) {
        state.values[key] = {};
      }
      state.values[key][target.name] = target.value;
      validateField(key, target.name);
      updateOutputs();
      saveState();
    });

    dom.outputTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var tabName = tab.getAttribute('data-tab');
        setActiveTab(tabName);
      });
    });

    dom.btnCopy.addEventListener('click', function () {
      copyActiveTab();
    });

    dom.btnZip.addEventListener('click', function () {
      ensureReadmeThenZip();
    });

  }

  function toggleFeature(key) {
    if (!resources.features[key]) {
      return;
    }
    var already = state.selected.indexOf(key) !== -1;
    state.selected = already ? [] : [key];
    Object.keys(state.errors).forEach(function (errorKey) {
      if (errorKey === 'brand') {
        return;
      }
      if (!state.selected.length || errorKey.indexOf(state.selected[0] + ':') !== 0) {
        delete state.errors[errorKey];
      }
    });
    updateSelections();
    updateOutputs();
    saveState();
  }

  function updateSelections() {
    var cards = $$('.feature-card');
    cards.forEach(function (card) {
      var key = card.getAttribute('data-key');
      card.classList.toggle('is-active', state.selected.indexOf(key) !== -1);
    });
    Object.keys(resources.features).forEach(function (key) {
      var form = $('#form-' + key);
      if (form) {
        form.hidden = state.selected.indexOf(key) === -1;
      }
    });
    dom.settingsEmpty.hidden = state.selected.length > 0;
  }

  function filterCatalog() {
    var query = dom.search.value.trim().toLowerCase();
    var activeTags = $$('.tag-filter.is-active').map(function (btn) {
      return btn.getAttribute('data-tag');
    });
    $$('.feature-card').forEach(function (card) {
      var key = card.getAttribute('data-key');
      var info = resources.features[key];
      var matchesQuery = !query || info.label.toLowerCase().indexOf(query) !== -1 || (info.tags || []).some(function (tag) {
        return tag.toLowerCase().indexOf(query) !== -1;
      });
      var matchesTag = !activeTags.length || activeTags.every(function (tag) {
        return (info.tags || []).indexOf(tag) !== -1;
      });
      card.hidden = !(matchesQuery && matchesTag);
    });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      var args = arguments;
      var ctx = this;
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait || 120);
    };
  }

  function updateBrandPreview() {
    var preview = $('#brand-preview');
    if (preview) {
      preview.style.setProperty('--wu-brand', state.brandHex);
      preview.querySelectorAll('.page').forEach(function (page) {
        if (page.classList.contains('is-active')) {
          page.style.background = state.brandHex;
        }
      });
    }
    document.documentElement.style.setProperty('--wu-brand', state.brandHex);
  }

  function validateBrand() {
    var errorNode = $('#error-brand-hex');
    var valid = /^#[0-9A-F]{6}$/.test(state.brandHex);
    if (!valid) {
      errorNode.textContent = 'HEX形式 (#RRGGBB) で入力してください';
    } else {
      errorNode.textContent = '';
    }
    state.errors.brand = !valid;
  }

  function validateField(featureKey, fieldName) {
    var info = resources.features[featureKey];
    if (!info) {
      return;
    }
    var spec = (info.inputs || []).find(function (input) {
      return input.name === fieldName;
    });
    if (!spec) {
      return;
    }
    var value = getFieldValue(featureKey, fieldName) || '';
    var errorNode = $('#error-' + featureKey + '-' + fieldName);
    var message = '';
    if (spec.required && !value.trim()) {
      message = '必須項目です';
    }
    if (!message && spec.pattern) {
      var reg = new RegExp(spec.pattern);
      if (!reg.test(value.trim())) {
        message = '形式が正しくありません';
      }
    }
    if (!message && spec.type === 'number') {
      var num = parseInt(value, 10);
      if (isNaN(num)) {
        message = '数値を入力してください';
      } else {
        if (spec.min != null && num < spec.min) {
          message = spec.min + '以上で入力してください';
        }
        if (spec.max != null && num > spec.max) {
          message = spec.max + '以下で入力してください';
        }
      }
    }
    errorNode.textContent = message;
    state.errors[featureKey + ':' + fieldName] = !!message;
  }

  function validateForms() {
    validateBrand();
    state.selected.forEach(function (key) {
      var info = resources.features[key];
      (info.inputs || []).forEach(function (input) {
        if (!state.values[key]) {
          state.values[key] = {};
        }
        if (state.values[key][input.name] == null && input.default != null) {
          state.values[key][input.name] = input.default;
          var control = $('#' + key + '-' + input.name);
          if (control) {
            control.value = state.values[key][input.name];
          }
        }
        validateField(key, input.name);
      });
    });
  }

  function hasErrors() {
    return Object.keys(state.errors).some(function (key) {
      return state.errors[key];
    });
  }

  function templateReplace(str, replacements) {
    return str.replace(/{{(.*?)}}/g, function (_, key) {
      return replacements.hasOwnProperty(key) ? replacements[key] : '';
    });
  }

  function sanitizeAttr(value) {
    return value == null ? '' : String(value).replace(/"/g, '&quot;');
  }

  function buildFeatureMarkup(key) {
    var tpl = resources.templates[key];
    if (!tpl) {
      return '';
    }
    var values = state.values[key] || {};
    var defaults = resources.defaults[key] || {};
    var info = resources.features[key];
    var data = {};
    (info.inputs || []).forEach(function (input) {
      var v = values[input.name];
      if (v == null || v === '') {
        v = defaults[input.name];
      }
      if (v == null && input.default != null) {
        v = input.default;
      }
      data[input.name] = v != null ? v : '';
    });
    if (key === 'filter') {
      var scope = data.scope || '#collection';
      data.SCOPE_ATTR = buildScopeAttr(scope);
      data.FILTER_BUTTONS = buildFilterButtons(scope, data.keys);
    }
    if (key === 'sort') {
      data.BUTTON_WRAP = data.buttonId ? 'id="' + sanitizeAttr(data.buttonId) + '"' : '';
    }
    if (key === 'toc') {
      var id = (data.forSel || '#post-body').replace(/^[#.]/, '');
      data.forId = id;
    }
    if (key === 'scrollspy') {
      data.NAV_ATTR = data.navId ? 'id="' + sanitizeAttr(data.navId) + '"' : '';
    }
    return templateReplace(tpl, data);
  }

  function buildScopeAttr(scope) {
    if (!scope) {
      return 'id="collection"';
    }
    if (scope[0] === '#') {
      return 'id="' + sanitizeAttr(scope.slice(1)) + '"';
    }
    if (scope[0] === '.') {
      return 'class="' + sanitizeAttr(scope.slice(1)) + '"';
    }
    return 'data-scope="' + sanitizeAttr(scope) + '"';
  }

  function buildFilterButtons(scope, keys) {
    var list = (keys || '').split(',').map(function (k) {
      return k.trim();
    }).filter(Boolean);
    if (!list.length) {
      list = ['news'];
    }
    return list.map(function (key) {
      return '<button data-wu="filter" data-wu-key="' + sanitizeAttr(key) + '" data-wu-scope="' + sanitizeAttr(scope) + '">' + key + '</button>';
    }).join('\n  ');
  }

  function collectAttributeRows(markup) {
    if (!markup) {
      return [];
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString('<div>' + markup + '</div>', 'text/html');
    var rows = [];
    doc.querySelectorAll('*').forEach(function (node) {
      Array.prototype.slice.call(node.attributes).forEach(function (attr) {
        if (attr.name.indexOf('data-wu') === 0) {
          rows.push({ name: attr.name, value: attr.value });
        }
      });
    });
    var seen = {};
    return rows.filter(function (row) {
      var key = row.name + '|' + row.value;
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function renderAttrTable(rows) {
    if (!rows.length) {
      dom.attrTable.innerHTML = '';
      return;
    }
    var wrapper = document.createElement('div');
    wrapper.className = 'attr-grid';
    rows.forEach(function (row) {
      var name = document.createElement('div');
      name.textContent = row.name;
      var value = document.createElement('div');
      value.textContent = row.value;
      var btnName = document.createElement('button');
      btnName.type = 'button';
      btnName.textContent = 'Name';
      btnName.addEventListener('click', function () {
        copyText(row.name).then(function () {
          showToast(row.name + ' をコピーしました');
        });
      });
      var btnValue = document.createElement('button');
      btnValue.type = 'button';
      btnValue.textContent = 'Value';
      btnValue.addEventListener('click', function () {
        copyText(row.value).then(function () {
          showToast(row.name + ' の値をコピーしました');
        });
      });
      wrapper.appendChild(name);
      wrapper.appendChild(value);
      wrapper.appendChild(btnName);
      wrapper.appendChild(btnValue);
    });
    dom.attrTable.innerHTML = '';
    dom.attrTable.appendChild(wrapper);
  }

  function buildOutputs() {
    validateForms();
    var snippets = state.selected.map(function (key) {
      return buildFeatureMarkup(key);
    }).filter(Boolean);
    var combined = snippets.join('\n\n');
    dom.outAttrs.textContent = combined;
    renderAttrTable(collectAttributeRows(combined));

    var inlineCode = templateReplace(resources.templates.inline, {
      BRAND_HEX: state.brandHex,
      WU_MINIFIED: resources.wuScript
    });
    dom.outInline.textContent = inlineCode;

    var externalCode = templateReplace(resources.templates.external, {
      BRAND_HEX: state.brandHex
    });
    dom.outExternal.textContent = externalCode;

    var llmsParts = state.selected.slice().sort(function (a, b) {
      return (resources.features[a].order || 0) - (resources.features[b].order || 0);
    }).map(function (key) {
      var tpl = resources.llms[key];
      if (!tpl) {
        return '';
      }
      var info = resources.features[key];
      var data = {};
      (info.inputs || []).forEach(function (input) {
        var v = getFieldValue(key, input.name);
        if (!v && resources.defaults[key] && resources.defaults[key][input.name] != null) {
          v = resources.defaults[key][input.name];
        }
        if (!v && input.default != null) {
          v = input.default;
        }
        data[input.name] = v || '';
      });
      return templateReplace(tpl, data);
    }).filter(Boolean).join('\n');
    dom.outLlms.textContent = llmsParts.trim();

    dom.btnCopy.disabled = hasErrors() || state.selected.length === 0;
    dom.btnZip.disabled = dom.btnCopy.disabled;
  }

  function updateOutputs() {
    buildOutputs();
  }

  function setActiveTab(name) {
    state.activeTab = name;
    dom.outputTabs.forEach(function (tab) {
      var isActive = tab.getAttribute('data-tab') === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    dom.panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-panel') === name);
    });
    saveState();
  }

  function copyActiveTab() {
    var map = {
      inline: dom.outInline.textContent,
      external: dom.outExternal.textContent,
      attrs: dom.outAttrs.textContent,
      llms: dom.outLlms.textContent
    };
    var text = map[state.activeTab] || '';
    copyText(text).then(function () {
      showToast('クリップボードにコピーしました');
    }).catch(function () {
      showToast('コピーに失敗しました');
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    dom.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      dom.toast.classList.remove('is-visible');
      setTimeout(function () {
        dom.toast.hidden = true;
      }, 200);
    }, 2500);
  }

  function crc32(bytes) {
    var table = crc32.table || (crc32.table = (function () {
      var c;
      var table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
      }
      return table;
    })());
    var crc = -1;
    for (var i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function encodeUTF8(str) {
    return new TextEncoder().encode(str);
  }

  function buildZipWith(readme) {
    var files = [];
    files.push({ name: 'your-snippet/webharu-utils.v1.js', content: resources.wuScript });
    files.push({ name: 'your-snippet/snippet-footer.html', content: dom.outInline.textContent });
    files.push({ name: 'your-snippet/attributes.html', content: wrapAttributesHtml() });
    files.push({ name: 'your-snippet/llms.txt', content: dom.outLlms.textContent });
    files.push({ name: 'your-snippet/README-ja.md', content: readme });

    var zipBuffer = createZip(files);
    var blob = new Blob([zipBuffer], { type: 'application/zip' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'wu-snippet.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ZIPを生成しました');
  }

  function wrapAttributesHtml() {
    return '<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>WU Attributes</title></head><body>' + dom.attrTable.innerHTML + '<pre>' + escapeHtml(dom.outAttrs.textContent) + '</pre></body></html>';
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch] || ch;
    });
  }

  var cachedReadme = '';
  function extractReadmeText() {
    if (cachedReadme) {
      return Promise.resolve(cachedReadme);
    }
    return fetchText('../docs/README-ja.md').then(function (text) {
      var lines = text.split('\n');
      cachedReadme = lines.slice(0, Math.min(lines.length, 80)).join('\n');
      return cachedReadme;
    });
  }

  function createZip(files) {
    var encoder = encodeUTF8;
    var fileRecords = [];
    var centralRecords = [];
    var offset = 0;

    files.forEach(function (file) {
      var nameBytes = encoder(file.name);
      var content = file.content;
      var dataBytes = typeof content === 'string' ? encoder(content) : new Uint8Array(content);
      var crc = crc32(dataBytes);
      var size = dataBytes.length;

      var header = new Uint8Array(30 + nameBytes.length);
      var view = new DataView(header.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 10, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint16(14, 0, true);
      view.setUint32(16, crc, true);
      view.setUint32(20, size, true);
      view.setUint32(24, size, true);
      view.setUint16(28, nameBytes.length, true);
      header.set(nameBytes, 30);
      fileRecords.push(header);
      fileRecords.push(dataBytes);

      var central = new Uint8Array(46 + nameBytes.length);
      var cview = new DataView(central.buffer);
      cview.setUint32(0, 0x02014b50, true);
      cview.setUint16(4, 0x0317, true);
      cview.setUint16(6, 10, true);
      cview.setUint16(8, 0, true);
      cview.setUint16(10, 0, true);
      cview.setUint16(12, 0, true);
      cview.setUint16(14, 0, true);
      cview.setUint32(16, crc, true);
      cview.setUint32(20, size, true);
      cview.setUint32(24, size, true);
      cview.setUint16(28, nameBytes.length, true);
      cview.setUint16(30, 0, true);
      cview.setUint16(32, 0, true);
      cview.setUint16(34, 0, true);
      cview.setUint16(36, 0, true);
      cview.setUint32(38, 0, true);
      cview.setUint32(42, offset, true);
      central.set(nameBytes, 46);
      centralRecords.push(central);

      offset += header.length + dataBytes.length;
    });

    var centralOffset = offset;
    centralRecords.forEach(function (central) {
      offset += central.length;
      fileRecords.push(central);
    });

    var end = new Uint8Array(22);
    var eview = new DataView(end.buffer);
    eview.setUint32(0, 0x06054b50, true);
    eview.setUint16(4, 0, true);
    eview.setUint16(6, 0, true);
    eview.setUint16(8, files.length, true);
    eview.setUint16(10, files.length, true);
    var centralSize = offset - centralOffset;
    eview.setUint32(12, centralSize, true);
    eview.setUint32(16, centralOffset, true);
    eview.setUint16(20, 0, true);
    fileRecords.push(end);

    var totalSize = fileRecords.reduce(function (sum, arr) {
      return sum + arr.length;
    }, 0);
    var buffer = new Uint8Array(totalSize);
    var pos = 0;
    fileRecords.forEach(function (arr) {
      buffer.set(arr, pos);
      pos += arr.length;
    });
    return buffer;
  }

  function ensureReadmeThenZip() {
    if (cachedReadme) {
      buildZipWith(cachedReadme);
      return;
    }
    extractReadmeText().then(function (text) {
      cachedReadme = text;
      buildZipWith(cachedReadme);
    }).catch(function () {
      cachedReadme = '# WebHaru Utils\n詳細は公式READMEをご覧ください。';
      buildZipWith(cachedReadme);
    });
  }

  function start() {
    initDomRefs();
    loadResources().then(function () {
      restoreState();
      buildCatalog();
      buildForms();
      attachEvents();
      updateSelections();
      updateBrandPreview();
      setActiveTab(state.activeTab || 'inline');
      updateOutputs();
      dom.howto.innerHTML = '<p>① 左から機能を選択 → ② 中央で必要な値を入力 → ③ 右のタブをコピー or ZIP。</p>';
    }).catch(function (err) {
      console.error(err);
    });
  }

  document.addEventListener('DOMContentLoaded', start);
})();
