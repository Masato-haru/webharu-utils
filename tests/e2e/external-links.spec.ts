module.exports = function (test, t) {
  test('external link safeguard present', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['ext-links', 'noopener', "target','_blank'"].forEach(function (needle) {
      t.includes(js, needle, 'external links require ' + needle);
    });
  });
};
