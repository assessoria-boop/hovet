// Monta a LP premium de um cliente a partir de C:/Users/Gaabs/esavet/index.html (pranchetas V2)
// uso: node build.js housepet | drvida
const fs = require('fs');
const C = require('./clientes.js')[process.argv[2]];
if (!C) throw new Error('cliente?');
let s = fs.readFileSync('C:/Users/Gaabs/esavet/index.html', 'utf8').replace(/\r\n/g, '\n');

function troca(de, para, vezes = 1) {
  const n = s.split(de).length - 1;
  if (vezes === 0 ? n < 1 : n !== vezes) throw new Error(`"${de.slice(0, 70)}" aparece ${n}x (esperado ${vezes})`);
  s = s.split(de).join(para);
}
const enc = (t) => encodeURIComponent(t);
const WPP = `https://wa.me/${C.wpp}?text=Ol%C3%A1%20encontrei%20voc%C3%AAs%20pelo%20Google%2C%20gostaria%20de%20atendimento`;

/* ── HEAD ── */
s = s.replace(/  <title>[\s\S]*?<meta property="og:image" content="img\/logo-esavet.webp" \/>/,
  `  <title>${C.title}</title>
  <meta name="description" content="${C.desc}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:title" content="${C.ogTitle}" />
  <meta property="og:description" content="${C.ogDesc}" />
  <meta property="og:image" content="img/logo-${C.slug}.webp" />`);
troca('<meta name="theme-color" content="#111514" />', `<meta name="theme-color" content="${C.cor.footer}" />`);
troca('href="img/logo-esavet.webp?v=1"', `href="img/logo-${C.slug}.webp?v=1"`, 2);
troca("/* Google Tag Manager: container da EsaVet */\n      var GTM_ID = 'GTM-W829KPK3';", `/* Google Tag Manager: ${C.gtmNota || 'o mesmo container da pagina atual'} */\n      var GTM_ID = '${C.gtm}';`);
troca('/* Microsoft Clarity: o cliente ainda nao passou o ID. Quando chegar, coloque aqui */', '/* Microsoft Clarity: a pagina atual nao tem o ID. Quando chegar, coloque aqui */');
if (C.clarity) { troca('/* Microsoft Clarity: a pagina atual nao tem o ID. Quando chegar, coloque aqui */', '/* Microsoft Clarity: ' + C.clarityNota + ' */'); troca("var CLARITY_ID = '';", "var CLARITY_ID = '" + C.clarity + "';"); }
if (C.gtm) troca('ns.html?id=GTM-W829KPK3"', `ns.html?id=${C.gtm}"`);
else s = s.replace(/<!-- Google Tag Manager \(noscript\) -->\n<noscript>.*<\/noscript>\n/, '');

/* ── PALETA ── */
const k = C.cor;
s = s.replace(/    \/\* paleta da EsaVet[\s\S]*?--c-logo-bg: #000000;/,
`    /* ${k.nota} */
    :root {
      --c-white: #FFFFFF;
      --c-soft: ${k.soft};
      --c-pill: ${k.soft};
      --c-ink: ${k.ink};
      --c-body: ${k.body};
      --c-line: ${k.line};
      --c-border: ${k.line};
      --c-muted: ${k.muted};
      --c-readmore: ${k.readmore};
      --c-footer: ${k.footer};
      --c-brand: ${k.brand};
      --c-logo: ${k.brand};
      --c-light: ${k.light};
      --c-lima: ${k.light};
      --c-trilho: ${k.trilho};
      --c-logo-bg: ${k.logoBg};`);
s = s.split('#141917').join(k.ink);
s = s.split('#2F6F67').join(k.brand);
s = s.split('rgba(47,111,103').join(`rgba(${k.brandRgb}`);
s = s.split('#8FC0B9').join(k.light);
s = s.split('#4D8A81').join(k.muted);
s = s.split('#D3E3DF').join(k.line);
s = s.split('#EEF5F3').join(k.soft);
s = s.split('#E5F0ED').join(k.trilho);
s = s.split('#F2F7F6').join(k.fundo);

/* ── CSS EXCLUSIVO ── */
troca('/* ── ESAVET (12/10/2026) ── */', `/* ── ${C.nomeCurto.toUpperCase()} (14/10/2026) ── */`);
troca('    /* a logo da EsaVet e um circulo preto: o icone do menu fica redondo */\n    .logo-ic { border-radius: 50%; }\n', C.cssLogo);
troca('/* "São Leopoldo / confia na EsaVet" e mais longo', `/* "${C.cidade} / confia ${C.na || 'na'} ${C.nomeCurto}" e mais longo`);
troca('  </style>\n</head>', (C.cssExtra || '') + '  </style>\n</head>');

/* ── RASTREIO ANALIZ CRM (opcional) ── */
// t.js guarda o gclid por 90 dias e, so para visita do Google Ads, desvia o WhatsApp pela ponte do CRM (capture no document).
// O handler dos CTAs precisa respeitar isso, senao abre o WhatsApp duas vezes (ponte + wa.me direto).
if (C.crm) {
  troca('  <link rel="dns-prefetch" href="https://www.clarity.ms" />', `  <link rel="dns-prefetch" href="https://www.clarity.ms" />
  <!-- Rastreio Analiz CRM: guarda o clique do Google Ads (gclid) por 90 dias e desvia os botoes de WhatsApp pela ponte -->
  <script src="https://crm.analizmarketing.com/t.js" data-clinica="${C.crm}" defer></script>`);
  troca("      e.preventDefault();\n      if (!lbl.dataset.orig)", "      /* se o t.js do Analiz CRM ja abriu a ponte do WhatsApp (visita do Google Ads), so troca o texto, sem abrir de novo */\n      var jaAberto = e.defaultPrevented;\n      e.preventDefault();\n      if (!lbl.dataset.orig)");
  troca("      setTimeout(function () {\n        var w = window.open(a.href, '_blank');", "      if (!jaAberto) setTimeout(function () {\n        var w = window.open(a.href, '_blank');");
}

/* ── BODY ── */
const ini = s.indexOf('<!-- HERO -->');
const fim = s.indexOf('<script>\n  /* Entrada dos itens');
const d = (i) => (i ? ` style="--d:.${String(i * 8).padStart(2, '0')}s"` : '');

const aval = Array.from({ length: C.avalN || 5 }, (_, i) => i + 1).map((n, i) => C.semAval
  ? `    <div class="av rv"${d(i)}><span class="slot">Print de avaliação ${n}</span></div>`
  : `    <div class="av rv"${d(i)}><img src="img/avaliacao-${n}.webp?v=1" width="${C.avalW}" height="${C.avalH}" alt="Avaliação de cliente no Google sobre ${C.na === 'no' ? 'o' : 'a'} ${C.nomeCurto}" loading="lazy" decoding="async" /></div>`).join('\n');

const servHtml = C.serv.map(([ic, nome, desc, foto, alt], i) => `    <div class="sr rv${i === 0 ? ' aberto padrao' : ''}">
      <span class="sr-midia">${foto
        ? `<img src="img/servico-${foto}.webp?v=1" width="720" height="480" alt="${alt}" loading="lazy" decoding="async" />`
        : `<span class="slot">Foto: ${nome}</span>`}</span>
      <div class="sr-info">
        <span class="sr-ic"><svg class="i"><use href="#${ic}"/></svg></span>
        <span class="sr-nome">${nome}</span>
        <span class="sr-desc">${desc}</span>
      </div>
    </div>`).join('\n');

const etapasHtml = C.etapas.map(([h, p, foto], i) => {
  const n = String(i + 1).padStart(2, '0');
  const midia = foto ? `<img src="img/etapa-${n}.webp?v=1" width="740" height="440" alt="${foto}" loading="lazy" decoding="async" />` : `<span class="slot">Foto da etapa ${n}</span>`;
  return `    <div class="et rv"${d(i)}>
      <div class="et-img">${midia}<span class="et-n">${n}</span></div>
      <div class="et-txt"><h3>${h}</h3><p>${p}</p></div>
    </div>`;
}).join('\n');

const atrasos = ['', ' style="--d:.06s"', ' style="--d:.09s"', ' style="--d:.12s"', ' style="--d:.18s"', ' style="--d:.24s"', ' style="--d:.30s"', ' style="--d:.36s"'];
const faqHtml = C.faq.map(([ic, p, r], i) => `    <div class="faq rv${i === 0 ? ' aberta' : ''}"${atrasos[i]}>
      <button class="faq-p" type="button" aria-expanded="${i === 0}">
        <span class="faq-ic"><svg class="i"><use href="#${ic}"/></svg></span>
        <span class="faq-tit">${p}</span>
        <span class="faq-mais" aria-hidden="true"></span>
      </button>
      <div class="faq-r"${i === 0 ? ' style="height:auto"' : ''}><p>${r}</p></div>
    </div>`).join('\n');

const hc = C.heroCards.map(([a, b, ic], i) => `  <div class="hc rv" style="--d:.${45 + i * 10}s">
    <div class="hc-txt"><span class="hc-n">#${i + 1}</span><span class="hc-d"><span>${a}</span> <span>${b}</span></span></div>
    <span class="hc-ic"><svg class="i"><use href="#${ic}"/></svg></span>
  </div>`).join('\n');

let body = fs.readFileSync(__dirname + '/body.html', 'utf8').replace(/\r\n/g, '\n');
const vars = {
  WPP, MAPA: C.mapa, FAQ: faqHtml, AVAL: aval, SERV: servHtml, ETAPAS: etapasHtml, HC: hc,
  NA: C.na || 'na', SLUG: C.slug, NOME: C.nome, NOMECURTO: C.nomeCurto, TIPO: C.tipo, CIDADE: C.cidade, UF: C.uf,
  H1A: C.h1[0], H1C: C.h1[2], TIPO24: C.tipo24 || C.tipo + ' 24h',
  H1L2: C.h1L2 || `${C.h1[1]} <span class="h24" data-brilho="24h">24h</span>`, SUB: C.sub, APOIO: C.apoio,
  AVALP: C.avalP, PILLS: C.pills.map((p, i) => `      <span class="serv-pill p${i + 1}">${p}</span>`).join('\n'),
  ETTAG: C.etTag, ETH2A: C.etH2[0], ETH2B: C.etH2[1], ETP: C.etP,
  PC1: C.pc[0], PC2: C.pc[1], PC3: C.pc[2], PC4: C.pc[3], PC5: C.pc[4], PC6: C.pc[5],
  CTAP: C.ctaP, TEL: C.tel, ENDERECO: C.endereco, ROTA: enc(C.rota), MAPATIT: C.mapaTit,
};
body = body.replace(/\{\{([A-Z0-9]+)\}\}/g, (m, v) => { if (vars[v] === undefined) throw new Error('var ' + v); return vars[v]; });
s = s.slice(0, ini) + body + s.slice(fim);

// icones extras: tela (exames de imagem) e lupa (endoscopia)
troca('  <symbol id="i-wpp"', `  <symbol id="i-tela" viewBox="0 0 24 24"><path d="M3 5h18v12H3zM8 21h8M12 17v4"/></symbol>
  <symbol id="i-lupa" viewBox="0 0 24 24"><path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4"/></symbol>
  <symbol id="i-wpp"`);

/* ── DADOS ESTRUTURADOS ── */
const j0 = s.indexOf('<!-- Dados do negocio para o Google');
const j1 = s.indexOf('</body>');
const ld = {
  '@context': 'https://schema.org', '@type': 'VeterinaryCare',
  name: C.nome, description: C.ldDesc,
  image: `img/logo-${C.slug}.webp`, telephone: '+' + C.wpp,
  address: Object.assign({ '@type': 'PostalAddress' }, C.ldEndereco, { addressCountry: 'BR' }),
  areaServed: C.areaServed,
  ...(C.sameAs ? { sameAs: C.sameAs } : {}),
  openingHoursSpecification: C.horarioLd || [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }],
};
if (C.horarioLd === false) delete ld.openingHoursSpecification;
const ldFaq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faq.map(([, p, r]) => ({ '@type': 'Question', name: p, acceptedAnswer: { '@type': 'Answer', text: r } })) };
s = s.slice(0, j0) + '<!-- Dados do negocio para o Google (cartao local) -->\n<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) +
  '\n</script>\n<!-- Perguntas frequentes para o Google (dados estruturados) -->\n<script type="application/ld+json">\n' + JSON.stringify(ldFaq) + '\n</script>\n' + s.slice(j1);

const sobras = s.match(/esavet|esa\.vet|Leopoldo|Euclides|99779|5551|W829|2F6F67|8FC0B9|111514|Jardim Am/gi);
if (sobras) throw new Error('sobras: ' + [...new Set(sobras)].join(', '));
fs.writeFileSync(C.out, s);
console.log('ok', C.out, s.length, 'bytes');
