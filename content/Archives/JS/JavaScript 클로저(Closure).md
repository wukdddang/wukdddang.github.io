---
title: "[JavaScript] 클로저(Closure)"
source: "https://from-basic-to-end.tistory.com/7"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-23
created: 2025-05-07
description: "자바스크립트에서 클로저는 어떤 함수와, 그 함수가 선언된 렉시컬 환경의 조합입니다. 다만 이렇게 말하면 조금 추상적이라 이해하기가 쉽지 않습니다. 좀 더 말을 정리해본다면, 클로저란 상위 함수보다 하위 함수가 더 오래 살아있는 경우를 의미한다고 할 수 있습니다. 클로저의 개념 function getNumber() { const number = 5; function innerGetNumber() { return number; } return innerGetNumber; } const runner = getNumber(); console.log(runner()); // 5 위 코드를 보면, innerGetNumber 함수는 상위 실행 컨텍스트를 참조할 수 있기 때문에 number 변수를 발견할 수 있습니다..."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/javascript.png)

자바스크립트에서 **클로저** 는 어떤 함수와, 그 함수가 선언된 렉시컬 환경의 조합입니다. 다만 이렇게 말하면 조금 추상적이라 이해하기가 쉽지 않습니다. 좀 더 말을 정리해본다면, 클로저란 **상위 함수보다 하위 함수가 더 오래 살아있는 경우** 를 의미한다고 할 수 있습니다.

### 클로저의 개념

```javascript
function getNumber() {
  const number = 5;
  
  function innerGetNumber() {
    return number;
  }
  
  return innerGetNumber; 
}

const runner = getNumber();

console.log(runner()); // 5
```

위 코드를 보면, innerGetNumber 함수는 상위 실행 컨텍스트를 참조할 수 있기 때문에 **number** 변수를 발견할 수 있습니다. 그런데 **getNumber** 함수가 반환한 것이 중요합니다. **innerGetNumber 함수 자체를 반환** 했습니다. 이렇게 작성하게 되면, 새로운 변수에 함수의 리턴값을 저장하게 되면 innerGetNumber 함수를 참조하게 되고, 새로운 변수를 실행하게 되면 이는 innerGetNumber 함수를 실행하게 됩니다.

새로운 변수 runner에 값을 할당할 때 **getNumber** 함수를 실행했고, 실행이 종료되면 **getNumber** 함수는 자바스크립트 콜 스택에 존재하지 않습니다. 그러나 innerGetNumber 함수를 참조하고 있는 runner 변수를 실행하면, innerGetNumber 함수는 상위 실행 컨텍스트를 여전히 참조할 수 있기 때문에 number 변수를 발견할 수 있고 console.log(runner())를 했을 때 5가 출력이 됩니다.

**즉, "상위함수보다 하위함수가 더 오래 살아남았다"고 결론내릴 수 있습니다. 이를 클로저라고 합니다.**

### 클로저의 활용

클로저는 콜 스택에서 사라진 값을 다시 사용할 수 있다는 장점 때문에, 여러 활용 예시들이 있습니다. 여기서는 크게 2가지를 정리해보겠습니다.

**1\. 데이터를 캐싱할 때**

```javascript
const crypto = require('crypto');

function cacheFunction() {
  // 계산이 오래 걸리는 부분
  var hash = crypto.createHash('sha256').update('some big data').digest('hex'); // 2b02e703a65bfb9b5951b657ca82948a9885819fdb2cc9aa2ce2f4bb6b75fddc

  function innerCacheFunction(newNumb) {
    var partialHash = parseInt(hash.substring(0, 5), 16);
    return partialHash * newNumb;
  }

  return innerCacheFunction;
}

const runner = cacheFunction();
console.log(runner(10)); // 1761740
console.log(runner(300)); // 52852200
```

만약 특정 값을 한번만 계산하고 캐시하는 기능을 직접 구현하고자 한다면, 클로저를 활용할 수 있습니다. 해시값을 한번만 계산하고, **innerCacheFunction** 을 가리키는 변수를 실행하면 해시값을 참조할 수 있습니다.

**2\. 값을 변경해야할 때 / 정보를 은닉할 때**

```javascript
function cacheFunction() {
  let number = 99;

  function increment() {
    number++;
    return number;
  }

  function decrement() {
    number--;
    return number;
  }

  return [increment, decrement];
}

const [increment, decrement] = cacheFunction();

console.log(increment()); // 100
console.log(decrement()); // 101
console.log(decrement()); // 101
console.log(increment()); // 101
```

**increment** 함수를 가리키는 변수를 실행하면, increment 함수가 참조할 수 있는 number 변수의 값을 증가시킬 수 있습니다. 또 **decrement** 함수를 가리키는 변수를 실행하면 decrement 함수가 참조할 수 있는 number 변수의 값을 감소시킬 수 있습니다.

그렇지만, number 변수를 직접 수정하거나 삭제할 수 없습니다. 이를 **정보 은닉** 이라고 할 수 있습니다.

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클래스(Class)](https://from-basic-to-end.tistory.com/15) (1) | 2023.12.04 |
| --- | --- |
| [\[JavaScript\] 비동기 프로그래밍](https://from-basic-to-end.tistory.com/9) (1) | 2023.11.26 |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |

---