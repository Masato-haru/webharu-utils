module.exports = function (test, t) {
  test('utm parser looks for utm_ keys', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    t.includes(js, "indexOf('utm_')", 'utm keys handled');
    t.includes(js, 'iu(', 'utm init alias present');
  });
};
