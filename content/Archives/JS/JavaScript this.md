---
title: "[JavaScript] this"
source: "https://from-basic-to-end.tistory.com/6"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-23
created: 2025-05-07
description: "자바스크립트는 렉시컬 스코프를 사용하기 때문에, 함수의 상위 스코프는 함수가 정의되는 시점에 평가됩니다. 하지만 this 키워드는 객체가 생성되는 시점에 결정됩니다. this가 동작하는 방식 const testFunction = function() { return this; } console.log(testFunction()) // this 객체는 window, global을 가리킨다. 위 testFunction의 this는 함수(=객체) 생성 시점에 결정되게 되는데, testFunction은 일반 함수로서 호출되었기 때문에 이때 testFunction의 this는 전역 객체인 window 또는 global을 가리키게 됩니다. const changuk = { name: '우창욱', year: 1998, .."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/javascript.png)

자바스크립트는 **렉시컬 스코프** 를 사용하기 때문에, 함수의 상위 스코프는 **함수가 정의되는 시점에 평가** 됩니다. 하지만

**this 키워드는 객체가 생성되는 시점에 결정됩니다.**

### this가 동작하는 방식

```javascript
const testFunction = function() {
  return this;
}

console.log(testFunction()) // this 객체는 window, global을 가리킨다.
```

위 **testFunction** 의 this는 함수(=객체) 생성 시점에 결정되게 되는데, testFunction은 **일반 함수** 로서 호출되었기 때문에 이때 testFunction의 this는 **전역 객체** 인 window 또는 global을 가리키게 됩니다.

```javascript
const changuk = {
  name: '우창욱',
  year: 1998,
  sayHello() {
    return \`안녕하세요 저는 ${this.name}입니다.\`;
  }
}

console.log(changuk.sayHello()); // 안녕하세요 저는 우창욱입니다.
```

위 코드에서 **sayHello** 메서드는 **changuk** 객체 리터럴의 메서드로 호출되었습니다. 따라서 sayHello의 this는 changuk 객체를 가리키게 됩니다.

```javascript
function Person(name, year) {
  this.name = name;
  this.year = year;
  
  this.sayHello = function () {
    return \`안녕하세요 저는 ${this.name}입니다.\`
  }
}

const changuk = new Person('우창욱', 1998);
console.log(changuk.sayHello());
```

자바스크립트에서 객체를 생성하는 방법 중 하나인 생성자 함수를 사용해서 만든 인스턴스 **changuk** 이 있습니다. sayHello 메서드는 changuk의 메서드로 호출되었기 때문에 이 메서드의 this는 인스턴스 **changuk** 을 가리키게 됩니다.

```javascript
Person.prototype.dance = function () {
  return \`${this.name}이 춤을 춥니다.\`;
};

console.log(changuk.dance()); // 우창욱이 춤을 춥니다.
```

프로토타입에 새로운 함수를 정의하고 인스턴스 **changuk** 에서 프로토타입 함수를 호출 해도, this는 dance 함수(=객체) 생성 시점에 결정되기 때문에 this는 인스턴스 changuk을 가리킵니다.

```javascript
Person.prototype.dance = function () {
  function dance2() {
    return \`${this.name}이 춤을 춥니다.\`;
  }
  
  return dance2(); 
}

console.log(changuk.dance()); // undefined이 춤을 춥니다.
```

위 코드는 프로토타입에 새로운 함수를 선언하고 내부에 새로운 함수를 또 선언하고 내부 함수의 리턴값을 리턴합니다. 이 경우 내부 함수인 **dance2** 는 객체(=함수) 생성 시점에 바인딩 된 객체가 없기 때문에 **전역 객체(=컨텍스트)인 global, 또는 window에 매핑** 이 되고, 해당 객체에는 name이라는 프로퍼티가 없기 때문에 undefined가 출력되게 됩니다.

### this가 가리키는 값

this 키워드가 가리키는 값은 **3가지로 정리** 할 수 있습니다.

1\. 일반 함수(function)로 호출할 땐 **this** 가 **최상위 객체 (global, window)** 를 가리키게 됩니다.

2\. 객체의 메서드로 호출 (= 마침표 연산자) 될 땐, **호출된 객체** 를 가리킵니다.

3\. 생성자 함수로 인스턴스를 생성하면 **생성된 인스턴스** 를 가리킵니다.

### this를 원하는 객체로 매핑하기

this를 원하는 객체로 매핑하는 메서드는 3가지가 있습니다.

1\. call()

2\. apply()

3\. bind()

```javascript
function returnName() {
  return this.name;
}

console.log(returnName); // undefined

const changuk = {
  name: '우창욱'
}

console.log(returnName.call(changuk)) // 우창욱
console.log(returnName.apply(changuk)) // 우창욱
```

call 메서드와 apply 메서드 둘 다 객체를 바인딩 하는 방법은 동일하지만, arguments를 전달하는 방법이 조금 다릅니다. 먼저 call 메서드는 **comma** 를 기반으로 arguments를 순서대로 넘겨줍니다. 그리고 apply 메서드는 배열을 넘겨줍니다.

```javascript
function multiply(x, y, z) {
  return \`${this.name} / 결과값: ${x * y * z}\`;
}

console.log(multiply.call(changuk, 3, 4,5)); // 우창욱 / 결과값: 60
console.log(multiply.apply(changuk, [3, 4, 5])); // 우창욱 / 결과값: 60

const boundFunction = multiply.bind(changuk);

console.log(boundFunction(3, 4, 5)); // 우창욱 / 결과값: 60
```

bind 메서드는 call, apply 메서드와는 조금 다릅니다. bind 메서드는 함수를 반환해줍니다. 즉, bind 메서드는 나중에 다시 호출할 수 있는 비동기적인 동작을 가능하게 해주는 메서드입니다.

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 비동기 프로그래밍](https://from-basic-to-end.tistory.com/9) (1) | 2023.11.26 |
| --- | --- |
| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |
| [\[JavaScript\] 프로퍼티 어트리뷰트(Property Attribute)](https://from-basic-to-end.tistory.com/3) (1) | 2023.11.15 |

---