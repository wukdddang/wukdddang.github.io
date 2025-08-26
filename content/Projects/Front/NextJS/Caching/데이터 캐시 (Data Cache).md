## [Data Cache](https://nextjs.org/docs/app/guides/caching#data-cache)

Next.js는 **서버 요청과 배포 간에 데이터 fetch 결과를 지속적으로 보존하는 내장 데이터 캐시**를 제공합니다. 이는 Next.js가 네이티브 fetch API를 확장하여 서버의 각 요청이 고유한 영구 캐싱 의미를 설정할 수 있도록 하기 때문에 가능합니다.

**중요**: 브라우저에서 fetch의 cache 옵션은 브라우저의 HTTP 캐시와 상호작용하는 방식을 나타내지만, Next.js에서는 서버 측 요청이 서버의 데이터 캐시와 상호작용하는 방식을 나타냅니다.

## 캐시 설정

`fetch`의 `cache`와 `next.revalidate` 옵션을 사용하여 캐싱 동작을 구성할 수 있습니다.

**개발 모드**: fetch 데이터는 Hot Module Replacement(HMR)를 위해 재사용되며, 하드 리프레시에서는 캐싱 옵션이 무시됩니다.