module.exports = function (test, t) {
  test('loadmore uses visible/step markers', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['loadmore id', 'wuVisible', 'wuStep'].forEach(function (needle) {
      t.includes(js, needle, 'loadmore requires ' + needle);
    });
  });
};
