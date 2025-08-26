## [Request Memoization](https://nextjs.org/docs/app/guides/caching#request-memoization)

Next.js는 `fetch` API를 확장하여 **동일한 URL과 옵션을 가진 요청을 자동으로 메모이제이션**합니다. 이를 통해 React 컴포넌트 트리의 여러 곳에서 같은 데이터에 대한 fetch 함수를 호출해도 실제로는 한 번만 실행됩니다.

## 주요 특징

**동일 데이터 중복 요청 방지**: 라우트 전반에서 같은 데이터가 필요한 경우(Layout, Page, 여러 컴포넌트에서), 트리 최상단에서 데이터를 가져와 props로 전달할 필요가 없습니다. 각 컴포넌트에서 필요할 때 직접 데이터를 가져와도 네트워크 성능상 문제가 없습니다.


![[scrap-images/184fb5d7339c0764366a609d2c0603ea_MD5.png]]

![[scrap-images/88bb4bbdc910015dd9e099200040241b_MD5.png]]

## 동작 방식

```typescript
async function getItem() {
  // fetch 함수가 자동으로 메모이제이션되고 결과가 캐시됨
  const res = await fetch('https://.../item/1')
  return res.json()
}

// 이 함수가 두 번 호출되지만 첫 번째만 실제 실행됨
const item = await getItem() // cache MISS
const item = await getItem() // cache HIT
```

**렌더링 과정에서의 캐싱**:

- 라우트 렌더링 중 특정 요청이 처음 호출되면 메모리에 결과가 없어 cache `MISS`가 발생
- 함수가 실행되어 외부 소스에서 데이터를 가져와 메모리에 저장
- 같은 렌더링 과정에서 동일한 요청의 후속 호출은 cache `HIT`가 되어 함수 실행 없이 메모리에서 데이터 반환
- 라우트 렌더링이 완료되면 메모리가 "리셋"되어 모든 요청 메모이제이션 항목이 삭제됨
## 중요 사항

**React 기능**: 이는 Next.js가 아닌 React의 기능입니다.

**적용 범위**:

- `GET` 메서드의 `fetch` 요청에만 적용
- React 컴포넌트 트리 내에서만 작동
- `generateMetadata`, `generateStaticParams`, Layout, Page 및 기타 서버 컴포넌트의 `fetch` 요청에 적용
- Route Handler의 `fetch` 요청에는 적용되지 않음 (React 컴포넌트 트리에 속하지 않기 때문)

**대안**: `fetch`가 적합하지 않은 경우(데이터베이스 클라이언트, CMS 클라이언트, GraphQL 클라이언트 등)에는 React `cache` 함수를 사용하여 함수를 메모이제이션할 수 있습니다.

## 지속 시간

캐시는 **React 컴포넌트 트리 렌더링이 완료될 때까지 서버 요청의 생존 기간 동안 지속**됩니다.

## 재검증

메모이제이션은 서버 요청 간에 공유되지 않고 **렌더링 중에만 적용**되므로 재검증할 필요가 없습니다.

## 비활성화

메모이제이션은 **`GET`** 메서드에만 적용되며, `POST`나 `DELETE` 같은 다른 메서드는 메모이제이션되지 않습니다. 이는 React 최적화이므로 비활성화하지 않는 것을 권장합니다.

개별 요청을 관리하려면 `AbortController`의 `signal` 속성을 사용할 수 있습니다:

```javascript
const { signal } = new AbortController()
fetch(url, { signal })
```