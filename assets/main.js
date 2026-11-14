(function () {
  var d = document, html = d.documentElement, hero = d.querySelector('.hero');
  var WA = '351920488120';

  /* ---------- medidas do hero: quadro e nome cabem sempre no ecrã ---------- */
  var grande = d.getElementById('grande'), quadro = d.getElementById('quadro');
  /* no telemóvel a barra do navegador muda a altura ao rolar: medir uma vez e só refazer se a largura mudar */
  var toque = matchMedia('(hover: none)').matches, H0 = 0;
  function altura() { if (!toque) return innerHeight; if (!H0) H0 = innerHeight; return H0; }
  function ajustar() {
    var vw = html.clientWidth || innerWidth, vh = altura(), g = Math.max(16, Math.min(vw * .04, 56));
    var base = vh < 560 ? 70 : vw < 640 ? 230 : 300;
    var qh = Math.max(220, Math.min(vh - 84 - base - 60, (vw - 2 * g - 30) * 1.25, 760));
    hero.style.setProperty('--qh', qh + 'px'); hero.style.setProperty('--hh', vh + 'px');
    grande.style.setProperty('--fs', '100px');
    var r = grande.scrollWidth / 100;
    var alvo = Math.min(vw - 2 * g - 10, qh * .95);
    var fs = Math.max(48, alvo / r).toFixed(1) + 'px';
    hero.style.setProperty('--fs', fs); grande.style.setProperty('--fs', fs);
  }
  ajustar();
  var lw = html.clientWidth; addEventListener('resize', function () { var w = html.clientWidth; if (w === lw && toque) return; lw = w; H0 = 0; ajustar(); });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(ajustar);

  /* ---------- hero: a luz de estúdio acende sobre cada peça ----------
     A peça aparece no escuro e um foco abre do ponto de luz até a revelar inteira (~1,3 s).
     Só máscara e opacidade: leve também no telemóvel. */
  var PH = [
    { c: 'DaImiDPDEna', l: [.5, .32], r: ['Nº 1', 'Escaravelho · peito'], s: 'Preto e cinza' },
    { c: 'DbBu3LLjGZB', l: [.62, .3], r: ['Nº 2', 'Lata de sardinhas · perna'], s: 'A cores' },
    { c: 'DbqGOAbu8Ct', l: [.45, .3], r: ['Nº 3', 'Águia e caveira · braço'], s: 'Num só dia' },
    { c: 'Byi1tsClPnO', l: [.5, .4], r: ['Nº 4', 'Coruja · peito'], s: 'A cores' }
  ];
  var CICLO = 4800, LUZ = 1300;
  var jan = d.getElementById('qJanela'), qLuz = d.getElementById('qLuz'), selo = d.getElementById('qSelo'), peca = d.getElementById('peca');
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  PH.forEach(function (p) { var im = new Image(); im.src = 'assets/img/p/' + p.c + '.webp'; });
  function rotulo(p) {
    peca.style.opacity = 0; selo.classList.remove('on');
    setTimeout(function () { peca.children[0].textContent = p.r[1]; selo.textContent = p.s; peca.style.opacity = 1; selo.classList.add('on'); }, 220);
  }
  function abrir(i) {
    var p = PH[i], src = 'assets/img/p/' + p.c + '.webp';
    var lay = d.createElement('div'); lay.className = 'lay';
    lay.innerHTML = '<img class="base" src="' + src + '" alt=""><img class="luz" src="' + src + '" alt="' + p.r[1] + ', tatuagem realista de Will Salgado">';
    jan.appendChild(lay);
    var luz = lay.querySelector('.luz');
    lay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, fill: 'both' });
    var velhas = [].slice.call(jan.children).slice(0, -1);
    setTimeout(function () { velhas.forEach(function (v) { v.remove(); }); }, 320);
    luz.style.setProperty('--lx', p.l[0] * 100 + '%'); luz.style.setProperty('--ly', p.l[1] * 100 + '%');
    if (reduz) { luz.style.setProperty('--lr', '200%'); qLuz.textContent = '100%'; rotulo(p); return; }
    var t0 = performance.now();
    (function f(t) {
      var k = Math.min(1, (t - t0) / LUZ), e = 1 - Math.pow(1 - k, 3);
      luz.style.setProperty('--lr', (8 + e * 190).toFixed(1) + '%');
      luz.style.setProperty('--lx', (p.l[0] + (.5 - p.l[0]) * e) * 100 + '%');
      luz.style.setProperty('--ly', (p.l[1] + (.5 - p.l[1]) * e) * 100 + '%');
      qLuz.textContent = Math.round(e * 100) + '%';
      if (k < 1) requestAnimationFrame(f);
    })(t0);
    rotulo(p);
  }
  var atual = 0, vis = true;
  abrir(0);
  if (!reduz) {
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(quadro);
    setInterval(function () { if (!vis || d.hidden) return; atual = (atual + 1) % PH.length; abrir(atual); }, CICLO);
  }
  requestAnimationFrame(function () { hero.classList.add('pronto'); });

  /* ---------- topo e gaveta ---------- */
  var topo = d.getElementById('topo'), gav = d.getElementById('gaveta'), burger = d.getElementById('burger');
  function rolar() { topo.classList.toggle('solido', scrollY > 30); }
  addEventListener('scroll', rolar, { passive: true }); rolar();
  function gaveta(a) { gav.hidden = !a; burger.setAttribute('aria-expanded', a); d.body.style.overflow = a ? 'hidden' : ''; }
  burger.addEventListener('click', function () { gaveta(gav.hidden); });
  gav.addEventListener('click', function (e) { if (e.target.closest('a')) gaveta(false); });

  /* ---------- portfólio: preto e cinza e cor intercalados ---------- */
  var bg = PECAS.filter(function (p) { return p.t === 'bg'; }), cor = PECAS.filter(function (p) { return p.t === 'cor'; }), L = [];
  for (var i = 0; i < Math.max(bg.length, cor.length); i++) { if (bg[i]) L.push(bg[i]); if (i % 2 && cor[(i - 1) / 2]) L.push(cor[(i - 1) / 2]); }
  cor.forEach(function (p) { if (L.indexOf(p) < 0) L.push(p); });
  var grade = d.getElementById('grade'), mais = d.getElementById('mais'), filtro = 'todos';
  var passoN = matchMedia('(max-width:640px)').matches ? 8 : 12, limite = passoN;
  L.forEach(function (p, i) {
    var f = d.createElement('figure'); f.className = 'item'; f.tabIndex = 0; f.dataset.i = i;
    f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Ampliar: ' + p.l);
    f.innerHTML = '<div class="fr"><img src="assets/img/p/' + p.c + '.webp" alt="' + p.l + ', tatuagem de Will Salgado" width="800" height="1000"></div><figcaption><span>' + p.l + '</span><i>' + (p.t === 'cor' ? 'Cor' : 'P&amp;C') + '</i></figcaption>';
    grade.appendChild(f);
  });
  var itens = [].slice.call(grade.children);
  function visiveis() { return itens.filter(function (el) { return filtro === 'todos' || L[el.dataset.i].t === filtro; }); }
  function aplicar() {
    var v = visiveis();
    itens.forEach(function (el) { el.classList.add('sai'); });
    v.forEach(function (el, k) { if (k < limite) el.classList.remove('sai'); });
    mais.hidden = v.length <= limite;
  }
  aplicar();
  d.querySelectorAll('.filtros button').forEach(function (b) {
    b.addEventListener('click', function () {
      d.querySelectorAll('.filtros button').forEach(function (x) { x.classList.toggle('on', x === b); });
      filtro = b.dataset.f; limite = passoN; aplicar();
      grade.animate([{ opacity: .2, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,.84,.32,1)' });
    });
  });
  mais.addEventListener('click', function () { limite += passoN; aplicar(); });

  /* lightbox */
  var lb = d.getElementById('lb'), lbImg = d.getElementById('lbImg'), lbCap = d.getElementById('lbCap'), at = 0, lista = [];
  function abrirLb(i) { lista = visiveis().map(function (el) { return +el.dataset.i; }); at = Math.max(0, lista.indexOf(i)); mostrar(); lb.hidden = false; d.body.style.overflow = 'hidden'; }
  function mostrar() { var p = L[lista[at]]; lbImg.src = 'assets/img/p/' + p.c + '.webp'; lbImg.alt = p.l; lbCap.textContent = p.l; }
  function passo(n) { at = (at + n + lista.length) % lista.length; mostrar(); }
  function fechar() { lb.hidden = true; d.body.style.overflow = ''; }
  grade.addEventListener('click', function (e) { var f = e.target.closest('.item'); if (f) abrirLb(+f.dataset.i); });
  grade.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = e.target.closest('.item'); if (f) abrirLb(+f.dataset.i); } });
  d.getElementById('lbX').onclick = fechar;
  d.getElementById('lbP').onclick = function () { passo(-1); };
  d.getElementById('lbS').onclick = function () { passo(1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
  addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') fechar(); if (e.key === 'ArrowLeft') passo(-1); if (e.key === 'ArrowRight') passo(1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 45) passo(dx < 0 ? 1 : -1); tx = null; });

  /* ---------- marcação pelo WhatsApp ---------- */
  var form = d.getElementById('form'), erro = d.getElementById('erro');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form), nome = (f.get('nome') || '').trim();
    if (!nome) { erro.hidden = false; form.nome.focus(); return; }
    erro.hidden = true;
    var l = ['Olá Will! Sou *' + nome + '* e gostava de marcar uma sessão.', '',
      '*Estilo:* ' + f.get('estilo'), '*Cobertura:* ' + f.get('cob'),
      '*Zona do corpo:* ' + ((f.get('zona') || '').trim() || 'a definir'),
      '*Tamanho:* ' + f.get('tamanho'), '*Disponibilidade:* ' + f.get('quando')];
    var ideia = (f.get('ideia') || '').trim();
    if (ideia) l.push('', '*Ideia:* ' + ideia);
    l.push('', '(pedido enviado pelo site)');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(l.join('\n')), '_blank', 'noopener');
  });
})();
