module.exports = function (test, t) {
  test('index layout has required sections', function () {
    const html = t.read('app/index.html');
    ['id="catalog"', 'id="settings"', 'id="output"', 'id="feature-list"', 'id="tag-filters"', 'id="out-inline"'].forEach(function (needle) {
      t.includes(html, needle, 'Missing ' + needle);
    });
  });

  test('builder JS boots with storage key and helpers', function () {
    const js = t.read('app/app.js');
    t.includes(js, "wu_snippet_builder_state_v1", 'storage key');
    t.includes(js, 'normalizeColor', 'color normalizer');
    t.includes(js, 'copyText', 'copy helper');
  });

  test('inline template keeps placeholders', function () {
    const tpl = t.read('app/templates/snippet-footer-inline.html');
    ['{{BRAND_HEX}}', '{{WU_MINIFIED}}', 'ここから：WU v1', 'ここまで：WU v1'].forEach(function (needle) {
      t.includes(tpl, needle, 'template requires ' + needle);
    });
  });

  test('features json exposes 12 entries', function () {
    const features = t.json('app/data/features.json');
    t.assert(Object.keys(features).length === 12, 'features count must be 12');
  });
};
