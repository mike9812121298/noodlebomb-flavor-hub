(function () {
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    if (!main) return;
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (button) {
      button.addEventListener('click', function () {
        var nextSrc = button.getAttribute('data-src');
        var nextAlt = button.getAttribute('data-alt') || main.alt;
        if (!nextSrc) return;
        main.src = nextSrc;
        main.alt = nextAlt;
        gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (b) {
          b.setAttribute('aria-current', b === button ? 'true' : 'false');
        });
      });
    });
  });

  document.querySelectorAll('.notify-form').forEach(function (form) {
    form.addEventListener('submit', function () {
      var button = form.querySelector('button');
      if (!button) return;
      button.textContent = 'Sending...';
      button.setAttribute('aria-busy', 'true');
    });
  });
})();
