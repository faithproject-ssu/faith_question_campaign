/* =========================================================
   믿음이 자격이 되는 순간 — script.js
   ---------------------------------------------------------
   ▶ 슬로건/기사를 추가하려면 아래 SLOGANS, ARTICLES 배열에
     항목을 하나 더 넣기만 하면 됩니다. (화면·목록·이전/다음 자동 반영)
     - body의 각 줄: { t: '문장' }  /  강조(버건디): { t: '문장', em: true }
     - 기사 이미지는 index.html과 같은 위치에 파일을 넣고 image 경로를 맞춰 주세요.
     - 기사 출처는 source 항목(paper, headline, reporter, date, url)에 적습니다.
   ▶ 좋아요 서버 연결 정보는 config.js에 있습니다.
   ========================================================= */

const SLOGANS = [
  {
    title: '믿음이 없으면 자격도 없는가?',
    body: [
      { t: '기독교인이면 합격, 비기독교인이면 탈락?' },
      { t: '실력보다 신앙이 우선인 학교.' },
      { t: '교육자의 자격을 판단하는 기준은 전문성이 아니라 종교인가?' },
      { t: '하나님을 믿지 않는다는 이유로 기회조차 주어지지 않는다면, 그것이 과연 공정인가?', em: true }
    ]
  },
  {
    title: '사랑하라면서, 왜 배제하는가?',
    body: [
      { t: '네 이웃을 사랑하라. 단, 기독교인에 한해서?' },
      { t: '입으로는 사랑을 외치고, 제도로는 차별을 만든다.', em: true },
      { t: '포용을 가르치는 학교가 배제를 실천한다.' },
      { t: '기독교 정신이라는 이름으로 정당화되는 차별. 이것이 학교가 말하는 사랑인가?', em: true }
    ]
  },
  {
    title: '신앙인가, 특권인가?',
    body: [
      { t: '믿음이 능력이 되고, 종교가 스펙이 되는 사회.' },
      { t: '신앙은 개인의 자유다.' },
      { t: '그러나 그 신앙이 누군가에게 특권이 되고, 다른 누군가에게 장벽이 되는 순간 우리는 질문해야 한다.' },
      { t: '하나님은 평등하다는데, 채용은 왜 평등하지 않은가?', em: true }
    ]
  },
  {
    title: '예수천국 불신지옥, 그리고 취업지옥.',
    body: [
      { t: '예수를 믿어야 천국에 간다. 예수를 믿어야 교직원이 된다.' },
      { t: '학교는 교육기관인가, 신앙을 검증하는 기관인가?', em: true },
      { t: '우리가 비판하는 것은 기독교가 아니다.' },
      { t: '사랑을 말하면서 차별을 제도화하는 모순이다.', em: true }
    ]
  }
];

const ARTICLES = [
  {
    label: '기사 자료 01',
    cardTitle: '교협의 신앙기록확인서 제출 기준 완화 요구',
    title: '교협, 신앙기록확인서 제출 기준 완화 요구',
    image: 'article1.jpg',
    alt: '신문 기사 원본 이미지: 교협에서 신앙기록확인서 제출 기준 완화 요구',
    source: {
      paper: '숭대시보',
      headline: '교협에서 신앙기록확인서 제출 기준 완화 요구',
      reporter: '남연서 기자',
      date: '2026.08.31',
      url: 'https://www.ssunews.net/news/articleView.html?idxno=12117'
    }
  },
  {
    label: '기사 자료 02',
    cardTitle: '교수의 전문성과 채용 기준에 관한 문제 제기',
    title: '교수의 전문성과 채용 기준에 관한 문제 제기',
    image: 'article2.jpg',
    alt: '신문 기사 발췌 원본 이미지: 강의 중 가장 중요한 요소로 69.4%가 교수의 전문성을 답변했다는 내용',
    source: {
      paper: '숭대시보',
      headline: '2026 총학 만족도 조사 진행돼',
      reporter: '남연서 기자',
      date: '2026.03.30',
      url: 'https://www.ssunews.net/news/articleView.html?idxno=11938',
      note: '기사 일부 발췌'
    }
  }
];

const APP = {
  title: '믿음이 자격이 되는 순간',
  subtitle: '“교육자의 자격은 신앙으로 결정되어야 할까요?”',
  note: '종교 자체에 대한 비난이 아니라, 종교적 자격 요건과 채용의 공정성 사이의 문제를 질문합니다.',
  // 홈 화면에 "지금까지 N명이 함께 봤어요"를 보여 줄지 (true = 보이기, false = 숨기기)
  // 숫자는 공개 여부와 상관없이 Firebase 콘솔 → Firestore → stats 에서 항상 볼 수 있습니다.
  showVisitorCount: false
};

/* ========================================================= */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const stage = $('#stage');
  const tabbar = $('#tabbar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 아이콘 ---------- */
  const ICON = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.5 7.5 12 15 19.5"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 9 15" aria-hidden="true"><path d="m1.5 1.5 6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 7 12" aria-hidden="true"><path d="M6 1 1 6l5 5"/></svg>',
    right: '<svg viewBox="0 0 7 12" aria-hidden="true"><path d="m1 1 5 5-5 5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v12M7.5 8 12 3.5 16.5 8"/><path d="M8 11.5H6.5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H16"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M10.5 8v5M8 10.5h5"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h11M8 12h11M8 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01"/></svg>',
    heart: '<svg class="heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3s-7.8-4.6-7.8-10.4A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 7.8 3.1c0 5.8-7.8 10.4-7.8 10.4Z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.5h5.5V10M19.5 4.5 11 13"/><path d="M17.5 13.5v4a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h4"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
    shareIOS: '<svg class="inline-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M8.5 10.5H7a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 17 10.5h-1.5"/></svg>'
  };

  /* ---------- 좋아요 (Firebase Firestore) ---------- */
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* noop */ } };

  const likes = (() => {
    const cfg = window.FIREBASE_CONFIG || {};
    const enabled = !!(cfg.apiKey && cfg.projectId);
    const docs = `projects/${cfg.projectId}/databases/(default)/documents`;
    const api = `https://firestore.googleapis.com/v1/${docs}`;
    const key = `key=${encodeURIComponent(cfg.apiKey || '')}`;
    const counts = {};
    const busy = {};
    let loaded = false, lastLoad = 0;
    const isLiked = id => lsGet('liked:' + id) === '1';

    async function load() {
      if (!enabled) return;
      lastLoad = Date.now();
      try {
        const r = await fetch(`${api}/likes?pageSize=100&${key}`);
        if (!r.ok) throw new Error(r.status);
        const j = await r.json();
        (j.documents || []).forEach(d => {
          const f = d.fields && d.fields.count;
          counts[d.name.split('/').pop()] = Number(f && (f.integerValue || f.doubleValue) || 0);
        });
        loaded = true;
        paint();
      } catch (e) { /* 네트워크 문제: 숫자 없이 버튼만 표시 */ }
    }

    async function toggle(id, btn) {
      if (!enabled || busy[id]) return;
      busy[id] = true;
      const was = isLiked(id), delta = was ? -1 : 1;
      lsSet('liked:' + id, was ? null : '1');
      counts[id] = Math.max(0, (counts[id] || 0) + delta);
      paint();
      if (!was && btn && !reduceMotion.matches) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
      try {
        const r = await fetch(`${api}:commit?${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ writes: [{
            update: { name: `${docs}/likes/${id}`, fields: {} },
            updateMask: { fieldPaths: [] },
            updateTransforms: [{ fieldPath: 'count', increment: { integerValue: String(delta) } }]
          }] })
        });
        if (!r.ok) throw new Error(r.status);
        const j = await r.json();
        const t = j.writeResults && j.writeResults[0].transformResults;
        if (t && t[0] && t[0].integerValue != null) counts[id] = Number(t[0].integerValue);
        loaded = true;
        paint();
      } catch (e) {
        lsSet('liked:' + id, was ? '1' : null);
        counts[id] = Math.max(0, (counts[id] || 0) - delta);
        paint();
        toast('연결이 불안정해요. 잠시 후 다시 눌러 주세요');
      } finally { busy[id] = false; }
    }

    function paint(root = document) {
      if (!enabled) return;
      root.querySelectorAll('[data-like]').forEach(b => {
        const on = isLiked(b.dataset.like);
        b.classList.toggle('liked', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      root.querySelectorAll('[data-like-count]').forEach(el => {
        const id = el.dataset.likeCount;
        el.classList.toggle('liked', isLiked(id));
        const n = el.querySelector('.n') || el;
        n.textContent = loaded ? (counts[id] || 0).toLocaleString('ko-KR') : '–';
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && Date.now() - lastLoad > 30000) load();
    });

    return { enabled, load, toggle, paint };
  })();

  /* ---------- 접속자 수 (Firebase Firestore → stats) ----------
     visits      : 접속 횟수 (브라우저를 새로 열 때마다 1, 새로고침은 제외)
     visitors    : 방문자 수 (기기·브라우저당 처음 한 번만)
     qr_visits   : 그중 QR로 들어온 접속 횟수 (주소에 ?from=qr)
     qr_visitors : 그중 QR로 처음 들어온 방문자 수
     운영자 본인은 주소 끝에 ?notrack 을 붙여 한 번 열면 이후 집계에서 빠집니다. */
  const stats = (() => {
    const cfg = window.FIREBASE_CONFIG || {};
    const enabled = !!(cfg.apiKey && cfg.projectId);
    const docs = `projects/${cfg.projectId}/databases/(default)/documents`;
    const api = `https://firestore.googleapis.com/v1/${docs}`;
    const key = `key=${encodeURIComponent(cfg.apiKey || '')}`;
    const ssGet = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
    const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* noop */ } };

    // 주소 정리: ?from=qr, ?notrack 은 읽은 뒤 주소창에서 지움(공유·즐겨찾기에 남지 않게)
    let params;
    try { params = new URLSearchParams(location.search); } catch (e) { params = new URLSearchParams(''); }
    const fromQR = params.get('from') === 'qr';
    const optOut = params.has('notrack');
    if (optOut) lsSet('notrack', '1');
    if (params.has('from') || optOut) {
      params.delete('from'); params.delete('notrack');
      const q = params.toString();
      try { history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* noop */ }
    }

    function record() {
      if (!enabled || lsGet('notrack') === '1') return;
      const ids = [];
      const newSession = ssGet('counted') !== '1';
      if (newSession) { ids.push('visits'); if (fromQR) ids.push('qr_visits'); }
      if (lsGet('visited') !== '1') ids.push('visitors');
      if (fromQR && lsGet('visited_qr') !== '1') ids.push('qr_visitors');
      if (!ids.length) return;
      fetch(`${api}:commit?${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ writes: ids.map(id => ({
          update: { name: `${docs}/stats/${id}`, fields: {} },
          updateMask: { fieldPaths: [] },
          updateTransforms: [{ fieldPath: 'count', increment: { integerValue: '1' } }]
        })) })
      }).then(r => {
        if (!r.ok) return;
        ssSet('counted', '1');
        lsSet('visited', '1');
        if (fromQR) lsSet('visited_qr', '1');
      }).catch(() => { /* 집계 실패는 화면에 영향 없음 */ });
    }

    async function paintVisitors(root = document) {
      const el = root.querySelector('[data-visitors]');
      if (!el || !enabled) return;
      try {
        const r = await fetch(`${api}/stats/visitors?${key}`);
        if (!r.ok) return;
        const j = await r.json();
        const n = Number(j.fields && j.fields.count && j.fields.count.integerValue || 0);
        if (n > 0) { el.querySelector('.n').textContent = n.toLocaleString('ko-KR'); el.hidden = false; }
      } catch (e) { /* noop */ }
    }

    return { enabled, record, paintVisitors, fromQR, optOut };
  })();

  // 화면 조각: 숫자 배지(목록 카드), 공감 버튼(홈), 좋아요 블록(질문 상세)
  const likeBadge = id => likes.enabled
    ? `<span class="like-badge" data-like-count="${id}">${ICON.heart}<span class="n">–</span></span>` : '';

  /* ---------- 홈 화면에 추가 ---------- */
  const install = (() => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    const isKakao = /KAKAOTALK/i.test(ua);
    const inApp = isKakao || /Instagram|FBAN|FBAV|NAVER\(inapp|; wv\)|Line\/|DaumApps|everytime/i.test(ua);
    const isSamsung = /SamsungBrowser/i.test(ua);
    const iosOtherBrowser = /CriOS|FxiOS|EdgiOS|Whale/i.test(ua);
    let deferred = null;

    const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });
    window.addEventListener('appinstalled', () => {
      deferred = null;
      document.querySelectorAll('.install-card').forEach(el => el.remove());
      toast('홈 화면에 추가했어요');
    });

    function steps() {
      if (inApp) {
        return {
          steps: [
            '지금은 앱 안의 브라우저로 열려 있어서 바로 추가할 수 없어요.',
            `화면 ${isKakao && isIOS ? '오른쪽 아래' : '오른쪽 위'}의 <b>⋮ 또는 ··· 메뉴</b>를 누르세요.`,
            `<b>‘다른 브라우저로 열기’</b>(또는 ‘${isIOS ? 'Safari' : 'Chrome'}로 열기’)를 고르세요.`,
            '열린 화면에서 <b>홈 화면에 추가하기</b>를 다시 눌러 주세요.'
          ],
          extra: isKakao ? `<button class="pill block" type="button" data-sheet="external">${ICON.ext}${isIOS ? 'Safari' : '기본 브라우저'}로 열기</button>` : ''
        };
      }
      if (isIOS) {
        const br = iosOtherBrowser ? '브라우저' : 'Safari';
        return { steps: [
          `${br} 화면의 <b>공유 버튼</b> ${ICON.shareIOS} 을 누르세요.<br><span class="hint">안 보이면 아래쪽 <b>···</b> 버튼을 먼저 누르세요.</span>`,
          '메뉴를 위로 올려 <b>‘홈 화면에 추가’</b>를 누르세요.',
          '오른쪽 위 <b>‘추가’</b>를 누르면 끝이에요.'
        ] };
      }
      if (isAndroid && isSamsung) {
        return { steps: [
          '화면 아래쪽 <b>≡ 메뉴</b>를 누르세요.',
          '<b>‘현재 페이지 추가’ → ‘홈 화면’</b>을 고르세요.',
          '<b>‘추가’</b>를 누르면 끝이에요.'
        ] };
      }
      if (isAndroid) {
        return { steps: [
          '화면 오른쪽 위 <b>⋮ 메뉴</b>를 누르세요.',
          '<b>‘홈 화면에 추가’</b> 또는 <b>‘앱 설치’</b>를 누르세요.',
          '<b>‘설치’</b> 또는 <b>‘추가’</b>를 누르면 끝이에요.'
        ] };
      }
      return { steps: [
        '휴대폰 카메라로 대자보의 QR코드를 찍어 이 페이지를 여세요.',
        '휴대폰에서 <b>홈 화면에 추가하기</b>를 다시 눌러 주세요.'
      ] };
    }

    const sheet = $('#installSheet'), backdrop = $('#sheetBackdrop');
    let lastFocus = null, isOpen = false;

    function open() {
      const s = steps();
      $('#sheetSteps').innerHTML = s.steps.map(t => `<li>${t}</li>`).join('');
      $('#sheetExtra').innerHTML = s.extra || '';
      lastFocus = document.activeElement;
      sheet.hidden = false; backdrop.hidden = false;
      requestAnimationFrame(() => { sheet.classList.add('open'); backdrop.classList.add('open'); });
      isOpen = true;
      setTimeout(() => $('#sheetClose').focus({ preventScroll: true }), 60);
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      sheet.classList.remove('open'); backdrop.classList.remove('open');
      setTimeout(() => { if (!isOpen) { sheet.hidden = true; backdrop.hidden = true; } }, reduceMotion.matches ? 0 : 320);
      if (lastFocus) try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    }
    $('#sheetClose').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    sheet.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    sheet.addEventListener('click', e => {
      if (e.target.closest('[data-sheet="external"]')) {
        location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href.split('#')[0]);
      }
    });

    async function start() {
      if (deferred) {
        const d = deferred; deferred = null;
        d.prompt();
        try { await d.userChoice; } catch (e) { /* noop */ }
        return;
      }
      open();
    }

    if ('serviceWorker' in navigator && window.isSecureContext) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }

    return { start, standalone };
  })();

  /* ---------- 라우트 ---------- */
  // #/  #/questions  #/archive  #/q/1  #/article/1
  function parse(hash) {
    const h = (hash || '').replace(/^#\/?/, '');
    const [a, b] = h.split('/');
    const n = parseInt(b, 10);
    if (a === 'questions') return { name: 'questions', tab: 'questions', depth: 0 };
    if (a === 'archive') return { name: 'archive', tab: 'archive', depth: 0 };
    if (a === 'q' && n >= 1 && n <= SLOGANS.length) return { name: 'q', id: n, tab: 'questions', depth: 1, parent: '#/questions' };
    if (a === 'article' && n >= 1 && n <= ARTICLES.length) return { name: 'article', id: n, tab: 'archive', depth: 1, parent: '#/archive' };
    return { name: 'home', tab: 'home', depth: 0 };
  }
  const keyOf = r => r.name + (r.id ? '/' + r.id : '');
  const hashOf = r => ({ home: '#/', questions: '#/questions', archive: '#/archive', q: '#/q/' + r.id, article: '#/article/' + r.id }[r.name]);

  /* ---------- 공통 조각 ---------- */
  function navbar(title, backLabel) {
    const left = backLabel
      ? `<button class="nav-btn" type="button" data-action="back" aria-label="뒤로 가기">${ICON.back}<span>${esc(backLabel)}</span></button>`
      : '<span class="nav-spacer"></span>';
    return `<header class="navbar"><div class="navbar-inner">${left}<span class="nav-title" aria-hidden="true">${esc(title)}</span><span class="nav-spacer"></span></div></header>`;
  }

  function media(a, extraClass = '') {
    return `<div class="media ${extraClass}">
      <img src="${esc(a.image)}" alt="${esc(a.alt)}" loading="lazy" decoding="async" data-guard>
      <div class="ph" role="img" aria-label="기사 이미지가 아직 없습니다">${ICON.image}
        <span>기사 이미지를 추가해 주세요</span><code>${esc(a.image)}</code>
      </div>
    </div>`;
  }

  function sloganCard(s, i) {
    const n = i + 1;
    return `<button class="card q-card" type="button" data-href="#/q/${n}" aria-label="질문 ${pad(n)}. ${esc(s.title)}">
      <span class="q-num" aria-hidden="true">${pad(n)}</span>
      <span class="q-text"><span class="q-title">${esc(s.title)}</span><span class="q-preview">${esc(s.body[0].t)}</span>${likeBadge('q' + n)}</span>
      ${ICON.chev}
    </button>`;
  }

  function articleCard(a, i) {
    return `<button class="card a-card" type="button" data-href="#/article/${i + 1}" aria-label="${esc(a.label)}. ${esc(a.cardTitle)}">
      ${media(a, 'a-thumb')}
      <span class="a-body"><span class="a-label">${esc(a.label)}</span><span class="a-title">${esc(a.cardTitle)}</span>${ICON.chev}${a.source ? `<span class="a-src">출처: ${esc(a.source.paper)} · ${esc(a.source.date)}</span>` : ''}</span>
    </button>`;
  }

  /* ---------- 화면 ---------- */
  const VIEWS = {
    home() {
      return `${navbar(APP.title)}
      <div class="large-head">
        <h1 class="large-title" tabindex="-1">${esc(APP.title)}</h1>
      </div>
      <section class="hero" aria-label="캠페인 소개">
        <p class="hero-quote">${esc(APP.subtitle).replace('신앙', '<span class="mark">신앙</span>')}</p>
        <p class="hero-note">${esc(APP.note)}</p>
        ${APP.showVisitorCount && stats.enabled ? `<p class="hero-visitors" data-visitors hidden>지금까지 <b class="n"></b>명이 함께 봤어요</p>` : ''}
        ${likes.enabled ? `<div class="hero-like">
          <button class="like-pill" type="button" data-like="home" aria-pressed="false" aria-label="이 캠페인에 공감해요">${ICON.heart}<span>공감해요</span></button>
          <span class="hero-like-count" data-like-count="home"><b class="n">–</b>명이 공감했어요</span>
        </div>` : ''}
      </section>
      ${install.standalone() ? '' : `<div class="section install-wrap">
        <button class="card install-card" type="button" data-action="install">
          <img class="install-icon" src="apple-touch-icon.png" alt="" width="46" height="46">
          <span class="install-text"><span class="install-title">홈 화면에 추가하기</span><span class="install-sub">아이콘으로 바로 열어 자주 보기</span></span>
          <span class="install-plus">${ICON.plus}</span>
        </button>
      </div>`}
      <section class="section" aria-labelledby="hq">
        <div class="section-head"><h2 class="section-title" id="hq">질문들</h2>
          <button class="section-link" type="button" data-href="#/questions">모두 보기</button></div>
        <div class="stack">${SLOGANS.map(sloganCard).join('')}</div>
      </section>
      <section class="section" aria-labelledby="ha">
        <div class="section-head"><h2 class="section-title" id="ha">기사 자료</h2>
          <button class="section-link" type="button" data-href="#/archive">자료실</button></div>
        <div class="stack">${ARTICLES.map(articleCard).join('')}</div>
      </section>`;
    },

    questions() {
      return `${navbar('질문들')}
      <div class="large-head">
        <p class="eyebrow">${SLOGANS.length}개의 질문</p>
        <h1 class="large-title" tabindex="-1">질문들</h1>
        <p class="large-sub">${esc(APP.subtitle)}</p>
      </div>
      <section class="section"><div class="stack">${SLOGANS.map(sloganCard).join('')}</div></section>`;
    },

    archive() {
      return `${navbar('자료실')}
      <div class="large-head">
        <p class="eyebrow">기사 ${ARTICLES.length}건</p>
        <h1 class="large-title" tabindex="-1">자료실</h1>
        <p class="large-sub">원본 기사 이미지를 눌러 확대해 볼 수 있어요.</p>
      </div>
      <section class="section"><div class="stack">${ARTICLES.map(articleCard).join('')}</div></section>`;
    },

    q(r) {
      const i = r.id - 1, s = SLOGANS[i];
      const prev = SLOGANS[i - 1], next = SLOGANS[i + 1];
      const pager = `<nav class="pager" aria-label="다른 질문으로 이동">
        ${prev ? `<button class="card prev" type="button" data-href="#/q/${i}" aria-label="이전 질문: ${esc(prev.title)}">
          <span class="pg-dir">${ICON.left}이전 · ${pad(i)}</span><span class="pg-title">${esc(prev.title)}</span></button>` : ''}
        ${next ? `<button class="card next" type="button" data-href="#/q/${i + 2}" aria-label="다음 질문: ${esc(next.title)}">
          <span class="pg-dir">다음 · ${pad(i + 2)}${ICON.right}</span><span class="pg-title">${esc(next.title)}</span></button>` : ''}
      </nav>`;
      return `${navbar(pad(r.id) + '. ' + s.title, back.label())}
      <article class="detail">
        <span class="big-num" aria-hidden="true">${pad(r.id)}</span>
        <h1 class="detail-title" tabindex="-1"><span class="sr-only">질문 ${pad(r.id)}. </span>${esc(s.title)}</h1>
        <div class="detail-body">${s.body.map(l => `<p${l.em ? ' class="em"' : ''}>${esc(l.t)}</p>`).join('')}</div>
        ${likes.enabled ? `<div class="like-block">
          <button class="like-round" type="button" data-like="q${r.id}" aria-pressed="false" aria-label="이 질문에 좋아요">${ICON.heart}</button>
          <span class="like-block-text" data-like-count="q${r.id}"><b class="n">–</b><span>명이 이 질문에 공감해요</span></span>
        </div>` : ''}
        <div class="actions">
          <button class="pill" type="button" data-action="copy" aria-label="이 질문의 문구 복사">${ICON.copy}텍스트 복사</button>
          ${navigator.share ? `<button class="pill" type="button" data-action="share" aria-label="이 질문 공유">${ICON.share}공유</button>` : ''}
        </div>
        ${pager}
      </article>`;
    },

    article(r) {
      const a = ARTICLES[r.id - 1];
      return `${navbar(a.label, back.label())}
      <div class="large-head">
        <p class="eyebrow">${esc(a.label)}</p>
        <h1 class="large-title" tabindex="-1" style="font-size:28px">${esc(a.title)}</h1>
      </div>
      <figure class="article-figure" style="margin-bottom:0">
        <button class="zoom-tap" type="button" data-action="zoom" aria-label="기사 이미지 확대해서 보기">${media(a)}</button>
        <figcaption class="fig-cap">${ICON.zoom}이미지를 터치하면 확대해서 볼 수 있어요</figcaption>
      </figure>
      ${a.source ? `<section class="source-card" aria-label="기사 출처">
        <p class="src-label">출처${a.source.note ? ` · ${esc(a.source.note)}` : ''}</p>
        <p class="src-head">「${esc(a.source.headline)}」</p>
        <p class="src-meta">${esc(a.source.paper)} · ${esc(a.source.reporter)} · ${esc(a.source.date)}</p>
        <a class="src-link" href="${esc(a.source.url)}" target="_blank" rel="noopener noreferrer">원문 기사 보기${ICON.ext}</a>
      </section>` : ''}
      <div class="article-actions">
        <button class="pill solid block" type="button" data-action="zoom">${ICON.zoom}확대해서 보기</button>
        <button class="pill block" type="button" data-action="tolist">${ICON.list}기사 목록으로</button>
      </div>`;
    }
  };

  /* ---------- 뒤로 가기 라벨 ---------- */
  const back = {
    label() {
      const p = state.prevRoute;
      if (p && p.depth === 0) return { home: '홈', questions: '질문들', archive: '자료실' }[p.name];
      return state.route.name === 'q' ? '질문들' : '자료실';
    }
  };

  /* ---------- 상태 & 렌더 ---------- */
  const state = { route: null, prevRoute: null, idx: 0, screen: null, scroll: {} };

  function direction(from, to) {
    if (!from) return 'none';
    if (from.depth === 0 && to.depth === 0) return 'fade';
    if (to.depth > from.depth) return 'forward';
    if (to.depth < from.depth) return 'back';
    if (from.name === to.name) return to.id > from.id ? 'forward' : 'back';
    return 'fade';
  }

  function render(route, dir) {
    const old = state.screen;
    if (old) state.scroll[keyOf(state.route)] = old.scrollTop;
    // 진행 중인 전환 정리
    stage.querySelectorAll('.screen.leaving').forEach(el => el.remove());

    if (route.depth === 1 && state.route) state.prevRoute = (state.route.depth === 0 ? state.route : state.prevRoute);
    state.route = route;

    const el = document.createElement('div');
    el.className = 'screen';
    el.dataset.key = keyOf(route);
    el.innerHTML = VIEWS[route.name](route);
    stage.appendChild(el);
    state.screen = el;

    // 뒤로 돌아온 목록 화면은 스크롤 위치 복원
    if (dir === 'back' || dir === 'fade') {
      const y = state.scroll[keyOf(route)];
      if (y) el.scrollTop = y;
    }

    bindScreen(el);
    updateTabs(route.tab);
    document.title = route.name === 'home' ? APP.title
      : (route.name === 'q' ? SLOGANS[route.id - 1].title : route.name === 'article' ? ARTICLES[route.id - 1].title : el.querySelector('h1').textContent) + ' · ' + APP.title;

    const animate = old && dir !== 'none' && !reduceMotion.matches;
    if (!animate) { if (old) old.remove(); focusTitle(el); return; }

    el.classList.add('enter-' + dir);
    old.classList.add('leaving', 'leave-' + dir);
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      old.remove();
      el.classList.remove('enter-' + dir);
      focusTitle(el);
    };
    el.addEventListener('animationend', finish, { once: true });
    setTimeout(finish, 600);
  }

  function focusTitle(el) {
    const h = el.querySelector('h1');
    if (h) try { h.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  function updateTabs(tab) {
    tabbar.querySelectorAll('.tab').forEach(b => {
      if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  function bindScreen(el) {
    likes.paint(el);
    stats.paintVisitors(el);
    // 이미지 없을 때 플레이스홀더
    el.querySelectorAll('img[data-guard]').forEach(img => {
      const box = img.closest('.media');
      const ok = () => { box.classList.add('loaded'); box.classList.remove('missing'); };
      const bad = () => box.classList.add('missing');
      if (img.complete) { img.naturalWidth ? ok() : bad(); }
      img.addEventListener('load', ok);
      img.addEventListener('error', bad);
    });
    // 스크롤 시 내비게이션 바 작은 제목
    const bar = el.querySelector('.navbar');
    const h1 = el.querySelector('h1');
    const onScroll = () => {
      const limit = h1 ? h1.offsetTop + h1.offsetHeight - bar.offsetHeight : 40;
      bar.classList.toggle('scrolled', el.scrollTop > Math.max(8, limit));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 이동 ---------- */
  function go(hash, opts = {}) {
    const to = parse(hash);
    const dir = opts.dir || direction(state.route, to);
    if (opts.replace) history.replaceState({ idx: state.idx }, '', hashOf(to));
    else { state.idx += 1; history.pushState({ idx: state.idx }, '', hashOf(to)); }
    render(to, dir);
  }

  function goBack() {
    if (state.idx > 0) history.back();
    else go(state.route.parent || '#/', { replace: true, dir: 'back' });
  }

  window.addEventListener('popstate', e => {
    const s = e.state || { idx: 0 };
    if (viewer.isOpen) { viewer.close(true); state.idx = s.idx; if (!s.viewer) return; }
    if (s.viewer) { // 앞으로 가기로 뷰어 상태에 다시 들어온 경우
      state.idx = s.idx;
      if (state.route.name === 'article') viewer.open(ARTICLES[state.route.id - 1], true);
      return;
    }
    state.idx = s.idx;
    const to = parse(location.hash);
    if (keyOf(to) === keyOf(state.route)) return;
    render(to, direction(state.route, to));
  });

  /* ---------- 클릭(이벤트 위임) ---------- */
  stage.addEventListener('click', e => {
    const lk = e.target.closest('[data-like]');
    if (lk) { likes.toggle(lk.dataset.like, lk); return; }
    const link = e.target.closest('[data-href]');
    if (link) { go(link.dataset.href); return; }
    const act = e.target.closest('[data-action]');
    if (!act) return;
    const r = state.route;
    switch (act.dataset.action) {
      case 'back': goBack(); break;
      case 'tolist': goBack(); break;
      case 'install': install.start(); break;
      case 'copy': copySlogan(SLOGANS[r.id - 1], r.id); break;
      case 'share': shareSlogan(SLOGANS[r.id - 1], r.id); break;
      case 'zoom': {
        const box = state.screen.querySelector('.article-figure .media');
        if (box && box.classList.contains('missing')) toast('아직 기사 이미지가 없어요');
        else viewer.open(ARTICLES[r.id - 1]);
        break;
      }
    }
  });

  tabbar.addEventListener('click', e => {
    const b = e.target.closest('.tab');
    if (!b) return;
    const target = { home: '#/', questions: '#/questions', archive: '#/archive' }[b.dataset.tab];
    const cur = state.route;
    if (cur.tab === b.dataset.tab && cur.depth === 0) {
      state.screen.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      return;
    }
    if (cur.tab === b.dataset.tab && cur.depth > 0 && state.idx > 0 && state.prevRoute && state.prevRoute.tab === cur.tab) {
      goBack(); return;
    }
    go(target);
  });

  // iOS에서 :active 눌림 효과가 동작하도록 + 눌림 클래스
  document.addEventListener('touchstart', () => {}, { passive: true });
  stage.addEventListener('pointerdown', e => {
    const c = e.target.closest('.card');
    if (!c) return;
    c.classList.add('pressed');
    const up = () => { c.classList.remove('pressed'); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
  stage.addEventListener('scroll', () => stage.querySelectorAll('.card.pressed').forEach(c => c.classList.remove('pressed')), { capture: true, passive: true });

  /* ---------- 복사 / 공유 ---------- */
  const sloganText = (s, n) => `${pad(n)}. ${s.title}\n\n${s.body.map(l => l.t).join('\n')}`;

  async function copySlogan(s, n) {
    const text = sloganText(s, n);
    try {
      await navigator.clipboard.writeText(text);
      toast('문구를 복사했어요');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      toast(ok ? '문구를 복사했어요' : '복사하지 못했어요. 길게 눌러 직접 복사해 주세요');
    }
  }

  async function shareSlogan(s, n) {
    try {
      await navigator.share({ title: APP.title, text: sloganText(s, n), url: location.href });
    } catch (e) { /* 사용자가 취소 */ }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  /* ---------- 이미지 뷰어 (확대·이동) ---------- */
  const viewer = (() => {
    const root = $('#viewer'), scroller = $('#viewerScroll'), img = $('#viewerImg');
    const btnIn = $('#zoomIn'), btnOut = $('#zoomOut'), btnClose = $('#viewerClose');
    const MIN = 1, MAX = 5;
    let scale = 1, fitW = 0, lastFocus = null, lastTap = 0, pinch = null;

    function fit() {
      const w = scroller.clientWidth - 24, h = scroller.clientHeight - 24;
      const ratio = img.naturalWidth / img.naturalHeight || 1;
      fitW = Math.max(100, Math.min(w, h * ratio));
    }

    // (cx, cy): 화면(스크롤 영역) 기준 고정점
    function setScale(next, cx, cy) {
      next = Math.min(MAX, Math.max(MIN, next));
      const rect = scroller.getBoundingClientRect();
      if (cx == null) { cx = rect.width / 2; cy = rect.height / 2; }
      const u = (scroller.scrollLeft + cx - img.offsetLeft) / img.offsetWidth;
      const v = (scroller.scrollTop + cy - img.offsetTop) / img.offsetHeight;
      scale = next;
      img.style.width = (fitW * scale) + 'px';
      scroller.scrollLeft = img.offsetLeft + u * img.offsetWidth - cx;
      scroller.scrollTop = img.offsetTop + v * img.offsetHeight - cy;
      btnOut.disabled = scale <= MIN + .01;
      btnIn.disabled = scale >= MAX - .01;
    }

    function open(a, fromHistory) {
      lastFocus = document.activeElement;
      $('#viewerTitle').textContent = a.title;
      img.alt = a.alt;
      root.hidden = false;
      const ready = () => { fit(); scale = 1; img.style.width = fitW + 'px'; setScale(1); };
      img.onload = ready;
      if (img.getAttribute('src') !== a.image) img.src = a.image; else if (img.complete) ready();
      requestAnimationFrame(() => root.classList.add('open'));
      if (!fromHistory) { state.idx += 1; history.pushState({ idx: state.idx, viewer: true }, '', location.hash); }
      setTimeout(() => btnClose.focus({ preventScroll: true }), 50);
      api.isOpen = true;
    }

    function close(fromHistory) {
      if (!api.isOpen) return;
      api.isOpen = false;
      root.classList.remove('open');
      setTimeout(() => { if (!api.isOpen) root.hidden = true; }, reduceMotion.matches ? 0 : 250);
      if (lastFocus) try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ }
      if (!fromHistory) history.back();
    }

    btnClose.addEventListener('click', () => close(false));
    btnIn.addEventListener('click', () => setScale(scale * 1.5));
    btnOut.addEventListener('click', () => setScale(scale / 1.5));
    root.addEventListener('keydown', e => {
      if (e.key === 'Escape') close(false);
      if (e.key === '+' || e.key === '=') setScale(scale * 1.5);
      if (e.key === '-') setScale(scale / 1.5);
      if (e.key === 'Tab') { // 포커스 가두기
        const f = [...root.querySelectorAll('button:not(:disabled)')];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', () => { if (api.isOpen && img.naturalWidth) { fit(); setScale(scale); } });

    // 핀치 줌
    const dist = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    scroller.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        const r = scroller.getBoundingClientRect();
        pinch = {
          d: dist(e.touches), s: scale,
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top
        };
      }
    }, { passive: true });
    scroller.addEventListener('touchmove', e => {
      if (pinch && e.touches.length === 2) {
        e.preventDefault();
        setScale(pinch.s * dist(e.touches) / pinch.d, pinch.x, pinch.y);
      }
    }, { passive: false });
    scroller.addEventListener('touchend', e => {
      if (e.touches.length < 2) pinch = null;
      // 두 번 탭
      if (e.touches.length === 0 && e.changedTouches.length === 1) {
        const now = Date.now(), t = e.changedTouches[0];
        if (now - lastTap < 300) {
          const r = scroller.getBoundingClientRect();
          setScale(scale > 1.2 ? 1 : 2.5, t.clientX - r.left, t.clientY - r.top);
          lastTap = 0;
          e.preventDefault();
        } else lastTap = now;
      }
    }, { passive: false });
    // iOS Safari 페이지 자체 확대 방지 (뷰어 안에서만)
    ['gesturestart', 'gesturechange'].forEach(n => root.addEventListener(n, e => e.preventDefault()));
    // 데스크톱: 더블클릭 / Ctrl+휠
    scroller.addEventListener('dblclick', e => {
      const r = scroller.getBoundingClientRect();
      setScale(scale > 1.2 ? 1 : 2.5, e.clientX - r.left, e.clientY - r.top);
    });
    scroller.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = scroller.getBoundingClientRect();
      setScale(scale * Math.exp(-e.deltaY / 200), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    // 마우스 드래그로 이동
    let drag = null;
    scroller.addEventListener('mousedown', e => { drag = { x: e.clientX, y: e.clientY, l: scroller.scrollLeft, t: scroller.scrollTop }; scroller.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if (drag) { scroller.scrollLeft = drag.l - (e.clientX - drag.x); scroller.scrollTop = drag.t - (e.clientY - drag.y); } });
    window.addEventListener('mouseup', () => { drag = null; scroller.style.cursor = ''; });

    const api = { open, close, isOpen: false };
    return api;
  })();

  /* ---------- 상태바 시계 (데스크톱 미리보기용) ---------- */
  function tick() {
    const d = new Date();
    $('#sbTime').textContent = `${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`;
  }
  tick(); setInterval(tick, 20000);

  /* ---------- 시작 ---------- */
  const first = parse(location.hash);
  history.replaceState({ idx: 0 }, '', hashOf(first));
  render(first, 'none');
  likes.load();
  stats.record();
  if (stats.optOut) toast('이 브라우저는 이제 접속자 수에서 빠져요');
})();
