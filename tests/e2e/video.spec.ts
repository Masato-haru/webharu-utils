module.exports = function (test, t) {
  test('video observer toggles play/pause', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['data-wu-auto', 'IntersectionObserver', 'v.play', 'v.pause'].forEach(function (needle) {
      t.includes(js, needle, 'video requires ' + needle);
    });
  });
};
