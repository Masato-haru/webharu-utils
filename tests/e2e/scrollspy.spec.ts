module.exports = function (test, t) {
  test('scrollspy marks active links', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['scrollspy', 'wu-link', 'classList.add(\'is-active\''].forEach(function (needle) {
      t.includes(js, needle, 'scrollspy requires ' + needle);
    });
  });
};
