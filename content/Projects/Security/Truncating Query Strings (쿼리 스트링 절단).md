**쿼리 스트링 절단(Truncating Query Strings) 공격**에 대해 설명드리겠습니다.

## 기본 개념

이 기법은 URL 인코딩된 `#` 문자를 사용하여 서버 사이드 요청을 의도적으로 절단시키는 공격 방법입니다. `#` 문자는 일반적으로 URL 프래그먼트 식별자로 작동하여 그 이후의 내용을 무시하게 만듭니다.

## 공격 과정

**1단계 - 공격자의 입력:**

```
GET /userSearch?name=peter%23foo&back=/home
```

여기서 `%23`은 URL 인코딩된 `#` 문자입니다.

**2단계 - 프론트엔드의 내부 API 호출:**

```
GET /users/search?name=peter#foo&publicProfile=true
```

**3단계 - 서버의 실제 처리:** `#` 문자 이후가 절단되어 실제로는 다음과 같이 처리됩니다:

```
GET /users/search?name=peter
```

## 핵심 포인트

**URL 인코딩 필수**: `#` 문자를 반드시 `%23`으로 URL 인코딩해야 합니다. 그렇지 않으면 프론트엔드 애플리케이션이 이를 프래그먼트 식별자로 해석하여 내부 API로 전달되지 않습니다.

**응답 분석**: 쿼리가 절단되었는지 확인하기 위해 응답을 주의 깊게 분석해야 합니다.

## 공격 성공/실패 판단

**성공 사례**: 응답에서 사용자 `peter`가 반환되면 서버 사이드 쿼리가 절단되었을 가능성이 높습니다.

**실패 사례**: `Invalid name` 오류 메시지가 반환되면 애플리케이션이 `foo`를 사용자명의 일부로 처리했다는 의미이므로, 서버 사이드 요청이 절단되지 않았을 수 있습니다.

## 보안 위험

이 공격이 성공하면 `publicProfile=true` 필드 요구사항을 우회할 수 있습니다. 이는 다음과 같은 결과를 초래할 수 있습니다:

- **비공개 사용자 프로필 접근**: 원래는 공개 프로필만 볼 수 있어야 하는데, 비공개 프로필도 접근 가능해질 수 있습니다
- **권한 우회**: 특정 조건을 만족해야 하는 기능들을 우회할 수 있습니다
- **데이터 노출**: 제한된 정보에 무단으로 접근할 수 있습니다

## 요약

쿼리 스트링 절단 공격은 URL 인코딩된 `#` 문자를 이용해 서버 사이드 요청의 일부를 의도적으로 제거하는 기법입니다. 이를 통해 보안 제약 조건(예: `publicProfile=true`)을 우회하여 원래 접근할 수 없는 데이터나 기능에 접근할 수 있게 됩니다. 성공 여부는 서버의 응답을 분석하여 판단할 수 있으며, 이 공격이 성공하면 심각한 정보 노출이나 권한 우회 문제가 발생할 수 있습니다.

---
Next.js에서 쿼리 스트링 절단 공격에 취약한 코드 패턴들을 실제 예시로 설명드리겠습니다.

## 취약한 코드 패턴들

### 1. 문자열 연결로 URL 구성 (가장 위험)

javascript

```javascript
// ❌ 매우 취약한 코드
export default async function handler(req, res) {
  const { name, category } = req.query;
  
  // 사용자 입력을 그대로 문자열에 삽입
  const apiUrl = `https://internal-api.com/users?name=${name}&publicProfile=true&category=${category}`;
  
  const response = await fetch(apiUrl);
  res.json(await response.json());
}
```

**공격 시나리오:**

```
GET /api/users?name=peter%23&category=admin

실제 내부 API 호출:
https://internal-api.com/users?name=peter#&publicProfile=true&category=admin
                                    ↑
                         여기서 URL이 절단됨
```

### 2. URL 객체 부적절한 사용

javascript

```javascript
// ❌ 취약한 코드
export default async function handler(req, res) {
  const { search } = req.query;
  
  const baseUrl = 'https://internal-api.com/search';
  const fullUrl = `${baseUrl}?q=${search}&includePrivate=false&limit=10`;
  
  const response = await fetch(fullUrl);
  res.json(await response.json());
}
```

**공격:**

```
GET /api/search?search=hacker%23secret

내부 호출:
https://internal-api.com/search?q=hacker#secret&includePrivate=false&limit=10
                                        ↑
                              절단되어 includePrivate=false가 무시됨
```

### 3. Router.push/replace에서 동적 URL 구성

javascript

```javascript
// ❌ 클라이언트 사이드에서도 취약
import { useRouter } from 'next/router';

function SearchComponent() {
  const router = useRouter();
  
  const handleSearch = (userInput) => {
    // 사용자 입력을 직접 URL에 삽입
    router.push(`/search?q=${userInput}&type=public`);
  };
  
  return (
    <input onChange={(e) => handleSearch(e.target.value)} />
  );
}
```

### 4. 서버 액션에서 부적절한 URL 구성

javascript

```javascript
// ❌ Next.js App Router의 Server Action에서 취약
'use server'

export async function searchUsers(formData) {
  const query = formData.get('query');
  
  // 직접 문자열 삽입
  const url = `https://api.example.com/users?search=${query}&onlyActive=true`;
  
  const response = await fetch(url);
  return response.json();
}
```

## 안전한 코드 작성법

### 1. URLSearchParams 사용 (권장)

javascript

```javascript
// ✅ 안전한 코드
export default async function handler(req, res) {
  const { name, category } = req.query;
  
  const params = new URLSearchParams();
  params.set('name', name);           // 자동 인코딩됨
  params.set('publicProfile', 'true');
  params.set('category', category);   // 자동 인코딩됨
  
  const apiUrl = `https://internal-api.com/users?${params.toString()}`;
  
  const response = await fetch(apiUrl);
  res.json(await response.json());
}
```

### 2. URL 객체 + URLSearchParams

javascript

```javascript
// ✅ 더 안전한 방법
export default async function handler(req, res) {
  const { search } = req.query;
  
  const url = new URL('https://internal-api.com/search');
  url.searchParams.set('q', search);
  url.searchParams.set('includePrivate', 'false');
  url.searchParams.set('limit', '10');
  
  const response = await fetch(url.toString());
  res.json(await response.json());
}
```

### 3. 입력 검증 + 화이트리스트

javascript

```javascript
// ✅ 가장 보안성이 높은 방법
export default async function handler(req, res) {
  const { name, category } = req.query;
  
  // 입력 검증
  if (!name || typeof name !== 'string' || name.length > 50) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  
  // 허용된 카테고리만 처리
  const allowedCategories = ['user', 'admin', 'guest'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  
  const params = new URLSearchParams();
  params.set('name', name);
  params.set('publicProfile', 'true');
  params.set('category', category);
  
  const apiUrl = `https://internal-api.com/users?${params.toString()}`;
  
  const response = await fetch(apiUrl);
  res.json(await response.json());
}
```

## 특히 주의해야 할 Next.js 패턴들

### 1. Dynamic API Routes

javascript

```javascript
// pages/api/users/[...params].js
// ❌ 위험
export default async function handler(req, res) {
  const { params } = req.query;
  const userQuery = params.join('/');
  
  // 매우 위험한 패턴
  const url = `https://internal-api.com/${userQuery}?auth=true`;
  const response = await fetch(url);
  res.json(await response.json());
}
```

### 2. Middleware에서 URL 조작

javascript

```javascript
// middleware.js
// ❌ 위험
export function middleware(request) {
  const searchParam = request.nextUrl.searchParams.get('redirect');
  
  // 직접 문자열 조작
  const newUrl = `${request.nextUrl.origin}/api/auth?target=${searchParam}&verified=true`;
  
  return NextResponse.rewrite(newUrl);
}
```

## 핵심 원칙

1. **절대 문자열 연결 금지**: 사용자 입력을 직접 URL 문자열에 삽입하지 마세요.

2. **URLSearchParams 활용**: 모든 쿼리 파라미터는 URLSearchParams를 통해 처리하세요.

3. **입력 검증**: 화이트리스트 방식으로 허용된 값만 처리하세요.

4. **인코딩 확인**: 최종 URL이 올바르게 인코딩되었는지 로그로 확인하세요.

이런 패턴들을 피하고 안전한 방법을 사용하면 쿼리 스트링 절단 공격을 효과적으로 방지할 수 있습니다.