module.exports = function (test, t) {
  test('filter helpers exist', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ["sel('filter'", 'wuActive', 'filter scope'].forEach(function (needle) {
      t.includes(js, needle, 'filter requires ' + needle);
    });
  });

  test('sort logic recognises title/date', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['dataset.wuTitle', 'dataset.wuDate', 'sort data'].forEach(function (needle) {
      t.includes(js, needle, 'sort requires ' + needle);
    });
  });
};
