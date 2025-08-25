---
title: "[JavaScript] 프로토타입 (Prototype)"
source: "https://from-basic-to-end.tistory.com/4"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-16
created: 2025-05-07
description: "자바스크립트는 프로토타입 기반(prototype-based)으로 객체지향 프로그래밍(OOP, Object Oriented Programming)을 지원하는 프로그래밍 언어입니다. 자바스크립트는 객체지향 프로그래밍의 핵심 개념인 상속(Inheritance)을 프로토타입 기반으로 구현하며 코드 재사용을 줄입니다. const testObj = {}; console.log(testObj.__proto__); // [Object: null prototype]{} console.log(testObj.__proto__ === Object.prototype); // true __proto__와 prototype 자바스크립트에서는 객체의 프로토타입에 접근하기 위해 __proto__라는 접근자 프로퍼티를 사용해서 현재 객.."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/img.png)

자바스크립트는 **프로토타입 기반(prototype-based)** 으로 **객체지향 프로그래밍(OOP, Object Oriented Programming)** 을 지원하는 프로그래밍 언어입니다. 자바스크립트는 객체지향 프로그래밍의 핵심 개념인 **상속(Inheritance)** 을 프로토타입 기반으로 구현하며 코드 재사용을 줄입니다.

```javascript
const testObj = {};

console.log(testObj.__proto__); // [Object: null prototype]{}
console.log(testObj.__proto__ === Object.prototype); // true
```

### \_\_proto\_\_와 prototype

자바스크립트에서는 객체의 프로토타입에 접근하기 위해 **\_\_proto\_\_** 라는 접근자 프로퍼티를 사용해서 현재 객체의 프로토타입을 확인할 수 있습니다. **\_\_proto\_\_** 접근자 프로퍼티는 모든 객체에 존재하는 프로퍼티입니다.

```javascript
function PersonModel(name, year) {
  this.name = name;
  this.year = year;
}

console.log(PersonModel.prototype);

console.dir(PersonModel.prototype, {
  showHidden: true
}
//<ref *1> {
//  [constructor]: [Function: PersonModel] {
//    [length]: 2,
//    [name]: 'PersonModel',
//    [arguments]: null,
//    [caller]: null,
//    [prototype]: [Circular *1]
//  }
//}

const changuk = new PersonModel('우창욱', 1998);
```

생성자 함수를 사용하여 객체의 프로토타입을 확인해보면, IdolModel 프로토타입의 생성자 프로퍼티(constructor)는 IdolModel을 가리키는 것을 확인할 수 있습니다. 이를 **순환 참조(Circular Reference)** 라고 합니다.

**IdolModel** 객체를 new 키워드로 인스턴스화하여 생성된 **yuJin** 객체는 자동으로 생성된 **\_\_proto\_\_** 접근자 프로퍼티를 갖게 되고, **\_\_proto\_\_** 는 **IdolModel.prototype** 을 가리키게 됩니다.

![](https://from-basic-to-end.tistory.com/JavaScript-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85-2.drawio.png)

또한 **IdolModel.\_\_proto\_\_** 는 **Function.prototype** 을 가리키고, **Function.prototype.\_\_proto\_\_** 는 **Object.prototype** 을 가리킵니다. 결국 new 키워드로 생성된 yuJin 객체는 **Object** 까지 상속받게 됩니다. 이렇게 상속이 이어져 있는 것을 **프로토타입 체인(Prototype Chain)** 이라고 하고, 프로토타입 체인으로 도달할 수 있는 모든 객체의 최상위 객체는 **Object** 입니다.

![](https://from-basic-to-end.tistory.com/JavaScript-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85.png)

### 프로퍼티 섀도잉

```javascript
function PersonModel(name, year) {
  this.name = name;
  this.year = year;

  this.sayHello = function () {
    return '안녕하세요 저는 인스턴스 메서드입니다!';
  };
}

PersonModel.prototype.sayHello = function () {
  return '안녕하세요 저는 prototype 메서드입니다!';
};

const changuk = new PersonModel('우창욱', 1998);
console.log(changuk.sayHello()); // 안녕하세요 저는 인스턴스 메서드입니다!

delete changuk['sayHello'];

console.log(changuk.sayHello()); // 안녕하세요 저는 prototype 메서드입니다!
```

객체에서 정의한 메서드가 있는 경우, 프로토타입으로 정의한 메서드가 가려지게 되는데 이를 **프로퍼티 섀도잉** 이라고합니다. 객체에 정의한 메서드를 삭제하게 되면 프로토타입으로 정의한 메서드가 다시 나타나게 됩니다.

결국 프로토타입의 메서드를 덮어쓰는 게 아닌 인스턴스의 메서드를 추가하는 것이라고 할 수 있습니다.

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| --- | --- |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로퍼티 어트리뷰트(Property Attribute)](https://from-basic-to-end.tistory.com/3) (1) | 2023.11.15 |
| [\[JavaScript\] 객체 리터럴(Object Literal)](https://from-basic-to-end.tistory.com/2) (0) | 2023.11.14 |

---