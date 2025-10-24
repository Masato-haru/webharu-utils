module.exports = function (test, t) {
  test('minified library keeps pagination hooks', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ["sel('paginate'", 'data-wu-page=prev', 'hashSet('].forEach(function (needle) {
      t.includes(js, needle, 'pagination requires ' + needle);
    });
  });

  test('library size within 12KB', function () {
    const size = t.size('assets/webharu-utils.v1.js');
    t.assert(size <= 12288, 'webharu-utils.v1.js サイズ超過: ' + size);
  });
};
