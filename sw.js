/* 홈 화면 앱용 서비스 워커
   - 항상 인터넷에서 최신 파일을 먼저 받습니다(수정하면 바로 반영).
   - 인터넷이 끊겼을 때만 마지막으로 받아 둔 파일을 보여 줍니다.
   - 좋아요 서버(Firebase) 요청은 건드리지 않습니다. */
const CACHE = 'faith-campaign-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then(hit => hit || caches.match('./')))
  );
});
