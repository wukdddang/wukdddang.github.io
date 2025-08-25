이 내용은 **Server-Side Parameter Pollution** 공격 중 **기존 매개변수 오버라이드** 기법에 대해 설명하고 있습니다.

### 공격 원리

동일한 이름의 매개변수를 중복으로 전송하여 서버측에서 매개변수 처리 방식의 차이를 악용하는 공격입니다.

### 예시 분석

```
클라이언트 요청: GET /userSearch?name=peter%26name=carlos&back=/home
서버측 내부 요청: GET /users/search?name=peter&name=carlos&publicProfile=true
```

### 플랫폼별 처리 방식

|플랫폼|처리 방식|결과|
|---|---|---|
|**PHP**|마지막 매개변수만 파싱|`carlos`|
|**ASP.NET**|모든 매개변수 결합|`peter,carlos`|
|**Node.js/Express**|첫 번째 매개변수만 파싱|`peter`|

## Next.js 13+ 에서 취약한 코드 예시

### 1. URLSearchParams를 잘못 사용하는 경우

javascript

```javascript
// app/api/user-search/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 취약점: getAll()을 사용하지 않고 get()만 사용
  const name = searchParams.get('name'); // 첫 번째 값만 가져옴
  
  // 내부 API 호출
  const apiUrl = `${process.env.INTERNAL_API}/users/search?name=${name}&publicProfile=true`;
  const response = await fetch(apiUrl);
  return NextResponse.json(await response.json());
}
```

### 2. 수동으로 쿼리 스트링을 파싱하는 경우

javascript

```javascript
// app/actions.js
'use server'

export async function searchUsers(formData) {
  // 취약점: 수동 파싱으로 중복 매개변수 처리 불일치
  const queryString = formData.get('query');
  const params = queryString.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    acc[key] = value; // 마지막 값으로 덮어씀 (PHP 방식과 유사)
    return acc;
  }, {});
  
  const name = params.name;
  
  // 공격자가 name=peter&name=administrator를 주입하면
  // name은 'administrator'가 됨
  const apiUrl = `${process.env.INTERNAL_API}/users/search?name=${name}&publicProfile=true`;
  const response = await fetch(apiUrl);
  return response.json();
}
```

### 3. Middleware에서의 취약점

javascript

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 취약점: 중복 매개변수에 대한 처리 불일치
  const nameParams = url.searchParams.getAll('name');
  
  // 잘못된 처리: 마지막 값만 사용
  const name = nameParams[nameParams.length - 1];
  
  // 새로운 URL 구성
  url.pathname = '/api/internal/users';
  url.search = `?name=${name}&publicProfile=true`;
  
  return NextResponse.rewrite(url);
}
```

### 4. Form Data 처리에서의 취약점

javascript

```javascript
// app/api/admin/route.js
export async function POST(request) {
  const formData = await request.formData();
  
  // 취약점: FormData.get()은 첫 번째 값만 반환
  const username = formData.get('username');
  const role = formData.get('role');
  
  // 공격자가 username=user&username=admin을 전송하면
  // username은 'user'가 되지만, 백엔드에서 다르게 처리될 수 있음
  
  const response = await fetch(`${process.env.ADMIN_API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&role=${role}`
  });
  
  return NextResponse.json(await response.json());
}
```

## 실제 공격 시나리오

### 1. 권한 상승 공격

javascript

```javascript
// 공격자의 요청
POST /api/user-update
Content-Type: application/x-www-form-urlencoded

username=normaluser&username=administrator&action=promote
```

### 2. 인증 우회 공격

javascript

```javascript
// 공격자의 요청
GET /api/auth/validate?token=invalid_token&token=admin_token
```

## 보안 대책

### 1. 명시적인 중복 매개변수 처리

javascript

```javascript
// 안전한 코드 예시
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 중복 매개변수 명시적 처리
  const nameValues = searchParams.getAll('name');
  
  // 보안 정책: 중복 매개변수 거부
  if (nameValues.length > 1) {
    return NextResponse.json(
      { error: 'Multiple parameters with same name not allowed' },
      { status: 400 }
    );
  }
  
  const name = nameValues[0];
  
  // 입력 검증
  if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
    return NextResponse.json(
      { error: 'Invalid name parameter' },
      { status: 400 }
    );
  }
  
  const params = new URLSearchParams({ name, publicProfile: 'true' });
  const apiUrl = `${process.env.INTERNAL_API}/users/search?${params}`;
  
  const response = await fetch(apiUrl);
  return NextResponse.json(await response.json());
}
```

### 2. 화이트리스트 기반 매개변수 처리

javascript

```javascript
// 허용된 매개변수만 처리
export async function POST(request) {
  const formData = await request.formData();
  
  const allowedParams = ['username', 'email', 'role'];
  const params = {};
  
  for (const param of allowedParams) {
    const values = formData.getAll(param);
    
    // 중복 매개변수 검증
    if (values.length > 1) {
      return NextResponse.json(
        { error: `Duplicate parameter: ${param}` },
        { status: 400 }
      );
    }
    
    if (values.length === 1) {
      params[param] = values[0];
    }
  }
  
  // 안전하게 처리된 매개변수만 사용
  const response = await fetch(`${process.env.API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  
  return NextResponse.json(await response.json());
}
```

### 3. 매개변수 정규화

javascript

```javascript
// middleware.js
export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 중복 매개변수 정규화
  const normalizedParams = new URLSearchParams();
  
  for (const [key, value] of url.searchParams.entries()) {
    if (normalizedParams.has(key)) {
      // 중복 매개변수 발견 시 요청 거부
      return new NextResponse('Bad Request: Duplicate parameters', {
        status: 400
      });
    }
    normalizedParams.append(key, value);
  }
  
  url.search = normalizedParams.toString();
  return NextResponse.next();
}
```

이러한 공격을 방지하려면 중복 매개변수를 명시적으로 처리하고, 입력 검증을 강화하며, 허용된 매개변수만 처리하는 화이트리스트 방식을 사용해야 합니다.