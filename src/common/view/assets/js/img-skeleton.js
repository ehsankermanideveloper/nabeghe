(function () {
  function revealImage(img) {
    var skeleton = img.previousElementSibling;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        img.style.opacity = '1';
        if (skeleton && skeleton.hasAttribute('data-skeleton')) {
          skeleton.style.transition = 'opacity 0.4s ease';
          skeleton.style.opacity = '0';
          setTimeout(function () {
            if (skeleton.parentNode) skeleton.remove();
          }, 400);
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('img[data-img]').forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        revealImage(img);
      } else {
        img.addEventListener('load', function () { revealImage(img); });
        img.addEventListener('error', function () { revealImage(img); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
