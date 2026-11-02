/* The Kingdom Villa — trilha sonora generativa (Web Audio), composta em tempo real.
   Instrumentos sintetizados: bordão (drone), lira dedilhada, flauta (ney) e tambor de moldura.
   © 2026 W. Carolino — CNPJ 69.610.819/0001-77. Um projeto VillaChurch. */
const Musica = (() => {
  let ctx = null, master = null, verb = null, verbGain = null, timer = null, atual = null;
  let volume = parseFloat(localStorage.getItem('kv_vol') ?? '0.6');
  let mudo = localStorage.getItem('kv_mudo') === '1';
  const voices = [];

  const TEMAS = {
    menu:    { raiz: 50, escala: [0, 2, 4, 5, 7, 9, 10], bpm: 58, drone: [0, 7], flauta: 0.5, tambor: 0.0, brilho: 1800 }, // ré mixolídio, majestoso
    jesus:   { raiz: 50, escala: [0, 2, 3, 5, 7, 9, 10], bpm: 62, drone: [0, 7], flauta: 0.6, tambor: 0.25, brilho: 1600 }, // ré dórico
    pedro:   { raiz: 45, escala: [0, 2, 3, 5, 7, 8, 10], bpm: 70, drone: [0, 7], flauta: 0.3, tambor: 0.45, brilho: 1500 }, // lá eólio, o mar
    batista: { raiz: 50, escala: [0, 1, 4, 5, 7, 8, 10], bpm: 54, drone: [0, 7], flauta: 0.8, tambor: 0.35, brilho: 1300 }, // ré hijaz, deserto
    paulo:   { raiz: 52, escala: [0, 1, 3, 5, 7, 8, 10], bpm: 66, drone: [0, 7], flauta: 0.4, tambor: 0.3, brilho: 2000 }, // mi frígio, Grécia
    tensao:  { raiz: 48, escala: [0, 1, 3, 5, 6, 8, 10], bpm: 50, drone: [0, 6], flauta: 0.2, tambor: 0.5, brilho: 900 },  // decisão
    final:   { raiz: 50, escala: [0, 2, 4, 5, 7, 9, 11], bpm: 52, drone: [0, 7, 12], flauta: 0.6, tambor: 0.0, brilho: 2200 } // ré maior
  };

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = mudo ? 0 : volume * 1.4;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.knee.value = 10;
    master.connect(comp); comp.connect(ctx.destination);
    // reverberação de sala de pedra
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    verb.buffer = ir; verbGain = ctx.createGain(); verbGain.gain.value = 0.55;
    verb.connect(verbGain); verbGain.connect(master);
  }

  function saida(g, seco = 0.7, molhado = 0.6) {
    const d = ctx.createGain(); d.gain.value = seco; g.connect(d); d.connect(master);
    const w = ctx.createGain(); w.gain.value = molhado; g.connect(w); w.connect(verb);
  }

  function drone(tema) {
    const g = ctx.createGain(); g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.5);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.Q.value = 0.7;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; const lg = ctx.createGain(); lg.gain.value = 180; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    const oscs = [lfo];
    tema.drone.forEach(iv => {
      [-6, 6].forEach(det => {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(tema.raiz - 12 + iv); o.detune.value = det;
        o.connect(lp); o.start(); oscs.push(o);
      });
    });
    lp.connect(g); saida(g, 0.6, 0.8);
    return { g, oscs };
  }

  function lira(nota, t, vel = 0.5, brilho = 1600) {
    const f = mtof(nota);
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = 'triangle'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f * 1.002;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(brilho * 2.2, t); lp.frequency.exponentialRampToValueAtTime(Math.max(300, brilho * 0.35), t + 0.9);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel * 0.38, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0008, t + 2.4);
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); saida(g, 0.7, 0.5);
    o1.start(t); o2.start(t); o1.stop(t + 2.5); o2.stop(t + 2.5);
  }

  function flauta(nota, t, dur, vel = 0.4) {
    const f = mtof(nota);
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const vib = ctx.createOscillator(); vib.frequency.value = 5.2; const vg = ctx.createGain(); vg.gain.value = f * 0.006; vib.connect(vg); vg.connect(o.frequency);
    // sopro
    const nb = ctx.createBuffer(1, ctx.sampleRate * (dur + 0.5), ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource(); n.buffer = nb; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 6; const ng = ctx.createGain(); ng.gain.value = 0.18;
    n.connect(bp); bp.connect(ng);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel * 0.12, t + 0.25); g.gain.setValueAtTime(vel * 0.12, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); ng.connect(g); saida(g, 0.5, 0.9);
    o.start(t); vib.start(t); n.start(t); o.stop(t + dur + 0.1); vib.stop(t + dur + 0.1); n.stop(t + dur + 0.1);
  }

  function tambor(t, forte = 1, vel = 0.3) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(forte ? 95 : 180, t); o.frequency.exponentialRampToValueAtTime(forte ? 52 : 120, t + 0.18);
    const g = ctx.createGain(); g.gain.setValueAtTime(vel * (forte ? 0.5 : 0.22), t); g.gain.exponentialRampToValueAtTime(0.001, t + (forte ? 0.5 : 0.18));
    o.connect(g); saida(g, 0.8, 0.25); o.start(t); o.stop(t + 0.6);
    const nb = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / nd.length);
    const n = ctx.createBufferSource(); n.buffer = nb; const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = forte ? 900 : 2500; const ng = ctx.createGain(); ng.gain.value = vel * 0.15;
    n.connect(hp); hp.connect(ng); saida(ng, 0.6, 0.2); n.start(t);
  }

  let liberado = !!window.kvDesktop, pendente = 'menu';
  function desbloquear() {
    liberado = true;
    init(); if (!ctx) return;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    // Safari/iOS: tocar um buffer silencioso dentro do gesto
    try { const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); } catch (e) {}
    if (!atual && pendente) { const t = pendente; pendente = null; tocar(t); }
  }
  ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'].forEach(ev =>
    window.addEventListener(ev, () => { if (!liberado || (ctx && ctx.state !== 'running')) desbloquear(); }, true));
  function tocar(nomeTema) {
    if (!liberado) { pendente = nomeTema; return; }
    init(); if (!ctx) return;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    if (atual === nomeTema) return;
    parar(true);
    atual = nomeTema;
    const tema = TEMAS[nomeTema] || TEMAS.menu;
    voices.push(drone(tema));
    const beat = 60 / tema.bpm;
    let proximo = ctx.currentTime + 0.6, passo = 0, grau = 0, oitava = 12;
    const frase = [];
    function gerarFrase() {
      frase.length = 0;
      for (let i = 0; i < 8; i++) {
        grau += [-2, -1, -1, 0, 1, 1, 2, 3, -3][Math.floor(Math.random() * 9)];
        grau = Math.max(-2, Math.min(9, grau));
        frase.push(Math.random() < 0.22 ? null : grau);
      }
      frase[7] = Math.random() < 0.5 ? 0 : 4; // cadência na tônica ou na quinta
    }
    function nota(g) { const e = tema.escala, n = e.length; const o = Math.floor(g / n), r = ((g % n) + n) % n; return tema.raiz + oitava + o * 12 + e[r]; }
    gerarFrase();
    function agendar() {
      while (proximo < ctx.currentTime + 0.8) {
        const i = passo % 16;
        if (i === 0 && passo > 0) gerarFrase();
        const g = frase[Math.floor(i / 2)];
        if (i % 2 === 0 && g !== null) {
          lira(nota(g), proximo, 0.45 + Math.random() * 0.25, tema.brilho);
          if (Math.random() < 0.35) lira(nota(g - 2), proximo + 0.02, 0.25, tema.brilho);
        } else if (Math.random() < 0.18 && g !== null) {
          lira(nota(g + 1), proximo, 0.25, tema.brilho);
        }
        if (i === 8 && Math.random() < tema.flauta) flauta(nota(frase[4] ?? 4) + 12, proximo, beat * 6, 0.5);
        if (tema.tambor > 0) {
          if (i % 8 === 0) tambor(proximo, 1, tema.tambor);
          else if (i % 8 === 3 || i % 8 === 6) tambor(proximo, 0, tema.tambor * 0.8);
        }
        proximo += beat / 2; passo++;
      }
    }
    timer = setInterval(agendar, 200); agendar();
  }

  function parar(rapido) {
    if (timer) clearInterval(timer); timer = null; atual = null;
    if (!ctx) return;
    while (voices.length) {
      const v = voices.pop(); const t = ctx.currentTime;
      v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(v.g.gain.value, t); v.g.gain.linearRampToValueAtTime(0, t + (rapido ? 1.5 : 3));
      v.oscs.forEach(o => { try { o.stop(t + 3.2); } catch (e) {} });
    }
  }

  function efeito(tipo) {
    if (!liberado) return; init(); if (!ctx || mudo) return;
    const t = ctx.currentTime;
    if (tipo === 'clique') lira(74, t, 0.25, 2500);
    if (tipo === 'decisao') { [62, 66, 69, 74].forEach((n, i) => lira(n, t + i * 0.09, 0.4, 2200)); }
    if (tipo === 'alerta') { [57, 56].forEach((n, i) => lira(n, t + i * 0.18, 0.5, 900)); tambor(t, 1, 0.5); }
    if (tipo === 'lord') { [69, 76, 81].forEach((n, i) => flauta(n, t + i * 0.15, 1.6, 0.35)); }
  }

  function setVolume(v) { volume = v; localStorage.setItem('kv_vol', v); if (master && !mudo) master.gain.value = v * 1.4; }
  function alternarMudo() { mudo = !mudo; localStorage.setItem('kv_mudo', mudo ? '1' : '0'); if (master) master.gain.value = mudo ? 0 : volume * 1.4; if (!mudo) desbloquear(); return mudo; }

  return { tocar, desbloquear, get liberado() { return liberado; }, parar, efeito, setVolume, alternarMudo, get mudo() { return mudo; }, get volume() { return volume; } };
})();
