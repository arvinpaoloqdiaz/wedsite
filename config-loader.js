/**
 * Load site-config.json and apply to DOM, then expose config for script.js.
 * Usage: load this script first in <head>; it fetches config and applies when DOM is ready.
 */
(function () {
  'use strict';

  function get(obj, path) {
    if (!obj) return undefined;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (obj === undefined) return undefined;
    }
    return obj;
  }

  function applyConfig(config) {
    if (!config) return;

    var doc = document;
    var root = doc.documentElement;

    // 1. Meta: title
    if (config.meta && config.meta.title) {
      doc.title = config.meta.title;
    }

    // 2. Favicons (update existing link elements by rel/sizes)
    if (config.meta && config.meta.favicon) {
      var f = config.meta.favicon;
      var links = doc.head.querySelectorAll('link[rel="apple-touch-icon"], link[rel="icon"], link[rel="shortcut icon"]');
      links.forEach(function (link) {
        var rel = link.getAttribute('rel');
        var sizes = link.getAttribute('sizes');
        if (rel === 'apple-touch-icon' && f.appleTouch) { link.href = f.appleTouch; }
        else if (sizes === '32x32' && f.icon32) { link.href = f.icon32; }
        else if (sizes === '16x16' && f.icon16) { link.href = f.icon16; }
        else if (rel && rel.indexOf('shortcut') !== -1 && f.shortcut) {
          link.href = f.shortcut;
          if (f.shortcut.indexOf('.ico') !== -1) link.type = 'image/x-icon';
        }
      });
    }

    // 3. Mark config loaded (for CSS selectors like [data-config-loaded] if needed)
    if (config.css) root.setAttribute('data-config-loaded', 'true');

    // 4. Preload/prefetch: inject critical image preloads from config
    if (config.images) {
      var preloads = [
        config.images.monogram,
        config.images.ourStory,
        config.images.churchIcon || config.images.church
      ];
      preloads.forEach(function (url) {
        if (!url) return;
        var link = doc.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        doc.head.appendChild(link);
      });
      if (config.images.carousel && config.images.carousel.length) {
        config.images.carousel.forEach(function (url) {
          var link = doc.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = url;
          doc.head.appendChild(link);
        });
      }
    }

    // 5. data-config-* attributes: text, html, src, href
    var textNodes = doc.querySelectorAll('[data-config-text]');
    textNodes.forEach(function (el) {
      var val = get(config, el.getAttribute('data-config-text'));
      if (val != null) el.textContent = val;
    });

    var htmlNodes = doc.querySelectorAll('[data-config-html]');
    htmlNodes.forEach(function (el) {
      var val = get(config, el.getAttribute('data-config-html'));
      if (val != null) el.innerHTML = val;
    });

    var srcNodes = doc.querySelectorAll('[data-config-src]');
    srcNodes.forEach(function (el) {
      var key = el.getAttribute('data-config-src');
      var val = get(config, key);
      if (val == null) return;
      if (key === 'images.hero' && config.images && config.images.heroVideo) {
        var wrapper = el.closest('.hero-video-wrapper');
        if (wrapper) {
          var video = doc.createElement('video');
          video.className = el.className || 'hero-video';
          video.style.cssText = el.style.cssText || 'width: 100%; height: auto; object-fit: cover;';
          video.setAttribute('autoplay', '');
          video.setAttribute('muted', '');
          video.setAttribute('loop', '');
          video.setAttribute('playsinline', '');
          var source = doc.createElement('source');
          source.src = config.images.heroVideo;
          source.type = 'video/mp4';
          video.appendChild(source);
          wrapper.innerHTML = '';
          wrapper.appendChild(video);
        }
        return;
      }
      el.src = val;
    });

    var hrefNodes = doc.querySelectorAll('[data-config-href]');
    hrefNodes.forEach(function (el) {
      var val = get(config, el.getAttribute('data-config-href'));
      if (val != null) el.href = val;
    });

    var titleNodes = doc.querySelectorAll('[data-config-title]');
    titleNodes.forEach(function (el) {
      var val = get(config, el.getAttribute('data-config-title'));
      if (val != null) el.setAttribute('title', val);
    });

    // 6. data-config-src for arrays (e.g. carousel): use data-config-index
    var carouselImgs = doc.querySelectorAll('[data-config-carousel-src]');
    if (config.images && config.images.carousel && config.images.carousel.length) {
      carouselImgs.forEach(function (el) {
        var idx = parseInt(el.getAttribute('data-config-carousel-index'), 10);
        if (!isNaN(idx) && config.images.carousel[idx]) el.src = config.images.carousel[idx];
      });
    }

    // 7. Preloader/theme: set CSS vars on :root (styles.css uses var(--config-preloader-bg))
    if (config.css && config.css.preloaderBg) root.style.setProperty('--config-preloader-bg', config.css.preloaderBg);
    if (config.css && config.css.themeColor) root.style.setProperty('--config-theme-color', config.css.themeColor);

    // 8. RSVP iframe: when config has rsvpIframeUrl, replace #rsvpIframe content with an iframe and set INV_CODE from URL
    var rsvpUrl = config.rsvpIframeUrl || (config.links && config.links.rsvpIframeUrl);
    if (rsvpUrl) {
      var rsvpEl = doc.getElementById('rsvpIframe');
      if (rsvpEl) {
        var invCode = typeof URLSearchParams !== 'undefined' ? new URLSearchParams(doc.location.search).get('INV_CODE') : null;
        var iframeSrc = rsvpUrl;
        if (invCode) {
          var sep = rsvpUrl.indexOf('?') !== -1 ? '&' : '?';
          iframeSrc = rsvpUrl + sep + 'INV_CODE=' + encodeURIComponent(invCode);
        }
        var iframe = doc.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.title = 'RSVP form';
        iframe.setAttribute('style', 'width:100%;border:none;min-height:400px;');
        rsvpEl.innerHTML = '';
        rsvpEl.appendChild(iframe);
      }
    }

    // 9. Notify other scripts that config has been applied
    try {
      doc.dispatchEvent(new CustomEvent('siteconfigready', { detail: config }));
    } catch (e) {}
  }

  function runWhenReady(config) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { applyConfig(config); });
    } else {
      applyConfig(config);
    }
  }

  // Fetch config (relative to current document).
  // Use ?actual=true to load site-config.actual.json (real data + RSVP iframe); otherwise site-config.json (demo).
  var actual = typeof URLSearchParams !== 'undefined' && new URLSearchParams(document.location.search).get('actual') === 'true';
  var configFileName = actual ? 'site-config.actual.json' : 'site-config.json';
  var configUrl = configFileName;
  var scriptEl = document.currentScript;
  if (scriptEl && scriptEl.src) {
    var base = scriptEl.src.replace(/[^/]+$/, '');
    configUrl = base + configFileName;
  }

  fetch(configUrl)
    .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('Config load failed')); })
    .then(function (config) {
      window.__SITE_CONFIG__ = config;
      runWhenReady(config);
    })
    .catch(function (err) {
      console.warn('Site config not loaded, using defaults:', err);
      window.__SITE_CONFIG__ = null;
      runWhenReady(null);
    });
})();
