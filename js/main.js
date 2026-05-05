/* ══════════════════════════════════════════
   CASA AGUA ALTA — JS v3
   WD Studio Agency
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX - 4 + 'px';
      cursor.style.top = e.clientY - 4 + 'px';
    });
    const bindHover = () => {
      document.querySelectorAll('a, button, .suite-card, .card-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    };
    bindHover();
    // Rebind after page changes
    window._bindCursorHover = bindHover;
  }

  // ── Nav Scroll ──
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Mobile Menu ──
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('open', isOpen);
    });
  }

  // ── Page Navigation ──
  window.showPage = function(id) {
    // Close mobile menu
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('open');

    // Hide all pages, reset reveals
    document.querySelectorAll('.page-section').forEach(p => {
      p.classList.remove('active');
      p.querySelectorAll('.reveal.visible').forEach(r => r.classList.remove('visible'));
    });

    // Show target page
    const page = document.getElementById('page-' + id);
    if (page) {
      page.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Init reveals after a tick
      requestAnimationFrame(() => {
        setTimeout(initReveals, 50);
        if (window._bindCursorHover) window._bindCursorHover();
      });
    }
  };

  // ── Scroll Reveal ──
  function initReveals() {
    const els = document.querySelectorAll('.page-section.active .reveal:not(.visible)');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => observer.observe(el));
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Form (Formspree) ──
  const form = document.getElementById('inquire-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origHTML = btn.innerHTML;
      btn.innerHTML = 'SENDING...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          document.getElementById('form-container').style.display = 'none';
          document.getElementById('form-success').classList.add('active');
        } else {
          btn.innerHTML = 'ERROR — TRY AGAIN';
          btn.disabled = false;
          setTimeout(() => { btn.innerHTML = origHTML; }, 3000);
        }
      } catch {
        btn.innerHTML = 'ERROR — TRY AGAIN';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = origHTML; }, 3000);
      }
    });
  }

  // Init reveals on load
  initReveals();
});

// Carga la API de YouTube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    videoId: 'v4bqQeNuN4c',
    playerVars: {
      'autoplay': 1,
      'mute': 1,
      'controls': 0,
      'loop': 1,
      'playlist': 'v4bqQeNuN4c',
      'rel': 0,
      'showinfo': 0,
      'modestbranding': 1,
      'playsinline': 1,
      'enablejsapi': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
  
  // Forzar sugerencia de alta calidad
  if (event.target.setPlaybackQuality) {
      event.target.setPlaybackQuality('hd1080');
  }
  
  resizeVideo();
}

function onPlayerStateChange(event) {
  // Reinicia el video al terminar para un loop fluido
  if (event.data === YT.PlayerState.ENDED) {
    player.playVideo();
  }
}

// Función para que el video sea "Background Cover" (solución para móvil)
function resizeVideo() {
  var container = document.getElementById('video-viewport');
  var playerElement = document.getElementById('ytplayer');
  
  if (!container || !playerElement) return; // Prevención de errores si los elementos no existen
  
  var w = container.offsetWidth;
  var h = container.offsetHeight;
  
  // Relación de aspecto 16:9
  if (w / h > 16 / 9) {
    // Pantalla ancha
    playerElement.style.width = w + 'px';
    playerElement.style.height = (w * 9 / 16) + 'px';
  } else {
    // Pantalla alta (Móvil)
    playerElement.style.width = (h * 16 / 9) + 'px';
    playerElement.style.height = h + 'px';
  }
}

window.addEventListener('resize', resizeVideo);
