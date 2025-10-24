module.exports = function (test, t) {
  test('toc creates heading anchors', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    t.includes(js, 'wu-heading-', 'toc heading id prefix');
    t.includes(js, 'wu-depth-2', 'toc depth class');
  });
};
