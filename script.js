document.getElementById('year').textContent = new Date().getFullYear();

// Preserve UTM params when going to the store
function appendUTM(url) {
  const qs = window.location.search;
  if (!qs) return url;
  try{
    const u = new URL(url);
    const current = new URLSearchParams(window.location.search);
    current.forEach((v,k)=>u.searchParams.set(k,v));
    return u.toString();
  }catch(e){ return url + qs; }
}
document.querySelectorAll('a[href^="https://www.store.hidrostation.pt"]').forEach(a => {
  a.addEventListener('click', () => a.href = appendUTM(a.href), { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
  const allDetails = document.querySelectorAll('.faq-card details');
  allDetails.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        allDetails.forEach((other) => {
          if (other !== detail) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
});

// Strict accordion: only one <details> open at a time inside .faqs-grid
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faqs-grid').forEach(group => {
    const items = group.querySelectorAll('details');
    items.forEach(det => {
      const sum = det.querySelector('summary');
      if (!sum) return;
      sum.addEventListener('click', () => {
        items.forEach(other => { if (other !== det) other.removeAttribute('open'); });
      });
      // Extra safety on toggle as fallback
      det.addEventListener('toggle', () => {
        if (det.open) {
          items.forEach(other => { if (other !== det) other.removeAttribute('open'); });
        }
      });
    });
  });
});


// Robust accordion for FAQs: Brave/Chromium-safe
(function(){
  function setupFaqAccordion(){
    const groups = document.querySelectorAll('.faqs, .faqs-grid');
    groups.forEach(group => {
      const details = group.querySelectorAll('details');
      if (!details.length) return;

      // If multiple start open, close all but the first
      let firstOpenFound = false;
      details.forEach(d => {
        if (d.hasAttribute('open')) {
          if (!firstOpenFound) {
            firstOpenFound = true;
          } else {
            d.open = false;
          }
        }
      });

      // Close siblings when one opens
      details.forEach(d => {
        d.addEventListener('toggle', (ev) => {
          if (d.open) {
            details.forEach(o => { if (o !== d) o.open = false; });
          }
        }, true); // capture phase for better reliability
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFaqAccordion);
  } else {
    setupFaqAccordion();
  }

  // Extra safety: delegate clicks on summaries
  document.addEventListener('click', (e) => {
    const summary = e.target.closest('.faqs summary, .faqs-grid summary');
    if (!summary) return;
    const d = summary.closest('details');
    const group = summary.closest('.faqs, .faqs-grid');
    if (!d || !group) return;
    group.querySelectorAll('details').forEach(o => { if (o !== d) o.open = false; });
  }, true);
})();

