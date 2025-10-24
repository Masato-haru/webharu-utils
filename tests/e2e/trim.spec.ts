module.exports = function (test, t) {
  test('trim injects trigger button', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['wuTrimTrigger', 'node.textContent=short', '++Trim'].forEach(function (needle) {
      t.includes(js, needle, 'trim requires ' + needle);
    });
  });
};
