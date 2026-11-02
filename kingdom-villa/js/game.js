/* The Kingdom Villa — motor do jogo
   © 2026 W. Carolino — CNPJ 69.610.819/0001-77. Um projeto desenvolvido por VillaChurch. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const app = $('#app');
  const IMG = n => `assets/img/${n}.jpg`;
  const PA_TURNO = 3;
  const SLOTS = [1, 2, 3];
  let E = null; // estado da partida

  /* ---------------- utilidades ---------------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const camp = () => CAMPANHAS[E.camp];
  const cap = () => camp().capitulos[E.cap];
  const acoesDe = c => { const a = {}; for (const k in ACOES_BASE) a[k] = { ...ACOES_BASE[k], ...(CAMPANHAS[c].acoes?.[k] || {}) }; return a; };

  function fundo(img, escuro = 0.55) {
    $('#bg').style.backgroundImage = `linear-gradient(rgba(10,8,20,${escuro}), rgba(10,8,20,${escuro + 0.15})), url('${IMG(img)}')`;
  }
  function tela(html, classe = '') {
    app.className = 'tela ' + classe;
    app.innerHTML = html;
    app.scrollTop = 0;
    app.querySelectorAll('[data-som]').forEach(b => b.addEventListener('click', () => Musica.efeito('clique')));
  }
  function modal(html, opts = {}) {
    const m = document.createElement('div'); m.className = 'modal-fundo';
    m.innerHTML = `<div class="modal ${opts.classe || ''}">${html}</div>`;
    document.body.appendChild(m);
    const fechar = () => m.remove();
    if (opts.fechavel !== false) m.addEventListener('click', e => { if (e.target === m) fechar(); });
    m.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', fechar));
    return { el: m, fechar };
  }
  function aviso(txt) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = txt; document.body.appendChild(t);
    setTimeout(() => t.classList.add('sai'), 2600); setTimeout(() => t.remove(), 3200);
  }
  function efeitosTexto(ef) {
    return Object.entries(ef || {}).filter(([, v]) => v).map(([k, v]) =>
      `<span class="ef ${v > 0 ? (k === 'opo' ? 'ruim' : 'bom') : (k === 'opo' ? 'bom' : 'ruim')}">${ICO(k)} ${STATS[k].nome} ${v > 0 ? '+' : ''}${v}</span>`).join(' ');
  }
  function aplicar(ef) {
    for (const k in ef) { E.stats[k] = clamp((E.stats[k] || 0) + ef[k], k === 'prov' ? -30 : 0, k === 'seg' || k === 'inf' ? 999 : 100); }
  }
  function rotuloFid(f) { for (const [m, n] of NOMES_FIDELIDADE) if (f >= m) return n; return 'Outra história'; }

  /* ---------------- HUD ---------------- */
  function hud() {
    const s = E.stats;
    return `<header class="hud">
      <div class="hud-pers"><img src="${IMG(camp().retrato)}" alt=""><div><b>${esc(camp().nome)}</b><small>Cap. ${E.cap + 1}/${camp().capitulos.length} · ${esc(cap().titulo)}</small></div></div>
      <div class="hud-stats">${Object.keys(STATS).map(k => `<div class="st st-${k}" title="${esc(STATS[k].desc)}"><span>${ICO(k)}</span><b>${s[k]}</b><small>${STATS[k].nome}</small>${k !== 'seg' && k !== 'inf' ? `<i style="width:${clamp(s[k], 0, 100)}%;background:${STATS[k].cor}"></i>` : ''}</div>`).join('')}
        <div class="st st-fid" title="Quanto sua jornada se mantém fiel ao relato bíblico."><span>${ICO('fid')}</span><b>${E.fid}%</b><small>${rotuloFid(E.fid)}</small><i style="width:${E.fid}%;background:#d9c4ff"></i></div>
      </div>
      <div class="hud-bt"><button class="ico" id="bt-salvar" title="Salvar" data-som>${ICO('salvar')}</button><button class="ico" id="bt-som" title="Som" data-som>${ICO(Musica.mudo ? 'somoff' : 'somon')}</button><button class="ico" id="bt-menu" title="Menu" data-som>${ICO('menu')}</button></div>
    </header>`;
  }
  function ligarHud() {
    $('#bt-salvar')?.addEventListener('click', () => telaSalvar(true));
    $('#bt-som')?.addEventListener('click', () => { $('#bt-som').innerHTML = ICO(Musica.alternarMudo() ? 'somoff' : 'somon'); });
    $('#bt-menu')?.addEventListener('click', menuPausa);
  }
  function menuPausa() {
    const m = modal(`<h2>Pausa</h2><div class="col">
      <button class="bt" data-a="salvar">Salvar jogo</button>
      <button class="bt" data-a="carregar">Carregar jogo</button>
      <button class="bt" data-a="opcoes">Opções</button>
      <button class="bt sec" data-a="sair">Voltar ao menu principal</button>
      <button class="bt sec" data-fechar>Continuar</button></div>`);
    m.el.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
      m.fechar(); const a = b.dataset.a;
      if (a === 'salvar') telaSalvar(true); if (a === 'carregar') telaSalvar(false); if (a === 'opcoes') opcoes();
      if (a === 'sair') { autosave(); menu(); }
    }));
  }

  /* ---------------- Lord ---------------- */
  function lordBox(txt, titulo = 'Lord') {
    return `<aside class="lord"><img src="assets/img/lord.jpg" alt=""><div><b>${titulo}</b><p>${txt}</p></div></aside>`;
  }
  function conselhoGestao() {
    const s = E.stats, c = cap(), dicas = [];
    if (s.opo >= 75) dicas.push('A oposição está perigosamente alta. Em 100, você será detido antes da hora. Retire-se discretamente ou ore antes de pregar outra vez.');
    if (s.prov < 8) dicas.push('As provisões estão no fim. Sem pão, a fadiga corrói a fé. Dedique um esforço a trabalhar e prover.');
    if (s.fe < 40) dicas.push('Sua fé está fraca, e decisões difíceis se aproximam. "Vigiai e orai" (Mt 26:41).');
    if (!dicas.length && s.sab < 40) dicas.push('Meditar nas Escrituras vai ajudá-lo a ler o momento com discernimento.');
    if (!dicas.length && s.seg < 10 && E.camp !== 'jesus') dicas.push('Poucos caminham com você. Servir e pregar alcança pessoas, mas atrai olhares.');
    if (!dicas.length) dicas.push(`Equilíbrio é sabedoria. Este capítulo termina com uma decisão sobre "${esc(c.titulo)}". Chegue a ela com fé firme e oposição sob controle.`);
    return dicas[0];
  }
  function analiseOpcao(o) {
    const linhas = [];
    if (o.biblico) linhas.push('<b class="tag bib">Relato bíblico</b> Esta escolha segue o texto das Escrituras.');
    if (o.lord) linhas.push('<b class="tag lordt">Conselho do Lord</b> É o caminho que eu recomendo.');
    if (o.teste) {
      const v = E.stats[o.teste.stat], ok = v >= o.teste.min;
      linhas.push(`Exige ${STATS[o.teste.stat].nome} ≥ ${o.teste.min}. Você tem ${v}. ${ok ? 'Você tem força para sustentar esta escolha.' : '<span class="ruim">Sua força atual provavelmente não basta.</span>'}`);
    }
    if (o.fid) linhas.push(`Fidelidade ao relato: ${o.fid}%.`);
    if (o.fim) linhas.push('<span class="ruim">Esta escolha encerra a campanha num final alternativo.</span>');
    return linhas.join('<br>');
  }

  /* ---------------- telas ---------------- */
  function abertura() {
    fundo('title', 0.25);
    if (!localStorage.getItem('kv_termos_ok')) return aceitarTermos();
    if (Nuvem.exigeLogin && !Nuvem.logado) return login();
    menu();
  }

  function aceitarTermos() {
    tela(`<div class="painel largo termos-aceite">
      <img class="logo-p" src="assets/img/logo.png" alt="">
      <h1 class="titulo-jogo">The Kingdom Villa</h1>
      <div class="legal rolagem">${LEGAL.termos}</div>
      <label class="chk"><input type="checkbox" id="ok"> Li e aceito os Termos de Uso e a Licença.</label>
      <button class="bt" id="seg" disabled>Continuar</button></div>`);
    $('#ok').addEventListener('change', e => $('#seg').disabled = !e.target.checked);
    $('#seg').addEventListener('click', () => { localStorage.setItem('kv_termos_ok', LEGAL.versao); abertura(); });
  }

  function login() {
    tela(`<div class="painel login">
      <img class="logo-p" src="assets/img/logo.png" alt="">
      <h1 class="titulo-jogo">The Kingdom Villa</h1>
      <p class="sub">Entre para jogar online. Seu progresso fica salvo na sua conta.</p>
      <form id="f"><input type="email" id="em" placeholder="E-mail" required autocomplete="email">
      <input type="password" id="se" placeholder="Senha (mín. 6 caracteres)" required minlength="6" autocomplete="current-password">
      <div class="linha"><button class="bt" type="submit" data-m="entrar">Entrar</button><button class="bt sec" type="submit" data-m="criar">Criar conta</button></div>
      <a href="#" id="esq">Esqueci minha senha</a><p class="erro" id="er"></p></form></div>`);
    let modo = 'entrar';
    app.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => modo = b.dataset.m));
    $('#f').addEventListener('submit', async e => {
      e.preventDefault(); $('#er').textContent = 'Aguarde…';
      try {
        const em = $('#em').value.trim(), se = $('#se').value;
        if (modo === 'criar') await Nuvem.criarConta(em, se); else await Nuvem.entrar(em, se);
        await sincronizarDaNuvem(); menu();
      } catch (err) { $('#er').textContent = err.message; }
    });
    $('#esq').addEventListener('click', async e => {
      e.preventDefault(); const em = $('#em').value.trim(); if (!em) { $('#er').textContent = 'Digite seu e-mail primeiro.'; return; }
      try { await Nuvem.recuperar(em); $('#er').textContent = 'Enviamos um link de redefinição para ' + em + '.'; } catch (err) { $('#er').textContent = err.message; }
    });
  }

  function menu() {
    fundo('title', 0.2); Musica.tocar('menu');
    const temSave = !!lerSave(0);
    tela(`<div class="menu-principal">
      <img class="logo" src="assets/img/logo.png" alt="">
      <h1 class="titulo-jogo">The Kingdom Villa</h1>
      <p class="sub">Viva o Novo Testamento. Escolha seu caminho.</p>
      <nav class="col">
        ${temSave ? '<button class="bt" id="m-cont" data-som>Continuar</button>' : ''}
        <button class="bt" id="m-novo" data-som>Nova jornada</button>
        <button class="bt sec" id="m-carr" data-som>Carregar jogo</button>
        <button class="bt sec" id="m-opc" data-som>Opções</button>
        <button class="bt sec" id="m-ter" data-som>Termos e créditos</button>
        ${window.kvDesktop ? '<button class="bt sec" id="m-sair" data-som>Sair</button>' : ''}
        ${Nuvem.logado ? `<button class="bt sec" id="m-logout" data-som>Sair da conta (${esc(Nuvem.email || '')})</button>` : ''}
      </nav>
      ${window.kvDesktop ? '' : `<p class="baixar">Jogue offline: <a href="https://github.com/eeuseniormy-afk/seniormy-site/releases/download/kingdom-villa-v1.0.1/TheKingdomVilla-1.0.1-Mac-Intel.zip">Mac (Intel, 10.15+)</a> · <a href="https://github.com/eeuseniormy-afk/seniormy-site/releases/download/kingdom-villa-v1.0.1/TheKingdomVilla-1.0.1-Windows-x64.zip">Windows (10/11)</a></p>`}
      <footer class="rodape">© ${LEGAL.ano} ${LEGAL.titular} — CNPJ ${LEGAL.cnpj} · Um projeto desenvolvido por ${LEGAL.estudio} · v${LEGAL.versao}</footer>
    </div>`, 'centro');
    $('#m-cont')?.addEventListener('click', () => carregar(lerSave(0)));
    $('#m-novo').addEventListener('click', escolherPersonagem);
    $('#m-carr').addEventListener('click', () => telaSalvar(false));
    $('#m-opc').addEventListener('click', opcoes);
    $('#m-ter').addEventListener('click', termos);
    $('#m-sair')?.addEventListener('click', () => window.close());
    $('#m-logout')?.addEventListener('click', () => { Nuvem.sair(); abertura(); });
  }

  function termos() {
    const m = modal(`<div class="legal rolagem">${LEGAL.termos}${LEGAL.creditos}</div><button class="bt" data-fechar>Fechar</button>`, { classe: 'grande' });
  }
  function opcoes() {
    const m = modal(`<h2>Opções</h2>
      <label class="op">Volume da música <input type="range" min="0" max="1" step="0.05" value="${Musica.volume}" id="vol"></label>
      <label class="chk"><input type="checkbox" id="mud" ${Musica.mudo ? 'checked' : ''}> Silenciar</label>
      <label class="op">Velocidade do texto <select id="vel"><option value="1">Normal</option><option value="0">Instantâneo</option></select></label>
      <div class="col"><button class="bt sec" id="exp">Exportar jogos salvos (arquivo)</button><button class="bt sec" id="imp">Importar jogos salvos</button></div>
      <button class="bt" data-fechar>Fechar</button>`);
    $('#vol', m.el).addEventListener('input', e => Musica.setVolume(parseFloat(e.target.value)));
    $('#mud', m.el).addEventListener('change', () => Musica.alternarMudo());
    const vel = $('#vel', m.el); vel.value = localStorage.getItem('kv_texto') ?? '1'; vel.addEventListener('change', () => localStorage.setItem('kv_texto', vel.value));
    $('#exp', m.el).addEventListener('click', exportar);
    $('#imp', m.el).addEventListener('click', importar);
  }

  function escolherPersonagem() {
    fundo('title', 0.6); Musica.tocar('menu');
    const ordem = ['jesus', 'pedro', 'batista', 'paulo'];
    tela(`<div class="escolha">
      <h1>Quem você será?</h1>
      <p class="sub">Cada campanha tem quatro capítulos históricos, decisões com consequências e finais diferentes.</p>
      <div class="cartas">${ordem.map(k => { const c = CAMPANHAS[k]; return `
        <button class="carta" data-c="${k}" data-som>
          <div class="carta-img" style="background-image:url('${IMG(c.retrato)}')"></div>
          <div class="carta-txt"><small>${esc(c.titulo)}</small><h3>${esc(c.nome)}</h3><em>${esc(c.epoca)}</em><p>${esc(c.resumo)}</p></div>
        </button>`; }).join('')}</div>
      <button class="bt sec" id="volt" data-som>Voltar</button></div>`);
    app.querySelectorAll('.carta').forEach(b => b.addEventListener('click', () => novaPartida(b.dataset.c)));
    $('#volt').addEventListener('click', menu);
  }

  function novaPartida(c) {
    E = { v: 1, camp: c, cap: 0, fase: 'intro', turno: 1, pa: PA_TURNO, stats: { ...CAMPANHAS[c].inicio }, fid: 100, escolhas: [], eventosVistos: [], inicio: Date.now(), ts: Date.now() };
    const nota = CAMPANHAS[c].nota;
    if (nota) {
      const m = modal(`${lordBox(esc(nota), 'Antes de começar')}<button class="bt" data-fechar>Entendi</button>`, { fechavel: false });
      m.el.querySelector('[data-fechar]').addEventListener('click', () => irPara());
    } else irPara();
  }

  function irPara() {
    autosave();
    ({ intro: intro, gestao: gestao, decisao: decisao, resultado: resultado, fim: fim })[E.fase]();
  }

  /* --- digitação suave --- */
  function digitar(el, paragrafos, cb) {
    const rapido = localStorage.getItem('kv_texto') === '0';
    el.innerHTML = paragrafos.map(p => `<p>${esc(p)}</p>`).join('');
    if (rapido) return cb && cb();
    const ps = [...el.querySelectorAll('p')]; const textos = ps.map(p => p.textContent); ps.forEach(p => p.textContent = '');
    let i = 0, j = 0, pular = false;
    el.addEventListener('click', () => pular = true, { once: true });
    (function passo() {
      if (pular) { ps.forEach((p, k) => p.textContent = textos[k]); return cb && cb(); }
      if (i >= ps.length) return cb && cb();
      ps[i].textContent = textos[i].slice(0, j += 2);
      if (j >= textos[i].length) { i++; j = 0; setTimeout(passo, 280); } else setTimeout(passo, 16);
    })();
  }

  function intro() {
    const c = cap(); fundo(c.img, 0.15); Musica.tocar(camp().trilha);
    tela(`${hud()}
      <section class="cena">
        <div class="cena-txt painel">
          <small class="cap-n">Capítulo ${E.cap + 1}</small>
          <h1>${esc(c.titulo)}</h1>
          <div class="ref">${ICO('rolo')} ${esc(c.ref)} · ${ICO('local')} ${esc(LOCAIS[camp().mapa].pontos[c.local].nome)}</div>
          <div id="narr" class="narr"></div>
          <button class="bt" id="seg" data-som style="visibility:hidden">Continuar</button>
        </div>
      </section>`);
    ligarHud();
    digitar($('#narr'), c.intro, () => $('#seg').style.visibility = 'visible');
    $('#seg').addEventListener('click', () => { E.fase = 'gestao'; E.turno = 1; E.pa = PA_TURNO; irPara(); });
  }

  function mapaHtml() {
    const M = LOCAIS[camp().mapa], c = cap();
    const visitados = camp().capitulos.slice(0, E.cap + 1).map(x => x.local);
    const pts = Object.entries(M.pontos).map(([k, p]) => {
      const atual = k === c.local, vis = visitados.includes(k);
      return `<g class="pt ${atual ? 'atual' : ''} ${vis ? 'vis' : ''}"><circle cx="${p.x}" cy="${p.y}" r="${atual ? 14 : 8}"/>${atual || vis ? (p.x > 1000 ? `<text x="${p.x - 18}" y="${p.y + 6}" text-anchor="end">${esc(p.nome)}</text>` : `<text x="${p.x + 18}" y="${p.y + 6}">${esc(p.nome)}</text>`) : ''}</g>`;
    }).join('');
    const rota = visitados.map(k => M.pontos[k]).map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
    return `<svg class="mapa" viewBox="0 0 1408 768" preserveAspectRatio="xMidYMid slice"><image href="${IMG(M.img)}" width="1408" height="768"/>
      <path d="${rota}" class="rota"/>${pts}</svg>`;
  }

  function gestao() {
    const c = cap(); fundo(c.img, 0.6); Musica.tocar(camp().trilha);
    const A = acoesDe(E.camp);
    tela(`${hud()}
      <section class="gestao">
        <div class="g-mapa painel">${mapaHtml()}<div class="g-local">${ICO('local')} ${esc(LOCAIS[camp().mapa].pontos[c.local].nome)} · Estação ${E.turno} de ${c.turnos}</div></div>
        <div class="g-acoes painel">
          <h2>Planeje a estação</h2>
          <p class="sub">Você tem <b id="pa">${E.pa}</b> de ${PA_TURNO} esforços nesta estação.</p>
          <div class="lista-acoes">${Object.entries(A).map(([k, a]) => `
            <button class="acao" data-a="${k}" ${E.pa < a.pa ? 'disabled' : ''} data-som>
              <b>${esc(a.nome)}</b><span>${efeitosTexto(a.ef)}</span></button>`).join('')}</div>
          <div id="log" class="log"></div>
          <button class="bt" id="fim-turno" data-som>${E.turno < c.turnos ? 'Encerrar estação' : 'Seguir para a decisão'}</button>
        </div>
        ${lordBox(conselhoGestao())}
      </section>`);
    ligarHud();
    app.querySelectorAll('.acao').forEach(b => b.addEventListener('click', () => {
      const a = A[b.dataset.a]; if (E.pa < a.pa) return;
      E.pa -= a.pa; aplicar(a.ef);
      const log = E.log = (E.log || []); log.unshift(a.txt);
      if (verificarDetencao()) return;
      gestao(); $('#log').innerHTML = log.slice(0, 3).map(t => `<p>${esc(t)}</p>`).join('');
    }));
    $('#fim-turno').addEventListener('click', () => {
      if (E.pa > 0) {
        const m = modal(`<h2>Ainda há esforços disponíveis</h2><p>Você ainda tem ${E.pa} ${E.pa === 1 ? 'esforço' : 'esforços'} nesta estação. Quer seguir mesmo assim? Tempo não usado vira descanso (+2 Fé por esforço).</p>
          <div class="linha"><button class="bt" id="sim">Seguir</button><button class="bt sec" data-fechar>Voltar</button></div>`);
        $('#sim', m.el).addEventListener('click', () => { aplicar({ fe: 2 * E.pa }); m.fechar(); fimTurno(); });
      } else fimTurno();
    });
    if (E.log) $('#log').innerHTML = E.log.slice(0, 3).map(t => `<p>${esc(t)}</p>`).join('');
  }

  function fimTurno() {
    E.log = [];
    if (E.stats.prov < 0) { aplicar({ fe: -6 }); aviso('Fome e cansaço: −6 Fé'); }
    aplicar({ prov: -3 }); // consumo da estação
    const pool = EVENTOS.filter(ev => !E.eventosVistos.includes(ev.id));
    const ev = (pool.length ? pool : EVENTOS)[Math.floor(Math.random() * (pool.length || EVENTOS.length))];
    E.eventosVistos.push(ev.id);
    const m = modal(`<h2>Acontecimento</h2><p class="ev-txt">${esc(ev.txt)}</p>
      <div class="col"><button class="bt" data-o="a">${esc(ev.a.txt)}<br><small>${efeitosTexto(ev.a.ef)}</small></button>
      <button class="bt sec" data-o="b">${esc(ev.b.txt)}<br><small>${efeitosTexto(ev.b.ef)}</small></button></div>
      <p class="ref-peq">Para pensar: ${esc(ev.ref)}</p>`, { fechavel: false });
    m.el.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
      aplicar(ev[b.dataset.o].ef); m.fechar();
      if (verificarDetencao()) return;
      if (E.turno < cap().turnos) { E.turno++; E.pa = PA_TURNO; } else { E.fase = 'decisao'; }
      irPara();
    }));
  }

  function verificarDetencao() {
    if (E.stats.opo >= 100) {
      E.fase = 'fim'; E.final = 'detido'; Musica.efeito('alerta'); irPara(); return true;
    }
    return false;
  }

  function decisao() {
    const c = cap(), d = c.decisao; fundo(c.img, 0.2); Musica.tocar('tensao');
    tela(`${hud()}
      <section class="decisao">
        <div class="painel dec-box">
          <small class="cap-n">Momento decisivo · ${esc(c.ref)}</small>
          <h2>${esc(d.pergunta)}</h2>
          <div class="opcoes">${d.opcoes.map((o, i) => `
            <button class="opcao" data-i="${i}" data-som>
              <span class="tags">${o.biblico ? '<b class="tag bib">Relato bíblico</b>' : '<b class="tag alt">Caminho alternativo</b>'}${o.lord ? '<b class="tag lordt">Conselho do Lord</b>' : ''}</span>
              <span class="op-txt">${esc(o.txt)}</span></button>`).join('')}</div>
        </div>
        ${lordBox(esc(d.lord))}
      </section>`);
    ligarHud(); Musica.efeito('lord');
    app.querySelectorAll('.opcao').forEach(b => b.addEventListener('click', () => confirmar(d.opcoes[+b.dataset.i], +b.dataset.i)));
  }

  function confirmar(o, i) {
    const m = modal(`<h2>${o.biblico ? 'Seguir o relato' : 'Mudar o curso da história?'}</h2>
      <p class="op-escolhida">“${esc(o.txt)}”</p>
      ${o.aviso ? `<div class="aviso-cons"><b>${ICO('alerta')} Consequências para o relato bíblico</b><p>${esc(o.aviso)}</p></div>` : ''}
      <div class="analise">${analiseOpcao(o)}</div>
      <p class="prev">Efeitos previstos: ${efeitosTexto(o.ef)}</p>
      <div class="linha"><button class="bt" id="conf">Decidir</button><button class="bt sec" data-fechar>Reconsiderar</button></div>`);
    if (!o.biblico) Musica.efeito('alerta');
    $('#conf', m.el).addEventListener('click', () => { m.fechar(); decidir(o, i); });
  }

  function decidir(o, i) {
    let ef = o.ef, res = o.res, falhou = false;
    if (o.teste && E.stats[o.teste.stat] < o.teste.min && o.falha) { ef = o.falha.ef; res = o.falha.res; falhou = true; }
    aplicar(ef); if (o.extra) aplicar(o.extra);
    E.fid = clamp(E.fid + (o.fid || 0), 0, 100);
    const biblica = cap().decisao.opcoes.find(x => x.biblico);
    E.escolhas.push({ cap: E.cap, titulo: cap().titulo, ref: cap().ref, escolha: o.txt, biblico: !!o.biblico, lord: !!o.lord, falhou, relato: (biblica?.txt || '').replace(/\s*\(Como no relato bíblico\.\)/, ''), res });
    E.ultimo = { res, ef, extra: o.extra, falhou, fim: o.fim, biblico: !!o.biblico };
    Musica.efeito('decisao');
    E.fase = 'resultado'; irPara();
  }

  function resultado() {
    const c = cap(), u = E.ultimo; fundo(c.img, 0.3); Musica.tocar(camp().trilha);
    if (E.stats.opo >= 100 && !u.fim) { E.fase = 'fim'; E.final = 'detido'; return irPara(); }
    tela(`${hud()}
      <section class="cena">
        <div class="painel cena-txt">
          <small class="cap-n">${u.biblico ? 'Como nas Escrituras' : u.falhou ? 'O plano falhou' : 'A história mudou'}</small>
          <h2>${esc(c.titulo)}</h2>
          <div id="narr" class="narr"></div>
          <p class="prev">${efeitosTexto(u.ef)} ${u.extra ? efeitosTexto(u.extra) : ''}</p>
          <div class="curio"><b>${ICO('lupa')} Curiosidade histórica</b><p>${esc(c.curiosidade.txt)}</p><p class="refs">Para estudar: ${c.curiosidade.refs.map(esc).join(' · ')}</p></div>
          <button class="bt" id="seg" data-som>${u.fim || E.cap + 1 >= camp().capitulos.length ? 'Ver o desfecho' : 'Próximo capítulo'}</button>
        </div>
      </section>`);
    ligarHud();
    digitar($('#narr'), [u.res]);
    $('#seg').addEventListener('click', () => {
      if (u.fim) { E.fase = 'fim'; E.final = u.fim; }
      else if (E.cap + 1 >= camp().capitulos.length) { E.fase = 'fim'; E.final = E.fid >= 95 ? 'biblico' : 'alternativo'; }
      else { E.cap++; E.fase = 'intro'; E.turno = 1; E.pa = PA_TURNO; }
      irPara();
    });
  }

  function fim() {
    const C = camp();
    let F = C.finais[E.final];
    if (E.final === 'detido') F = { titulo: 'Detido antes da hora', img: cap().img, txt: ['A oposição chegou ao limite. Soldados e guardas o prenderam antes que sua missão se cumprisse.', 'Nas Escrituras, os personagens também foram perseguidos, mas a prudência os preservou até o tempo certo (Jo 7:30; At 9:23-25). Gerencie melhor a oposição na próxima jornada.'], refs: ['Jo 7:30', 'At 9:23-25', 'Mt 10:16'] };
    if (E.final === 'alternativo') {
      const desvios = E.escolhas.filter(e => !e.biblico);
      F = { titulo: 'Uma história diferente', img: C.retrato, txt: [`Você chegou ao fim da jornada de ${C.nome}, mas por outro caminho. ${desvios.length === 1 ? 'Uma decisão divergiu' : desvios.length + ' decisões divergiram'} do relato bíblico.`, 'Os desvios mudaram pessoas, lugares e o destino da mensagem. Compare abaixo o seu caminho com o das Escrituras e descubra o que estaria em jogo.', ...C.finais.biblico.txt.slice(0, 1).map(t => 'No relato bíblico: ' + t)], refs: C.finais.biblico.refs };
    }
    fundo(F.img || 'title', 0.35); Musica.tocar('final');
    const s = E.stats;
    const reino = Math.round(s.seg * 1.2 + s.inf + s.fe * 0.8 + s.sab * 0.6 - s.opo * 0.3 + E.fid * 1.5);
    localStorage.removeItem('kv_save_0');
    const conquistas = JSON.parse(localStorage.getItem('kv_conquistas') || '{}');
    conquistas[E.camp + ':' + E.final] = Date.now(); localStorage.setItem('kv_conquistas', JSON.stringify(conquistas));
    const finaisVistos = Object.keys(conquistas).filter(k => k.startsWith(E.camp + ':')).length;
    const totalFinais = Object.keys(C.finais).length + 2;
    tela(`<section class="final">
      <div class="painel cena-txt">
        <small class="cap-n">Desfecho · ${esc(C.nome)}</small>
        <h1>${esc(F.titulo)}</h1>
        <div class="narr">${F.txt.map(t => `<p>${esc(t)}</p>`).join('')}</div>
        <p class="refs">Para estudar: ${F.refs.map(esc).join(' · ')}</p>
        <div class="placar"><div><b>${reino}</b><small>Pontos do Reino</small></div><div><b>${E.fid}%</b><small>${rotuloFid(E.fid)}</small></div><div><b>${finaisVistos}/${totalFinais}</b><small>Finais descobertos</small></div></div>
        <h3>Sua jornada × o relato bíblico</h3>
        <table class="linha-tempo"><tr><th>Capítulo</th><th>Sua escolha</th><th>Nas Escrituras</th></tr>
        ${E.escolhas.map(e => `<tr class="${e.biblico ? 'ok' : 'div'}"><td>${esc(e.titulo)}<small>${esc(e.ref)}</small></td><td>${ICO(e.biblico ? 'ok' : 'desvio')} ${esc(e.escolha)}</td><td>${esc(e.relato || '')}</td></tr>`).join('')}</table>
        <div class="linha"><button class="bt" id="nova" data-som>Nova jornada</button><button class="bt sec" id="rep" data-som>Repetir ${esc(C.nome)}</button><button class="bt sec" id="men" data-som>Menu</button></div>
      </div></section>`);
    $('#nova').addEventListener('click', escolherPersonagem);
    $('#rep').addEventListener('click', () => novaPartida(E.camp));
    $('#men').addEventListener('click', menu);
  }

  /* ---------------- salvar / carregar ---------------- */
  function lerSave(slot) { try { return JSON.parse(localStorage.getItem('kv_save_' + slot) || 'null'); } catch (e) { return null; } }
  function gravarSave(slot, dados) {
    localStorage.setItem('kv_save_' + slot, JSON.stringify(dados));
    if (Nuvem.logado) Nuvem.enviarSave(slot, dados).then(ok => { if (!ok && slot) aviso('Salvo neste aparelho. A nuvem não respondeu.'); });
  }
  function autosave() { if (E && E.fase !== 'fim') { E.ts = Date.now(); gravarSave(0, E); } }
  async function sincronizarDaNuvem() {
    const lista = await Nuvem.baixarSaves(); if (!lista) return;
    lista.forEach(r => { const loc = lerSave(r.slot); if (!loc || (r.data.ts || 0) > (loc.ts || 0)) localStorage.setItem('kv_save_' + r.slot, JSON.stringify(r.data)); });
  }
  function descSave(s) {
    if (!s) return '<em>Vazio</em>';
    const C = CAMPANHAS[s.camp];
    return `<b>${esc(C.nome)}</b> · Cap. ${s.cap + 1}: ${esc(C.capitulos[s.cap].titulo)}<br><small>${new Date(s.ts).toLocaleString('pt-BR')} · Fidelidade ${s.fid}%</small>`;
  }
  function telaSalvar(salvando) {
    if (salvando && !E) return aviso('Nenhuma jornada em andamento.');
    const linhas = [0, ...SLOTS].filter(n => salvando ? n !== 0 : true);
    const m = modal(`<h2>${salvando ? 'Salvar jornada' : 'Carregar jornada'}</h2>
      ${Nuvem.logado ? `<p class="sub">Sincronizado com a conta ${esc(Nuvem.email || '')}.</p>` : '<p class="sub">Salvo neste aparelho.</p>'}
      <div class="slots">${linhas.map(n => { const s = lerSave(n); return `
        <div class="slot"><div class="slot-desc"><small>${n === 0 ? 'Salvamento automático' : 'Espaço ' + n}</small>${descSave(s)}</div>
        <div class="slot-bt">${salvando ? `<button class="bt" data-s="${n}">Salvar aqui</button>` : (s ? `<button class="bt" data-c="${n}">Carregar</button>` : '')}
        ${s && n !== 0 ? `<button class="bt sec" data-x="${n}">Apagar</button>` : ''}</div></div>`; }).join('')}</div>
      <button class="bt sec" data-fechar>Fechar</button>`);
    m.el.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { E.ts = Date.now(); gravarSave(+b.dataset.s, E); m.fechar(); aviso('Jornada salva.'); }));
    m.el.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { m.fechar(); carregar(lerSave(+b.dataset.c)); }));
    m.el.querySelectorAll('[data-x]').forEach(b => b.addEventListener('click', () => {
      if (!confirm('Apagar este jogo salvo?')) return;
      localStorage.removeItem('kv_save_' + b.dataset.x); if (Nuvem.logado) Nuvem.apagarSave(+b.dataset.x); m.fechar(); telaSalvar(salvando);
    }));
  }
  function carregar(s) { if (!s || !CAMPANHAS[s.camp]) return aviso('Jogo salvo inválido.'); E = s; irPara(); }
  function exportar() {
    const dados = {}; [0, ...SLOTS].forEach(n => { const s = lerSave(n); if (s) dados[n] = s; });
    const blob = new Blob([JSON.stringify({ jogo: 'The Kingdom Villa', versao: LEGAL.versao, dados }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kingdom-villa-saves.json'; a.click();
  }
  function importar() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = () => { const f = inp.files[0]; if (!f) return; f.text().then(t => {
      try { const j = JSON.parse(t); if (j.jogo !== 'The Kingdom Villa') throw 0; Object.entries(j.dados).forEach(([n, s]) => gravarSave(+n, s)); aviso('Jogos salvos importados.'); }
      catch (e) { aviso('Arquivo inválido.'); } }); };
    inp.click();
  }

  /* ---------------- início ---------------- */
  window.addEventListener('beforeunload', autosave);
  abertura();
})();
