# 믿음이 자격이 되는 순간

종교적 자격 요건과 채용의 공정성을 질문하는 인터랙티브 캠페인 웹앱입니다.
GitHub Pages에 올려 쓰는 정적 사이트이고, 좋아요 숫자만 Firebase(구글 무료 데이터베이스)에 저장합니다.

주소: https://faith-question-project.github.io/faith-campaign/

## 파일 (모두 저장소 맨 위에 둡니다, 폴더 없음)

| 파일 | 역할 |
|---|---|
| index.html | 화면 뼈대 |
| style.css | 디자인 |
| script.js | 동작 + 슬로건/기사/출처 데이터 |
| config.js | 좋아요 서버(Firebase) 연결 정보 |
| manifest.webmanifest, sw.js | 홈 화면에 추가(앱처럼 설치) 기능 |
| icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png, favicon.png | 앱 아이콘 |
| article1.jpg, article2.jpg | 기사 원본 이미지 |

## 바로가기 주소 (QR용)

| 화면 | 주소 끝 |
|---|---|
| 홈 | `#/` |
| 질문 01~04 | `#/q/1` ~ `#/q/4` |
| 질문 목록 | `#/questions` |
| 자료실 | `#/archive` |
| 기사 01 / 02 | `#/article/1`, `#/article/2` |

## 내용 수정·추가

`script.js` 맨 위 배열에서 합니다.

- **슬로건 추가**: `SLOGANS`에 `{ title: '...', body: [ { t: '...' }, { t: '...', em: true } ] }` 추가 (`em: true` = 버건디 강조). 좋아요도 자동으로 붙습니다(최대 99개).
- **기사 추가**: 이미지를 `article3.jpg`로 올리고 `ARTICLES`에 항목 추가. 출처는 `source`에 신문명·기사 제목·기자·날짜·주소를 적습니다.

## 좋아요(Firebase) 설정

`config.js`의 `apiKey`, `projectId`가 비어 있으면 좋아요 버튼은 숨겨집니다.
Firestore 보안 규칙(아래)을 꼭 게시해야 합니다. 이 규칙은 좋아요 숫자를 한 번에 1씩만 올리고 내릴 수 있게 하고, 그 외 쓰기는 모두 막습니다.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /likes/{id} {
      allow read: if true;
      allow create: if (id == 'home' || id.matches('q[0-9]{1,2}'))
        && request.resource.data.keys().hasOnly(['count'])
        && request.resource.data.count == 1;
      allow update: if request.resource.data.keys().hasOnly(['count'])
        && request.resource.data.count is int
        && request.resource.data.count >= 0
        && (request.resource.data.count == resource.data.count + 1
            || request.resource.data.count == resource.data.count - 1);
    }
  }
}
```

한 기기에서는 한 번만 누를 수 있지만(브라우저에 기억), 로그인이 없으므로 작정하고 숫자를 부풀리는 것까지 완전히 막지는 못합니다.

좋아요 숫자 확인/초기화: Firebase 콘솔 → Firestore Database → `likes` 컬렉션.
