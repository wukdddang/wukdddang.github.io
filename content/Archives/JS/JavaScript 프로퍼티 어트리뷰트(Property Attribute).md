---
title: "[JavaScript] 프로퍼티 어트리뷰트(Property Attribute)"
source: "https://from-basic-to-end.tistory.com/3"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-15
created: 2025-05-07
description: "프로퍼티 어트리뷰트 자바스크립트에서 객체를 생성할 때, 객체에서 특별하게 사용되는 내부 속성값들이 있습니다. 이를 프로퍼티 어트리뷰트(Property Attribute)라고 합니다. 자바스크립트 프로퍼티 어트리뷰트들은 크게 4가지의 종류로 나뉘어집니다. 1. value 2. writable 3. enumerable 4. configurable 이 값들은, 자바스크립트에서 객체를 생성할 때 자동으로 기본값으로 정의합니다. Object의 static 메서드인 getOwnPropertyDescriptor를 사용해서 프로퍼티 어트리뷰트들을 확인할 수 있습니다. 이때, Object.getOwnPropertyDescriptor 메서드는 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터(Property Desc.."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/js.png)

### 프로퍼티 어트리뷰트

자바스크립트에서 객체를 생성할 때, 객체에서 특별하게 사용되는 내부 속성값들이 있습니다. 이를 **프로퍼티 어트리뷰트(Property Attribute)** 라고 합니다. 자바스크립트 프로퍼티 어트리뷰트들은 크게 **4가지** 의 종류로 나뉘어집니다.

**1\. value**

**2\. writable**

**3\. enumerable**

**4\. configurable**

이 값들은, 자바스크립트에서 객체를 생성할 때 자동으로 기본값으로 정의합니다. **Object** 의 **static 메서드** 인 **getOwnPropertyDescriptor** 를 사용해서 프로퍼티 어트리뷰트들을 확인할 수 있습니다.

이때,**Object.getOwnPropertyDescriptor** 메서드는 프로퍼티 어트리뷰트 정보를 제공하는 **프로퍼티 디스크립터(Property Descriptor)객체** 를 반환합니다.

```javascript
const user = {
  name: 'changuk',
  age: 26
}

console.log(user.getOwnPropertyDescriptor(user, 'name'))
//{
//  value: 'changuk',
//  writable: true,
//  enumerable: true,
//  configurable: true
//}
```

또한, **ES8** 에 도입된 **Object.getOwnPropertyDescriptors** 메서드는 객체 프로퍼티들의 프로퍼티 어트리뷰트 정보를 모두 제공하는 프로퍼티 디스크립터 객체들을 반환합니다.

```javascript
const user = {
  name: 'changuk',
  age: 26
}

console.log(Object.getOwnPropertyDescriptors(user))
//{
//  name: {
//    value: 'changuk',
//    writable: true,
//    enumerable: true,
//    configurable: true
//  },
//  age: {
//    value: 26,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
//}
```

### 데이터/접근자 프로퍼티

자바스크립트 객체의 프로퍼티들은 **데이터 프로퍼티**, **접근자 프로퍼티** 의, **2가지** 종류로 나눌 수 있습니다.

**데이터 프로퍼티** 는 키, 값으로 이루어진 일반적인 프로퍼티입니다. **접근자 프로퍼티** 는 자체적인 값을 가지지 않으며 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 **get, set** 키워드를 사용하는 **접근자 함수(accessor function)** 로 구성된 프로퍼티입니다.

접근자 함수는 보통 **getter/setter** 라고 부릅니다.

데이터 프로퍼티들은 **value**, **writable**, **enumerable**, **configurable**,

접근자 프로퍼티들은 **get**, **set**, **enumerable**, **configurable** 과 같은 프로퍼티 어트리뷰트를 갖고 있습니다.

```javascript
const user = {
  name: 'changuk',
  age: 26,
  
  get hello() {
    return \`${this.name}is perfect!\`
  },
  
  set hello(name) {
    this.name = name;
  }
}

console.log(Object.getOwnPropertyDescriptor(user, 'name'))
//{
//  value: 'changuk',
//  writable: true,
//  enumerable: true,
//  configurable: true
//}

console.log(Object.getOwnPropertyDescriptor(user, 'hello'))
//{
//  get: ƒ get hello(),
//  set: ƒ set hello(),
//  enumerable: true,
//  configurable: true
//}
```

### 프로퍼티 정의

프로퍼티 정의는, 자바스크립트 객체의 새로운 프로퍼티를 추가하면서 프로퍼티 어트리뷰트를 명시적으로 정의하거나, 기존 프로퍼티의 프로퍼티 어트리뷰트를 재정의하는 것을 말합니다.

프로퍼티 값을 갱신 가능하도록(**writable**)할 지, 프로퍼티를 열거 가능하도록(**enumerable**)할 지, 프로퍼티를 재정의 가능하도록(**configurable**)할 지를 정의할 수 있습니다.

```javascript
const wukdddang = {}

Object.defineProperty(wukdddang, 'firstName', {
  value: 'changuk',
  writable: true,
  enumerable: true,
  configurable: false
})

Object.defineProperty(wukdddang, 'lastName', {
  value: 'woo',
  writable: true,
  enumerable: false,
  configurable: true
})

console.log(Object.getOwnPropertyDescriptor(wukdddang, 'firstName'))

//{
//  value: 'changuk',
//  writable: true,
//  enumerable: true,
//  configurable: false
//}

Object.defineProperty(wukdddang, 'firstName', { enumerable: false })
// TypeError: Cannot redefine property: firstName

console.log(Object.keys(wukdddang), Object.values(wukdddang))
//['firstName'] ['changuk']
```

### 객체 변경 방지

일반적으로 자바스크립트 객체의 프로퍼티들은 변경 가능한 값이기 때문에 재할당 없이 직접 변경이 가능합니다.

자바스크립트에서는 객체의 **불변성(Immutable)** 을 보장하기 위해 여러 메서드들을 제공합니다.

**1\. Object.preventExtensions**

**2\. Object.seal**

**3\. Object.freeze**

**Object.preventExtensions** 메서드는 객체의 확장을 금지합니다. 객체 확장이란 프로퍼티의 추가를 금지합니다. 다만 프로퍼티를 제거하는 것을 포함한 프로퍼티 어트리뷰트 재정의, 프로퍼티 값 갱신 등 다른 기능들을 막지는 않습니다.

**Object.seal** 메서드는 객체를 밀봉한다고 할 수 있습니다. 프로퍼티 추가, 삭제, 그리고 프로퍼티 어트리뷰트의 재정의를 금지합니다.

**Object.freeze** 메서드는 객체를 동결합니다. 프로퍼티 추가, 삭제, 프로퍼티 어트리뷰트의 재정의 금지, 그리고 프로퍼티 값의 갱신을 금지합니다. 그러나 객체 내부에 객체가 있는경우, 내부 객체도 동결하지는 않습니다.

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| --- | --- |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |
| [\[JavaScript\] 객체 리터럴(Object Literal)](https://from-basic-to-end.tistory.com/2) (0) | 2023.11.14 |

---