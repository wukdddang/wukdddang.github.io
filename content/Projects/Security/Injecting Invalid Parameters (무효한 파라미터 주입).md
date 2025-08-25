**무효한 파라미터 주입(Injecting Invalid Parameters) 공격**에 대해 설명드리겠습니다.

## 기본 개념

URL 인코딩된 `&` 문자(`%26`)를 사용하여 서버 사이드 요청에 추가 파라미터를 주입하는 공격 기법입니다. 이를 통해 원래 의도하지 않은 파라미터를 내부 API 호출에 포함시킬 수 있습니다.

## 공격 과정

**1단계 - 공격자의 입력:**

```
GET /userSearch?name=peter%26foo=xyz&back=/home
```

여기서 `%26`은 URL 인코딩된 `&` 문자입니다.

**2단계 - 서버 사이드 내부 API 호출:**

```
GET /users/search?name=peter&foo=xyz&publicProfile=true
```

**3단계 - 결과 분석:**

- 응답이 변하지 않으면: 파라미터가 주입되었지만 무시됨
- 응답이 변하면: 파라미터가 처리되어 애플리케이션 동작에 영향을 줌

## Next.js 13+ App Router에서 취약한 코드 패턴들

### 1. 문자열 연결로 URL 구성 (가장 위험)

javascript

```javascript
// app/api/users/route.js
// ❌ 매우 취약한 코드
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const category = searchParams.get('category')
  
  // 사용자 입력을 그대로 문자열에 삽입
  const apiUrl = `https://internal-api.com/users?name=${name}&publicProfile=true&category=${category}`
  
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return NextResponse.json(data)
}
```

### 2. POST 요청에서의 취약점

javascript

```javascript
// app/api/search/route.js
// ❌ 취약한 코드
export async function POST(request) {
  const body = await request.json()
  const { search, filters } = body
  
  const baseUrl = 'https://internal-api.com/search'
  const fullUrl = `${baseUrl}?q=${search}&includePrivate=false&filters=${filters}`
  
  const response = await fetch(fullUrl)
  return NextResponse.json(await response.json())
}
```

### 3. 동적 라우트에서의 취약점

javascript

```javascript
// app/api/users/[userId]/route.js
// ❌ 위험한 패턴
export async function GET(request, { params }) {
  const { userId } = params
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  // 직접 파라미터 삽입
  const url = `https://internal-api.com/users/${userId}?action=${action}&role=user`
  
  const response = await fetch(url)
  return NextResponse.json(await response.json())
}
```

### 4. PATCH 요청에서의 취약점

javascript

```javascript
// app/api/profile/route.js
// ❌ 취약한 코드
export async function PATCH(request) {
  const formData = await request.formData()
  const username = formData.get('username')
  const email = formData.get('email')
  
  // 위험한 URL 구성
  const url = `https://api.example.com/users?name=${username}&email=${email}&verified=false`
  
  const response = await fetch(url)
  return NextResponse.json(await response.json())
}
```

## 안전한 Route Handler 코드

### 1. URLSearchParams 사용 (권장)

javascript

```javascript
// app/api/users/route.js
// ✅ 안전한 코드
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const category = searchParams.get('category')
  
  // URLSearchParams로 안전하게 처리
  const params = new URLSearchParams()
  if (name) params.set('name', name)           // 자동 인코딩됨
  if (category) params.set('category', category) // 자동 인코딩됨
  params.set('publicProfile', 'true')
  
  const apiUrl = `https://internal-api.com/users?${params.toString()}`
  
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### 2. URL 객체 + searchParams

javascript

```javascript
// app/api/search/route.js
// ✅ 더 안전한 방법
export async function POST(request) {
  const body = await request.json()
  const { search, filters } = body
  
  const url = new URL('https://internal-api.com/search')
  url.searchParams.set('q', search)
  url.searchParams.set('includePrivate', 'false')
  url.searchParams.set('filters', filters)
  
  const response = await fetch(url.toString())
  const data = await response.json()
  
  return NextResponse.json(data)
}
```

### 3. 입력 검증 + 화이트리스트

javascript

```javascript
// app/api/users/[userId]/route.js
// ✅ 가장 보안성이 높은 방법
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { userId } = params
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  // 입력 검증
  if (!userId || !/^\d+$/.test(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }
  
  // 허용된 액션만 처리
  const allowedActions = ['view', 'edit', 'delete']
  if (action && !allowedActions.includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
  
  const url = new URL(`https://internal-api.com/users/${userId}`)
  if (action) url.searchParams.set('action', action)
  url.searchParams.set('role', 'user')
  
  try {
    const response = await fetch(url.toString())
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### 4. 복합 데이터 처리

javascript

```javascript
// app/api/profile/route.js
// ✅ 안전한 폼 데이터 처리
export async function PATCH(request) {
  try {
    const formData = await request.formData()
    const username = formData.get('username')
    const email = formData.get('email')
    
    // 엄격한 입력 검증
    if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    
    const url = new URL('https://api.example.com/users')
    url.searchParams.set('name', username)
    url.searchParams.set('email', email)
    url.searchParams.set('verified', 'false')
    
    const response = await fetch(url.toString(), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
```

### 5. 미들웨어에서의 URL 조작 보안

javascript

```javascript
// middleware.js
// ✅ 안전한 미들웨어
import { NextResponse } from 'next/server'

export function middleware(request) {
  const { searchParams, pathname } = request.nextUrl
  const redirectParam = searchParams.get('redirect')
  
  if (redirectParam) {
    // 입력 검증
    if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(redirectParam)) {
      return NextResponse.redirect(new URL('/error', request.url))
    }
    
    // 안전한 URL 구성
    const newUrl = new URL('/api/auth', request.url)
    newUrl.searchParams.set('target', redirectParam)
    newUrl.searchParams.set('verified', 'true')
    
    return NextResponse.rewrite(newUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/protected/:path*'
}
```

## Server Actions에서의 보안 (App Router 전용)

### 취약한 Server Action

javascript

```javascript
// app/actions.js
// ❌ 취약한 Server Action
'use server'

export async function updateUserAction(formData) {
  const username = formData.get('username')
  const role = formData.get('role')
  
  // 위험한 URL 구성
  const url = `https://api.example.com/users?name=${username}&role=${role}&active=true`
  
  const response = await fetch(url)
  return response.json()
}
```

### 안전한 Server Action

javascript

```javascript
// app/actions.js
// ✅ 안전한 Server Action
'use server'

import { redirect } from 'next/navigation'

export async function updateUserAction(formData) {
  const username = formData.get('username')
  const role = formData.get('role')
  
  // 입력 검증
  if (!username || typeof username !== 'string' || username.length > 50) {
    throw new Error('Invalid username')
  }
  
  const allowedRoles = ['user', 'moderator']
  if (!allowedRoles.includes(role)) {
    throw new Error('Invalid role')
  }
  
  // 안전한 URL 구성
  const url = new URL('https://api.example.com/users')
  url.searchParams.set('name', username)
  url.searchParams.set('role', role)
  url.searchParams.set('active', 'true')
  
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error('Update failed')
    }
    
    const data = await response.json()
    redirect('/success')
    
  } catch (error) {
    throw new Error('Server error occurred')
  }
}
```

## 핵심 변경사항 요약

**Route Handler 구조**: `export default function handler` → `export async function GET/POST/PATCH/DELETE`

**요청 객체**: `req.query` → `new URL(request.url).searchParams`

**응답 객체**: `res.json()` → `NextResponse.json()`

**동적 라우트**: `req.query.params` → `{ params }` 두 번째 인자

**에러 처리**: try-catch 블록으로 명시적 에러 처리

**Server Actions**: `'use server'` 지시어로 서버 사이드 함수 정의

이런 패턴들을 사용하면 Next.js 13+ App Router에서 파라미터 주입 공격을 효과적으로 방지할 수 있습니다.