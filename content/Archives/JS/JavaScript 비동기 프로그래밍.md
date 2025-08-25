---
title: "[JavaScript] 비동기 프로그래밍"
source: "https://from-basic-to-end.tistory.com/9"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-26
created: 2025-05-07
description: "자바스크립트 엔진은 작성한 코드를 싱글 스레드, 즉 하나의 메인 스레드에서 순차적으로 실행합니다. 이는 개발자가 명시적으로 멀티스레딩 방식의 코드를 작성하지 않는다면, 코드는 싱글 스레드에서만 실행된다는 의미입니다. 그러나 자바스크립트에서는 비동기 프로그래밍을 지원하기 때문에 CPU 연산이 많이 필요한 작업이 아니라면, 복잡한 멀티 스레딩 방식으로 코드를 작성할 필요가 없습니다. 자바스크립트가 처음 등장했을 때는 콜백(callback) 방식의 비동기 프로그래밍만 지원했습니다. 콜백 함수 (callback function) 콜백 함수는 특정 함수가 끝나고 나서 실행되는 함수입니다. function longWork() { // 비동기로 실행하는 함수 setTimeout setTimeout(() => { co.."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/javascript.png)

자바스크립트 엔진은 작성한 코드를 **싱글 스레드**, 즉 **하나의 메인 스레드** 에서 순차적으로 실행합니다. 이는 개발자가 명시적으로 멀티스레딩 방식의 코드를 작성하지 않는다면, 코드는 싱글 스레드에서만 실행된다는 의미입니다.

그러나 **자바스크립트에서는 비동기 프로그래밍을 지원** 하기 때문에 CPU 연산이 많이 필요한 작업이 아니라면, 복잡한 멀티 스레딩 방식으로 코드를 작성할 필요가 없습니다. 자바스크립트가 처음 등장했을 때는 **콜백(callback)** 방식의 비동기 프로그래밍만 지원했습니다.

### 콜백 함수 (callback function)

콜백 함수는 특정 함수가 끝나고 나서 실행되는 함수입니다.

```javascript
function longWork() {
  // 비동기로 실행하는 함수 setTimeout
  setTimeout(() => {
    console.log("완료");
  }, 2000);
}

console.log('Hello');
longWork();
console.log('World');

/**
* Hello
* World
* (약 1초 뒤 실행) 완료 
*/
```

그러나 이런 콜백 함수들은 코드 가독성을 떨어뜨렸습니다. 콜백이 하나만 있다면 상관없을지도 모르겠지만, 여러 개의 콜백을 사용해야 한다면, 뎁스가 깊어져서 코드를 한눈에 파악하기 어려운 문제점이 있었습니다.

```javascript
function waitAndRun2() {
  setTimeout(() => {
    console.log("1번 콜백 끝");
    setTimeout(() => {
      console.log("2번 콜백 끝");
      setTimeout(() => {
        console.log("3번 콜백 끝");
      }, 2000);
    }, 2000);
  }, 2000);
}

/**
* (약 2초가 지난 후) 3번 콜백 끝
* (약 2초가 지난 후) 2번 콜백 끝
* (약 2초가 지난 후) 1번 콜백 끝
*/
```

이러한 문제점을 해결하기 위해 **ES6(ES2015)** 에서 **Promise** 가 등장했습니다.

### Promise

Promise는 콜백의 가독성 문제를 해결하기 위해, **메서드 체이닝 방식** 을 도입했습니다. **Promise** 는 **resolve**, **reject** 두 개의 파라미터를 사용할 수 있으며, 정상적으로 프로세스가 마무리되면(성공) resolve, 에러가 발생하면(실패) reject를 사용할 수 있습니다.

**Promise** 에 **then, catch** 를 체이닝하면 **then은 resolve** 의 결과를 받을 수 있고, **catch는 reject** 의 결과를 받을 수 있습니다. **finally** 는 Promise가 성공하든 실패하든 Promise가 종료되기 전에 반드시 실행되는 메서드입니다.

```javascript
const randomNum = Math.random();

const getPromise = (seconds) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomNum > 0.5) {
        resolve("성공");
      } else {
        reject("실패");
      }
    }, seconds * 1000);
  });

getPromise(1)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
  .finally(() => console.log("완료"));

// (약 1초가 지난 후) 성공 (또는 실패)
// 완료
```

### async / await

Promise로 비동기 프로그래밍 방식의 가독성은 개선되었지만, 코드가 복잡하고, 오류 처리가 직관적이지 않은 문제점이 존재하였습니다. 그러나 **ES8(ES2018)** 부터 등장한 **async / await** 는 비동기 프로그래밍 방식을 마치 동기 프로그래밍 처럼 작성할 수 있도록 문법을 제공하였습니다.

```javascript
const randomNum = Math.random();

const getPromise = (seconds) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (randomNum > 0.5) {
        resolve("성공");
      } else {
        reject("실패");
      }
    }, seconds * 1000);
  });

async function runner() {
  try {
    const result1 = await getPromise(1);
    console.log(result1);
  } catch (e) {
    console.error(e);
  } finally {
    console.log('--- finally ---');
  }
}

runner()
  .then((res) => res)
  .catch((res) => res)
  .finally((res) => res);

/**
* (약 1초 뒤 실행) 성공 (또는 실패)
* --- finally ---
*/
```

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클래스(Class)](https://from-basic-to-end.tistory.com/15) (1) | 2023.12.04 |
| --- | --- |
| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |

---