/* Monta a página a partir do config.js — normalmente você não precisa mexer aqui. */
(() => {
  "use strict";

  // ── idioma ─────────────────────────────────────────────────────
  // Os textos em inglês ficam em config.en.js e são combinados com o config.js:
  // objetos se mesclam, listas de objetos se casam pela posição, o resto é substituído.
  const merge = (base, over, key) => {
    if (over === undefined) return base;
    if (key === "skills") return over;
    if (Array.isArray(base) && Array.isArray(over) && base.every((x) => x && typeof x === "object" && !Array.isArray(x)))
      return base.map((x, i) => merge(x, over[i]));
    if (base && over && typeof base === "object" && typeof over === "object" && !Array.isArray(base) && !Array.isArray(over)) {
      const out = { ...base };
      for (const k of Object.keys(over)) out[k] = merge(base[k], over[k], k);
      return out;
    }
    return over;
  };
  const CONTENT = { pt: window.PORTFOLIO, en: window.PORTFOLIO_EN ? merge(window.PORTFOLIO, window.PORTFOLIO_EN) : null };

  // Textos da interface (botões, dicas, rótulos do contador)
  const UI = {
    pt: {
      locale: "pt-BR",
      title: "Caio Gomes — Engenheiro de Software",
      description: "Caio Gomes — engenheiro de software em Belo Horizonte. Processos, integrações e automações na LEVTY; Ciência da Computação na PUC Minas.",
      demo: "demo ↗", code: "código ↗", site: "ver o site ↗", repo: "ver o código ↗",
      details: "Ver detalhes de", courses: "certificados & cursos", screens: "telas", kicker: "projeto",
      close: "Fechar detalhes", enlarge: "Ampliar", back: "clique ou Esc para voltar",
      toDark: "Mudar para o tema escuro", toLight: "Mudar para o tema claro",
      langSwitch: "Read in English", nav: "Seções", scroll: "↓ role",
      stats: "Estatísticas do lago", fish: "carpas", fed: "comidas", fedHint: "grãos de ração que as carpas já comeram",
      minus: "Tirar uma carpa do lago", minusHint: "tirar uma carpa",
      plus: "Soltar mais uma carpa no lago", plusHint: "soltar mais uma carpa",
    },
    en: {
      locale: "en-US",
      title: "Caio Gomes — Software Engineer",
      description: "Caio Gomes — software engineer in Belo Horizonte, Brazil. Processes, integrations and automations at LEVTY; Computer Science at PUC Minas.",
      demo: "demo ↗", code: "code ↗", site: "visit the site ↗", repo: "view the code ↗",
      details: "See details of", courses: "certificates & courses", screens: "screens", kicker: "project",
      close: "Close details", enlarge: "Enlarge", back: "click or press Esc to go back",
      toDark: "Switch to dark theme", toLight: "Switch to light theme",
      langSwitch: "Ler em português", nav: "Sections", scroll: "↓ scroll",
      stats: "Pond stats", fish: "koi", fed: "eaten", fedHint: "food pellets the koi have eaten",
      minus: "Remove a koi from the pond", minusHint: "remove a koi",
      plus: "Release one more koi into the pond", plusHint: "add a koi",
    },
  };

  // Ordem de escolha: o que a pessoa escolheu antes > ?lang=en > idioma do navegador
  let lang = (() => {
    let saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    const param = new URLSearchParams(location.search).get("lang");
    const pick = saved || param || (/^pt\b/i.test(navigator.language || "pt") ? "pt" : "en");
    return pick === "en" && CONTENT.en ? "en" : "pt";
  })();
  let C = CONTENT[lang];
  let T = UI[lang];

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s) => document.querySelector(s);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const external = (u) => (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "");
  const link = (url, text) => `<a href="${esc(url)}"${external(url)}>${esc(text)}</a>`;
  // Mini-markdown: [texto](url) e **negrito**
  const md = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\s][^*]*)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${external(u)}>${t}</a>`);
  const tags = (list) => (list && list.length ? `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");

  // ── renderizadores de cada seção ────────────────────────────────
  const RENDER = {
    about: () => {
      const text = C.about.map((p, i) => `<p class="reveal" style="--d:${i * 0.12}s">${md(p)}</p>`).join("");
      if (!C.photo) return `<div class="about">${text}</div>`;
      return `<div class="about has-photo">
        <figure class="portrait reveal">
          <img src="${esc(C.photo.src)}" alt="${esc(C.photo.alt || C.name)}" width="737" height="900" loading="lazy" decoding="async" />
          ${C.photo.caption ? `<figcaption>${esc(C.photo.caption)}</figcaption>` : ""}
        </figure>
        <div>${text}</div>
      </div>`;
    },

    experience: () =>
      `<ul class="timeline">${C.experience
        .map(
          (x, i) => `<li class="reveal" style="--d:${i * 0.12}s">
            <span class="period">${esc(x.period)}</span>
            <div>
              <h3>${esc(x.role)} <span class="company">@ ${x.url ? link(x.url, x.company) : esc(x.company)}</span></h3>
              ${x.description ? `<p>${md(x.description)}</p>` : ""}
              ${x.highlights && x.highlights.length ? `<ul class="highlights">${x.highlights.map((h) => `<li>${md(h)}</li>`).join("")}</ul>` : ""}
              ${tags(x.tags)}
            </div>
          </li>`
        )
        .join("")}</ul>`,

    projects: () =>
      `<div class="projects">${C.projects
        .map((p, i) => {
          const links = [p.links?.demo && link(p.links.demo, T.demo), p.links?.code && link(p.links.code, T.code)].filter(Boolean);
          const expand = p.details
            ? `<button class="expand" type="button" data-project="${i}" aria-label="${T.details} ${esc(p.name)}" aria-haspopup="dialog">${ICON_EXPAND}</button>`
            : "";
          return `<article class="project reveal${p.details ? " has-details" : ""}" style="--d:${i * 0.1}s" data-project="${i}" data-koi-ignore>
            <h3>${esc(p.name)}</h3>
            <p>${md(p.description)}</p>
            ${tags(p.tags)}
            <div class="project-foot">
              ${links.length ? `<div class="links">${links.join("")}</div>` : "<span></span>"}
              ${expand}
            </div>
          </article>`;
        })
        .join("")}</div>`,

    education: () => {
      const E = C.education;
      const items = E.items
        .map(
          (x, i) => `<li class="reveal" style="--d:${i * 0.12}s">
            <span class="period">${esc(x.period)}</span>
            <div>
              <h3>${esc(x.title)} <span class="company">@ ${x.url ? link(x.url, x.school) : esc(x.school)}</span></h3>
              ${x.note ? `<p>${md(x.note)}</p>` : ""}
            </div>
          </li>`
        )
        .join("");
      const courses = E.courses && E.courses.length
        ? `<h3 class="subhead reveal">${T.courses}</h3><ul class="courses">${E.courses.map((c, i) => `<li class="reveal" style="--d:${i * 0.08}s">${md(c)}</li>`).join("")}</ul>`
        : "";
      return `<ul class="timeline">${items}</ul>${courses}`;
    },

    skills: () =>
      `<dl class="skills">${Object.entries(C.skills)
        .map(([k, v], i) => `<div class="reveal" style="--d:${i * 0.1}s"><dt>${esc(k)}</dt><dd>${v.map(esc).join(" · ")}</dd></div>`)
        .join("")}</dl>`,

    contact: () => `<div class="contact">
        <p class="reveal">${md(C.contact.text)}</p>
        <p class="reveal" style="--d:.12s">${link("mailto:" + C.contact.email, C.contact.email)}</p>
        <p class="reveal" style="--d:.24s">${socials()}</p>
      </div>`,
  };

  // Ícone "expandir" (setas duplas, lucide maximize-2, licença ISC)
  const ICON_EXPAND = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline class="arrow-a" points="15 3 21 3 21 9"/><line class="arrow-a" x1="21" y1="3" x2="14" y2="10"/><polyline class="arrow-b" points="9 21 3 21 3 15"/><line class="arrow-b" x1="3" y1="21" x2="10" y2="14"/></svg>';
  const ICON_CLOSE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  const resumeLink = () =>
    C.resume ? `<a href="${esc(C.resume.file)}" download>${esc(C.resume.label)}</a>` : "";
  const socials = () =>
    [...C.socials.map((s) => link(s.url, s.label)), resumeLink()].filter(Boolean).join(' <span aria-hidden="true">/</span> ');

  // ── montagem ────────────────────────────────────────────────────
  const ids = { about: "sobre", experience: "experiencia", projects: "projetos", education: "formacao", skills: "stack", contact: "contato" };

  // Cada letra vira um <span> para a "ondinha" do hover passar letra por letra
  const navItem = (id, label) =>
    `<a href="#${id}" data-target="${id}" aria-label="${esc(label)}"><span class="wave" aria-hidden="true">${[...label]
      .map((ch, i) => `<span style="--i:${i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`)
      .join("")}</span></a>`;

  // Textos fixos do index.html: data-i18n (texto), data-i18n-aria e data-i18n-title
  function translateStatic() {
    const root = document.documentElement;
    root.lang = T.locale;
    document.title = T.title;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = T.description;
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = T[el.dataset.i18n]));
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", T[el.dataset.i18nAria]));
    document.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = T[el.dataset.i18nTitle]));
  }

  function render() {
    const sections = C.sections.filter((s) => RENDER[s]);
    $("#nav").innerHTML = navItem("top", C.labels.top) + sections.map((s) => navItem(ids[s], C.labels[s] || s)).join("");

    $("#sections").innerHTML = sections
      .map(
        (s, i) => `<section class="section" id="${ids[s]}">
          <div class="section-inner" data-koi-avoid>
            <h2 class="section-title reveal"><span class="idx">${String(i + 1).padStart(2, "0")}</span><span class="scramble">${esc(C.labels[s] || s)}</span></h2>
            ${RENDER[s]()}
          </div>
        </section>`
      )
      .join("");

    $("#hero-body").innerHTML =
      `<p class="reveal">${md(C.greeting)}</p>` +
      C.intro.map((l, i) => `<p class="reveal" style="--d:${0.15 + i * 0.15}s">${md(l)}</p>`).join("") +
      `<p class="socials reveal" style="--d:${0.15 + C.intro.length * 0.15}s">${socials()}</p>`;

    $("#footer").innerHTML = `<p>© ${new Date().getFullYear()} ${esc(C.name)} · ${esc(C.footer || "")}</p>`;
    translateStatic();
  }
  render();

  // ── painel de detalhes dos projetos ────────────────────────────
  /* Abre por cima da página (não é outra página). A abertura usa FLIP: o painel
     nasce no tamanho e na posição da caixa clicada e cresce até o centro; ao
     fechar, encolhe de volta para a caixa. O conteúdo entra em cascata. */
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  let openState = null;

  function detailsHTML(p) {
    const d = p.details;
    const links = [p.links?.demo && link(p.links.demo, T.site), p.links?.code && link(p.links.code, T.repo)].filter(Boolean);
    const facts = d.facts && d.facts.length
      ? `<dl class="facts">${d.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${md(v)}</dd></div>`).join("")}</dl>`
      : "";
    const blocks = (d.blocks || []).map((b) => `<figure class="block"><figcaption>${esc(b.title)}</figcaption><pre>${esc(b.text)}</pre></figure>`).join("");
    const chart = d.chart
      ? (() => {
          const max = Math.max(...d.chart.rows.map((r) => r.value));
          return `<figure class="chart"><figcaption>${esc(d.chart.title)}</figcaption>${d.chart.rows
            .map(
              (r, i) => `<div class="bar-row${r.highlight ? " hl" : ""}">
                <span class="bar-label">${esc(r.label)}</span>
                <span class="bar-track"><span class="bar" style="--w:${((r.value / max) * 100).toFixed(1)}%; --i:${i}"></span></span>
                <span class="bar-value">${r.value.toLocaleString(T.locale, { maximumFractionDigits: 2 })}${esc(d.chart.unit || "")}</span>
                ${r.note ? `<span class="bar-note">${esc(r.note)}</span>` : ""}
              </div>`
            )
            .join("")}</figure>`;
        })()
      : "";
    const sections = (d.sections || [])
      .map((sec) => `<section class="d-section"><h3>${esc(sec.title)}</h3><ul>${sec.items.map((it) => `<li>${md(it)}</li>`).join("")}</ul></section>`)
      .join("");
    const gallery = d.gallery && d.gallery.length
      ? `<section class="d-section"><h3>${T.screens}</h3><div class="gallery${d.galleryLayout === "desktop" ? " is-desktop" : ""}">${d.gallery
          .map(
            (g) => `<figure class="${g.wide ? "wide" : ""}">
              <button type="button" class="shot" data-src="${esc(g.src)}" aria-label="${T.enlarge}: ${esc(g.caption || p.name)}">
                <img src="${esc(g.src)}" alt="${esc(g.caption || p.name)}" loading="lazy" decoding="async" />
              </button>
              ${g.caption ? `<figcaption>${md(g.caption)}</figcaption>` : ""}
            </figure>`
          )
          .join("")}</div>${d.note ? `<p class="d-note">${md(d.note)}</p>` : ""}</section>`
      : "";

    return `<header class="d-head">
        <p class="d-kicker">${T.kicker}</p>
        <h2 id="d-title">${esc(p.name)}</h2>
        ${tags(p.tags)}
        ${links.length ? `<div class="d-links">${links.join("")}</div>` : ""}
      </header>
      <div class="d-summary">${(d.summary || []).map((t) => `<p>${md(t)}</p>`).join("")}</div>
      ${facts}${chart}${blocks}${sections}${gallery}`;
  }

  // Anima de um retângulo (a caixa) para o painel, usando transform (FLIP)
  function flipFrom(el, from, opts) {
    const to = el.getBoundingClientRect();
    const sx = from.width / to.width, sy = from.height / to.height;
    const dx = from.left - to.left, dy = from.top - to.top;
    return el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: "2px", opacity: 0.6 },
        { transform: "none", borderRadius: "2px", opacity: 1 },
      ],
      opts
    );
  }

  function openDetails(index, card) {
    if (openState) return;
    const p = C.projects[index];
    const overlay = document.createElement("div");
    overlay.className = "d-overlay";
    overlay.setAttribute("data-koi-ignore", "");
    overlay.innerHTML = `<div class="d-backdrop"></div>
      <div class="d-panel" role="dialog" aria-modal="true" aria-labelledby="d-title">
        <button type="button" class="d-close" aria-label="${T.close}">${ICON_CLOSE}</button>
        <div class="d-scroll"><div class="d-content">${detailsHTML(p)}</div></div>
      </div>`;
    document.body.appendChild(overlay);

    const panel = overlay.querySelector(".d-panel");
    const backdrop = overlay.querySelector(".d-backdrop");
    const content = overlay.querySelector(".d-content");
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add("d-lock");
    document.documentElement.style.setProperty("--scrollbar", scrollbar + "px");

    // Itens que entram em cascata depois que o painel abre
    const items = [...content.children];
    items.forEach((el, i) => el.style.setProperty("--k", i));

    openState = { overlay, panel, backdrop, content, card, trigger: document.activeElement, closing: false };

    if (calm()) {
      overlay.classList.add("is-open");
    } else {
      card.classList.add("is-source");
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: "ease-out", fill: "both" });
      content.style.opacity = "0";
      flipFrom(panel, card.getBoundingClientRect(), { duration: 560, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" }).finished.then(() => {
        content.style.opacity = "";
        overlay.classList.add("is-open"); // dispara a cascata do conteúdo (CSS)
      });
    }
    overlay.querySelector(".d-close").focus({ preventScroll: true });

    overlay.addEventListener("click", (e) => {
      if (e.target === backdrop || e.target.closest(".d-close")) return closeDetails();
      const shot = e.target.closest(".shot");
      if (shot) openShot(shot);
    });
  }

  function closeDetails() {
    const st = openState;
    if (!st || st.closing) return;
    st.closing = true;
    const viewer = st.overlay.querySelector(".d-viewer");
    if (viewer) viewer.remove();

    const done = () => {
      st.overlay.remove();
      st.card.classList.remove("is-source");
      document.documentElement.classList.remove("d-lock");
      openState = null;
      const back = st.card.querySelector(".expand") || st.trigger;
      if (back && back.focus) back.focus({ preventScroll: true });
    };
    if (calm()) return done();

    // Some o conteúdo, depois o painel encolhe de volta para a caixa
    st.overlay.classList.remove("is-open");
    st.content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" });
    const from = st.panel.getBoundingClientRect();
    const to = st.card.getBoundingClientRect();
    const sx = to.width / from.width, sy = to.height / from.height;
    const dx = to.left - from.left, dy = to.top - from.top;
    st.backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, delay: 80, easing: "ease-in", fill: "forwards" });
    st.panel
      .animate(
        [
          { transform: "none", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.4 },
        ],
        { duration: 440, delay: 80, easing: "cubic-bezier(0.55, 0, 0.75, 0.3)", fill: "forwards" }
      )
      .finished.then(done);
  }

  // Ampliar um print: a imagem cresce da miniatura até ocupar a tela
  function openShot(btn) {
    const st = openState;
    const img = btn.querySelector("img");
    const viewer = document.createElement("div");
    viewer.className = "d-viewer";
    viewer.innerHTML = `<img src="${btn.dataset.src}" alt="${esc(img.alt)}" /><span class="d-viewer-hint">${T.back}</span>`;
    st.overlay.appendChild(viewer);
    const big = viewer.querySelector("img");
    const run = () => {
      viewer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: "both" });
      if (!calm()) flipFrom(big, img.getBoundingClientRect(), { duration: 420, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" });
    };
    big.complete ? run() : big.addEventListener("load", run, { once: true });
    const close = () => {
      if (calm()) return viewer.remove();
      viewer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished.then(() => viewer.remove());
    };
    viewer.addEventListener("click", close);
    viewer.closeShot = close;
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project.has-details");
    if (!card || openState) return;
    // Links da caixa continuam funcionando normalmente
    if (e.target.closest("a")) return;
    openDetails(+card.dataset.project, card);
  });

  document.addEventListener("keydown", (e) => {
    if (!openState) return;
    if (e.key === "Escape") {
      const viewer = openState.overlay.querySelector(".d-viewer");
      return viewer ? viewer.closeShot() : closeDetails();
    }
    // Mantém o foco dentro do painel
    if (e.key === "Tab") {
      const f = [...openState.panel.querySelectorAll("a, button")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ── efeito "decodificando" nos títulos ──────────────────────────
  const GLYPHS = "SX%8@#:.";
  function scramble(el) {
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    if (reduceMotion) return;
    const start = performance.now(), dur = 950;
    (function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const fixed = Math.floor(p * final.length);
      el.textContent = final
        .split("")
        .map((c, i) => (i < fixed || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join("");
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // ── revelar ao rolar ───────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("visible");
        const s = e.target.querySelector(".scramble");
        if (s) scramble(s);
        revealObserver.unobserve(e.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  // Menu: marca a seção visível
  const navObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.target === e.target.id));
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  function observe() {
    // O hero só aparece depois da frase digitada
    document.querySelectorAll(".section .reveal").forEach((el) => revealObserver.observe(el));
    document.querySelectorAll("#top, .section").forEach((s) => navObserver.observe(s));
  }
  observe();

  // ── máquina de escrever ────────────────────────────────────────
  const tagline = $("#tagline");
  const showHero = () => document.querySelectorAll("#hero-body .reveal").forEach((el) => el.classList.add("visible"));
  let typing = 0; // ao trocar de idioma, a digitação anterior é abandonada
  function typeTagline() {
    const run = ++typing;
    const text = C.tagline.join("\n");
    if (reduceMotion) {
      tagline.innerHTML = `${esc(text)}<span class="cursor"></span>`;
      return showHero();
    }
    let i = 0;
    (function type() {
      if (run !== typing) return;
      tagline.innerHTML = `${esc(text.slice(0, i))}<span class="cursor"></span>`;
      if (i++ < text.length) setTimeout(type, text[i - 1] === "\n" ? 450 : 70 + Math.random() * 60);
      else setTimeout(() => run === typing && showHero(), 250);
    })();
  }
  typeTagline();

  // ── tema ───────────────────────────────────────────────────────
  // Versão em JS puro do "Animated Theme Toggler" (shadcn/Magic UI): o novo tema
  // se espalha em círculo a partir do botão (View Transitions API) e o ícone
  // gira ao trocar. Ícones Sun/Moon do lucide (licença ISC), embutidos como SVG.
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  };
  const toggle = $("#theme-toggle");
  const isLight = () => document.documentElement.dataset.theme === "light";
  const calmMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function renderIcon(animate) {
    // No escuro mostra o sol (clique = clarear); no claro, a lua
    const light = isLight();
    toggle.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${light ? ICONS.moon : ICONS.sun}</svg>`;
    toggle.setAttribute("aria-label", light ? T.toDark : T.toLight);
    if (animate && !calmMotion.matches) {
      toggle.firstChild.animate(
        [{ opacity: 0, transform: `scale(0.55) rotate(${light ? -25 : 25}deg)` }, { opacity: 1, transform: "none" }],
        { duration: 330, easing: "ease-out" }
      );
    }
  }

  function applyTheme(next) {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    renderIcon(true);
    window.dispatchEvent(new Event("themechange"));
  }

  renderIcon(false);
  toggle.addEventListener("click", async () => {
    const next = isLight() ? "dark" : "light";
    // Sem suporte (navegadores antigos) ou com "reduzir movimento": troca direto
    if (!document.startViewTransition || calmMotion.matches) return applyTheme(next);

    const root = document.documentElement;
    root.classList.add("theme-switching"); // desliga as transições de cor durante a troca
    const transition = document.startViewTransition(() => applyTheme(next));
    try {
      await transition.ready;
      const { left, top, width, height } = toggle.getBoundingClientRect();
      const x = left + width / 2, y = top + height / 2;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      );
      await transition.finished;
    } finally {
      root.classList.remove("theme-switching");
    }
  });

  // ── troca de idioma ────────────────────────────────────────────
  // Redesenha a página no outro idioma sem recarregar (as carpas continuam nadando)
  // e mantém a pessoa no mesmo ponto da página.
  const langBtn = $("#lang-toggle");
  function renderLangButton() {
    langBtn.innerHTML = ["pt", "en"]
      .map((l) => `<span class="${l === lang ? "on" : ""}">${l}</span>`)
      .join('<span class="sep" aria-hidden="true">/</span>');
    langBtn.setAttribute("aria-label", T.langSwitch);
    langBtn.title = T.langSwitch;
  }

  function setLang(next) {
    lang = next;
    C = CONTENT[lang];
    T = UI[lang];
    try { localStorage.setItem("lang", lang); } catch (e) {}

    // Âncora: a primeira seção ainda visível no topo da tela
    const blocks = [...document.querySelectorAll("#top, .section")];
    const anchor = blocks.find((b) => b.getBoundingClientRect().bottom > 80) || blocks[0];
    const anchorId = anchor.id, anchorTop = anchor.getBoundingClientRect().top;
    const revealed = new Set(
      [...document.querySelectorAll(".section")].filter((sec) => sec.querySelector(".reveal.visible")).map((sec) => sec.id)
    );

    render();
    renderIcon(false);
    renderLangButton();

    // Seções que já tinham aparecido continuam visíveis; as da tela entram de novo com a animação
    document.querySelectorAll(".section").forEach((sec) => {
      if (!revealed.has(sec.id)) return;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) sec.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    });
    observe();
    typeTagline();

    const el = document.getElementById(anchorId);
    if (el) window.scrollBy({ top: el.getBoundingClientRect().top - anchorTop, behavior: "instant" });
  }

  if (CONTENT.en) {
    renderLangButton();
    langBtn.addEventListener("click", () => {
      const next = lang === "pt" ? "en" : "pt";
      if (calm()) return setLang(next);
      const main = $("#content"), foot = $("#footer");
      main.classList.add("lang-out");
      foot.classList.add("lang-out");
      setTimeout(() => {
        setLang(next);
        main.classList.remove("lang-out");
        foot.classList.remove("lang-out");
      }, 220);
    });
  } else {
    langBtn.remove();
  }
})();
