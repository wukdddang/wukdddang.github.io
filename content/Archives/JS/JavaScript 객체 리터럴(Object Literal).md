---
title: "[JavaScript] 객체 리터럴(Object Literal)"
source: "https://from-basic-to-end.tistory.com/2"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-11-14
created: 2025-05-07
description: "객체 리터럴의 정의 자바스크립트에서 객체(Object)란 키-값 쌍으로 이루어진 데이터를 의미합니다. 원시(Primitive) 데이터 타입인 string, number, symbol, undefined, null, boolean 총 6개를 제외하고 자바스크립트의 데이터 타입들은 모두 객체 타입입니다. 이 객체 타입을 생성하는 방법 중의 하나로 객체 리터럴이 있습니다. 객체 리터럴은 중괄호({...})안에 0개 이상의 프로퍼티를 정의하는 객체 생성 표기법을 의미합니다. 객체 리터럴을 사용하면 아래 코드처럼 일반적이고 간단한 방법으로 객체를 생성할 수 있습니다. 프로퍼티의 값이 함수인 경우 메서드라고 부릅니다. const user = { name: 'Woo', getName: function() { cons.."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/js.png)

### 객체 리터럴의 정의

자바스크립트에서 객체(Object)란 키-값 쌍으로 이루어진 데이터를 의미합니다.

원시(Primitive) 데이터 타입인 **string, number, symbol, undefined, null, boolean** 총 6개를 제외하고 자바스크립트의 데이터 타입들은 모두 객체 타입입니다. 이 객체 타입을 생성하는 방법 중의 하나로 **객체 리터럴** 이 있습니다.

객체 리터럴은 중괄호({...})안에 0개 이상의 프로퍼티를 정의하는 **객체 생성 표기법** 을 의미합니다. 객체 리터럴을 사용하면 아래 코드처럼 일반적이고 간단한 방법으로 객체를 생성할 수 있습니다.

프로퍼티의 값이 함수인 경우 **메서드** 라고 부릅니다.

```javascript
const user = {
  name: 'Woo',
  getName: function() {
    console.log(\`Hello, ${this.name}!\`)
  }
}

console.log(typeof user) // object
console.log(user.getName()) // Hello, Woo!
```

### 프로퍼티

프로퍼티 키에는 **string**, **number**, **symbol** 총 3가지의 타입이 들어갈 수 있고, 프로퍼티 값에는 자바스크립트에서 사용 가능한 모든 값들을 부여할 수 있습니다.

  
만약 프로퍼티 키의 타입이 **number** 라면 내부적으로 문자열로 변환됩니다.

자바스크립트 객체의 프로퍼티에 접근하는 방법으로는

"마침표 프로퍼티 접근 연산자(.)"를 사용하는 **마침표 표기법(dot notation)** 과

"대괄호 프로퍼티 접근 연산자(\[...\])"를 사용하는 **대괄호 표기법(bracket notation)** 이 있습니다.

```javascript
const user = {
  name: 'Changuk'
};

console.log(user.name); // 'Changuk'

console.log(user[name]); // undefined
console.log(user['name']); // 'Changuk'

user.name = 'wukdddang'

console.log(user) // {name: 'wukdddang'}
```

이미 존재하는 프로퍼티에 접근해서 값을 재할당하면 프로퍼티에 값이 **갱신됩니다**.

### 프로퍼티의 생성과 삭제

```javascript
const user = {
  name: 'changuk'
}

user.name = 'wukdddang'
console.log(user); // {name: 'wukdddang'}

user.age = 26;
console.log(user) // {name: 'wukdddang', age: 26}

delete user.name;
console.log(user) // {age: 26}
```

존재하지 않는 프로퍼티에 접근해서 값을 할당하면, 프로퍼티는 동적으로 생성됩니다.

또한 **delete** 연산자를 사용하면 프로퍼티를 삭제할 수 있습니다.

### 객체의 키와 값들을 가져오기

```javascript
const changuk = {
  name: '우창욱',
  age: 26
}

console.log(Object.keys(changuk)) // ['name', 'age']
console.log(Object.values(changuk)) // ['우창욱', 26]
```

**Object** 의 **static 메서드** 인 **keys** 와 **values** 를 사용하면 객체 프로퍼티의 모든 열거 가능한(enumerable) 키와 값들의 배열을 가져올 수 있습니다.

### ES6로 인한 확장 기능

1\. 프로퍼티의 축약 표현

```javascript
const x = 100, y = 200

const obj = {
  x,
  y,
}

console.log(obj) // {x: 100, y: 200}
```

  
**ES6** 에서는 프로퍼티 값으로 변수를 사용하는 경우, 프로퍼티 키와 그 변수가 동일한 이름이라면 프로퍼티 키를 생략할 수 있습니다. (property shorthand)

2\. 프로퍼티 키의 계산

```javascript
const prefix = 'Tesla'
let i = 0;

const obj = {
  [\`${prefix}-${++i}\`]: i,
  [\`${prefix}-${++i}\`]: i,
  [\`${prefix}-${++i}\`]: i,
};

console.log(obj); // {Tesla-1: 1, Tesla-2: 2, Tesla-3: 3}
```

**ES6** 에서는 대괄호 표기법과 템플릿 리터럴을 사용해서 객체 내부에서도 계산된 프로퍼티 키를 동적으로 생성할 수 있습니다. (Computed Propertpy Names)

3\. 메서드의 축약 표현

```javascript
const obj = {
  name: 'changuk',
  sayHi() {
    console.log('Hi, ' + this.name + '!');
  }
}

obj.sayHi(); // Hi, changuk!
```

**ES6** 에서는 메서드를 정의할 때 function 키워드를 생략한 축약 표현을 사용할 수 있습니다. (Method Definitions, Concise Method Syntax)

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| --- | --- |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |
| [\[JavaScript\] 프로퍼티 어트리뷰트(Property Attribute)](https://from-basic-to-end.tistory.com/3) (1) | 2023.11.15 |

---