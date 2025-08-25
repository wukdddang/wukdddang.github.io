
이 내용은 **Server-Side Request Forgery (SSRF)** 공격 중 하나인 **Query Parameter Injection** 기법에 대해 설명하고 있습니다.

### 공격 원리

1. **숨겨진 매개변수 발견**: 먼저 서버에서 사용하는 숨겨진 매개변수를 찾아냅니다.
2. **매개변수 주입**: 발견한 매개변수를 쿼리 스트링에 추가하여 서버측 요청을 조작합니다.
3. **내부 API 호출 변조**: 결과적으로 서버가 내부 API를 호출할 때 공격자가 의도한 매개변수가 포함됩니다.

### 예시 분석

```
클라이언트 요청: GET /userSearch?name=peter%26email=foo&back=/home
서버측 내부 요청: GET /users/search?name=peter&email=foo&publicProfile=true
```

- `%26`은 URL 인코딩된 `&` 문자
- 공격자가 `email=foo` 매개변수를 주입하여 내부 API 호출을 변조

## Next.js 13+ 에서 취약한 코드 예시

### 1. Server Actions에서의 취약점

javascript

```javascript
// app/actions.js
'use server'

export async function searchUsers(formData) {
  const name = formData.get('name');
  const backUrl = formData.get('back');
  
  // 취약점: 사용자 입력을 직접 쿼리 스트링에 포함
  const apiUrl = `${process.env.INTERNAL_API}/users/search?name=${name}&publicProfile=true`;
  
  const response = await fetch(apiUrl);
  return response.json();
}
```

### 2. Route Handler에서의 취약점

javascript

```javascript
// app/api/user-search/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const email = searchParams.get('email'); // 숨겨진 매개변수
  
  // 취약점: 매개변수 검증 없이 내부 API 호출
  let apiUrl = `${process.env.INTERNAL_API}/users/search?name=${name}&publicProfile=true`;
  
  if (email) {
    apiUrl += `&email=${email}`; // 공격자가 주입 가능
  }
  
  const response = await fetch(apiUrl);
  return NextResponse.json(await response.json());
}
```

### 3. Middleware에서의 취약점

javascript

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const name = url.searchParams.get('name');
  
  // 취약점: 사용자 입력 직접 포함
  url.pathname = '/api/internal/users';
  url.search = `?name=${name}&publicProfile=true`;
  
  return NextResponse.rewrite(url);
}
```

## 보안 대책

### 1. 입력 검증 및 살균화

javascript

```javascript
// 안전한 코드 예시
export async function searchUsers(formData) {
  const name = formData.get('name');
  
  // 입력 검증
  if (!name || typeof name !== 'string' || name.length > 50) {
    throw new Error('Invalid name parameter');
  }
  
  // URL 매개변수 안전하게 인코딩
  const params = new URLSearchParams({
    name: name.trim(),
    publicProfile: 'true'
  });
  
  const apiUrl = `${process.env.INTERNAL_API}/users/search?${params}`;
  const response = await fetch(apiUrl);
  return response.json();
}
```

### 2. 허용된 매개변수만 처리

javascript

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 허용된 매개변수만 추출
  const allowedParams = {
    name: searchParams.get('name'),
    // email 매개변수는 의도적으로 제외
  };
  
  // 검증 후 안전하게 구성
  const params = new URLSearchParams();
  if (allowedParams.name) {
    params.append('name', allowedParams.name);
  }
  params.append('publicProfile', 'true');
  
  const apiUrl = `${process.env.INTERNAL_API}/users/search?${params}`;
  const response = await fetch(apiUrl);
  return NextResponse.json(await response.json());
}
```

이러한 공격을 방지하려면 사용자 입력을 항상 검증하고, 허용된 매개변수만 처리하며, URL 구성 시 적절한 인코딩을 사용해야 합니다.