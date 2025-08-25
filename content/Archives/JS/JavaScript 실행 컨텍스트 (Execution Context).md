---
title: "[JavaScript] 실행 컨텍스트 (Execution Context)"
source: "https://from-basic-to-end.tistory.com/5"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-20
created: 2025-05-07
description: "정의 실행 컨텍스트는 실행하려는 자바스크립트 코드와 코드를 실행할 때 필요한 정보를 담고있는 특수한 환경입니다. 즉 코드를 실행하는 데 필요한 모든 데이터를 가지고 있는 환경을 실행 컨텍스트라고 할 수 있습니다. 실행 컨텍스트는 전역 컨텍스트(Global Context), 함수 컨텍스트(Function Context)로 나눌 수 있습니다. 전역 컨텍스트는 자바스크립트 코드를 실행하게 되면 반드시 생성되는 컨텍스트로, 웹에서는 window 객체, NodeJS 환경에서는 global 객체를 생성합니다. 함수 컨텍스트는 함수 선언문이 실행될 때 마다 함수별로 실행되는 컨텍스트입니다. 이 컨텍스트에는 함수 실행에 대한 모든 정보를 갖고 있습니다. 자바스크립트의 컨텍스트는 콜 스택(Call Stack) / 실행 .."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/img.png)

### 정의

**실행 컨텍스트** 는 실행하려는 자바스크립트 코드와 코드를 실행할 때 필요한 정보를 담고있는 특수한 환경입니다. 즉 코드를 실행하는 데 필요한 모든 데이터를 가지고 있는 환경을 실행 컨텍스트라고 할 수 있습니다.

실행 컨텍스트는 **전역 컨텍스트(Global Context)**, **함수 컨텍스트(Function Context)** 로 나눌 수 있습니다.

전역 컨텍스트는 자바스크립트 코드를 실행하게 되면 반드시 생성되는 컨텍스트로, 웹에서는 **window** 객체, NodeJS 환경에서는  **global** 객체를 생성합니다. 함수 컨텍스트는 함수 선언문이 실행될 때 마다 함수별로 실행되는 컨텍스트입니다. 이 컨텍스트에는 함수 실행에 대한 모든 정보를 갖고 있습니다.

자바스크립트의 컨텍스트는 **콜 스택(Call Stack) / 실행 컨텍스트 스택(Execution Context Stack)** 이라고 하는 자바스크립트 엔진의 내부 자료구조에 실행 순서대로 가장 밑에 쌓이게 됩니다.

```javascript
function one() {
  console.log("run one");
  console.log("run one finished");
}

function two() {
  console.log("run two");
  one();
  console.log("run two finished");
}

function three() {
  console.log("run three");
  two();
  console.log("run three finished");
}

three();

// run three
// run two
// run one
// run one finished
// run two finished
// run three finished
```

위의 코드를 실행하면, 콜 스택의 최상단에 있는 실행 컨텍스트의 코드부터 순차적으로 실행됩니다. 그러다가 실행 컨텍스트 내부에서 새로운 실행 컨텍스트를 생성하면, 콜 스택의 최상단에 새로운 실행 컨텍스트가 쌓이게 됩니다.

![](https://from-basic-to-end.tistory.com/execution-context-stack.png)

### 생성 단계(Creation Phase) | 실행 단계(Execution Phase)

실행 컨텍스트는 **생성 단계** 와 **실행 단계** 로 나뉘어집니다.

실행 컨텍스트 생성 단계에서는 **전역 객체(global/window)** 와, **arguments** 객체가 생성됩니다. 이 때 **this** 키워드는 **window** 또는 **global** 객체에 바인딩되고, 변수와 함수는 실행 컨텍스트의 **Memory Heap** 에 배정되고 기본 값인 undefined로 저장됩니다.

실행 단계에서는 생성한 객체들로 코드를 실행합니다. 만약 새로운 실행 컨텍스트를 생성한다면 위 생성 단계와 실행 단계를 반복하게 됩니다.

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| --- | --- |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |
| [\[JavaScript\] 프로퍼티 어트리뷰트(Property Attribute)](https://from-basic-to-end.tistory.com/3) (1) | 2023.11.15 |
| [\[JavaScript\] 객체 리터럴(Object Literal)](https://from-basic-to-end.tistory.com/2) (0) | 2023.11.14 |

---