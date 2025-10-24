module.exports = function (test, t) {
  test('form guard locks submit temporarily', function () {
    const js = t.read('assets/webharu-utils.v1.js');
    ['form guard form', 'wuOriginalLabel', 'setTimeout(function(){submit.disabled=false'].forEach(function (needle) {
      t.includes(js, needle, 'form guard requires ' + needle);
    });
  });
};
