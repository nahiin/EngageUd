/**
 * EngageU Hub — Navbar Loader
 * Fetches navbar.html, injects it, then executes its inline <script>.
 * All navbar logic (scroll, drawer, auth) lives inside navbar.html.
 *
 * Usage on any page:
 *   <div id="navbar-placeholder" data-page="partnerships"></div>
 *   <!-- data-transparent="true" only on pages with a transparent hero (index.html) -->
 *   <script src="js/navbar-load.js"></script>
 */
(function () {
    var ph = document.getElementById('navbar-placeholder');
    if (!ph) return;

    // Store config so the inline script inside navbar.html can read it
    window._navCfg = {
        transparent: ph.dataset.transparent === 'true',
        activePage:  ph.dataset.page || ''
    };

    fetch('navbar.html')
        .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.text();
        })
        .then(function (html) {
            // Separate HTML from inline <script> blocks
            // (innerHTML doesn't execute scripts — we do it manually)
            var scripts = [];
            var markup = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function (_, code) {
                scripts.push(code);
                return '';
            });

            // Inject the HTML
            var tmp = document.createElement('div');
            tmp.innerHTML = markup;
            var frag = document.createDocumentFragment();
            while (tmp.firstChild) frag.appendChild(tmp.firstChild);
            ph.replaceWith(frag);

            // Execute scripts in order
            scripts.forEach(function (code) {
                var s = document.createElement('script');
                s.textContent = code;
                document.head.appendChild(s);
                document.head.removeChild(s);
            });
        })
        .catch(function (e) {
            console.warn('[EngageU] Navbar failed to load:', e.message);
        });
})();
