/* image zoom - add data-action="zoom" to images */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

  // Video playback

  $('.demo-video').addClass('demo-video-paused');
  $('.demo-video').bind('click', function () {
      var video = $(this).find('video').get(0);
      if (video.paused) {
          video.play();
      } else {
          video.pause();
      }
  });

  $('.demo-video').bind('mouseenter', function () {
      var video = $(this).find('video').get(0);
      if (!video.paused) {
          $(this).addClass('demo-video-hover');
      }
  });

  $('.demo-video').bind('mouseleave', function () {
      var video = $(this).find('video').get(0);
      if (!video.paused) {
          $(this).removeClass('demo-video-hover');
      }
  });

  $('.demo-video video').on('pause', function() {
      $(this).parent().addClass('demo-video-paused');
      $(this).parent().removeClass('demo-video-hover');
  });

  $('.demo-video video').on('play', function() {
      $(this).parent().removeClass('demo-video-paused');
  });

  // drawer

  $(document).ready(function() {
    $('.drawer').drawer();
  });

  // Service Worker

  if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}

}(jQuery);

const dynamicCacheName = 'site-dynamic-v1';

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key =>  key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    })
  );
});
