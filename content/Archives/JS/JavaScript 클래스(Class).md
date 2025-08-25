---
title: "[JavaScript] 클래스(Class)"
source: "https://from-basic-to-end.tistory.com/15"
author:
  - "[[기초부터 차곡차곡]]"
published: 2023-12-04
created: 2025-05-07
description: "정의 클래스는 객체지향 프로그래밍에서 특정 객체인 인스턴스를 생성하기 위해 변수(=프로퍼티)와 메서드를 정의하는 일종의 틀이라고 할 수 있습니다. 실제 데이터를 구현한 것을 객체라고 하고, 데이터를 구현하는 데 일반화된 정보들을 정리해 둔 것을 클래스라고 부릅니다. 이렇게 구성된 클래스를 객체로 만드는 과정을 인스턴스화(instantiating) 라고 합니다. ES6 이전의 자바스크립트에서는 객체지향 프로그래밍을 수행하기 위해 함수의 프로토타입을 사용하였습니다. 그러나 자바스크립트는 ES6부터 도입된 `class` 키워드를 사용하여 (완전히 동일하지는 않지만) C++, JAVA와 같은 전통적인 객체지향 프로그래밍 언어처럼 객체를 정의할 수 있게 되었습니다. 그러나 재미있는 점은 자바스크립트에서 class.."
tags:
  - "clippings"
---
Resource/JavaScript & TypeScript

![](https://from-basic-to-end.tistory.com/javascript.png)

## 정의

**클래스** 는 **객체지향 프로그래밍** 에서 특정 객체인 인스턴스를 생성하기 위해 변수(=프로퍼티)와 메서드를 정의하는 일종의 틀이라고 할 수 있습니다. 실제 데이터를 구현한 것을 객체라고 하고, 데이터를 구현하는 데 일반화된 정보들을 정리해 둔 것을 클래스라고 부릅니다. 이렇게 구성된 클래스를 객체로 만드는 과정을 **인스턴스화(instantiating)** 라고 합니다.

**ES6** 이전의 자바스크립트에서는 객체지향 프로그래밍을 수행하기 위해 함수의 프로토타입을 사용하였습니다. 그러나 자바스크립트는 **ES6** 부터 도입된 `class` 키워드를 사용하여 (완전히 동일하지는 않지만) C++, JAVA와 같은 전통적인 객체지향 프로그래밍 언어처럼 객체를 정의할 수 있게 되었습니다. 그러나 재미있는 점은 자바스크립트에서 **class** 는 **함수** 라는 점입니다. 이는 자바스크립트가 **class** 키워드를 지원은 하지만 결국 문법적인 지원이고, 자바스크립트 내부적으로는 **함수의 프로토타입을 활용한 객체지향 프로그래밍을 사용** 한다는 것임을 나타냅니다.

자바스크립트에서 객체를 만드는 방법에는 **3가지** 정도가 있습니다.

1\. **class** 키워드

2\. **생성자 함수**

3\. **객체 리터럴(object literal)**

자바스크립트에서 객체는 **0개 이상의 프로퍼티(property)** 로 이루어져 있습니다. 프로퍼티는 **key-value** 쌍으로 이루어지고, 함수인 프로퍼티를 **메서드** 라고 부릅니다. 아래 코드처럼 **class** 키워드를 사용하여 객체를 정의할 수 있습니다.

```javascript
class PersonModel {
  name;
  year;
  
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  
  sayName() {
    return \`안녕하세요 저는 ${this.name}입니다.\`;
  }
}

console.log(typeof PersonModel) // function
```

## 접근자 프로퍼티, get / set

인스턴스 프로퍼티에 접근하거나 값을 설정할 때 사용되는 프로퍼티입니다. 메서드처럼 함수를 실행하듯이 사용하면 안되고, 프로퍼티처럼 사용해야 합니다. 보통 접근자 프로퍼티는 프로퍼티의 이름과 같게 두는 경우가 많습니다.

자바스크립트는 보통 **Immutable** 프로그래밍에 많이 사용되어서 set 접근자 프로퍼티를 많이 사용하지는 않습니다.

```javascript
class PersonModel {
  name;
  year;
  
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  
  get name() {
    return \`${this.name}\`;
  }
  
  set name(name) {
    this.name = name;
  }
}

const changuk = new PersonModel('우창욱', 1998);
console.log(changuk.name); // 우창욱
changuk.name = '창욱';
console.log(changuk.name); // 창욱
```

또한 접근자 프로퍼티는 **프로퍼티를 은닉화** 하여 외부에서 값을 마음대로 변경할 수 없도록 하는 것에 그 목적이 있습니다. **ES2022** 부터 정식 스펙으로 등록된 자바스크립트의 **#** 키워드를 사용하면, 프로퍼티를 은닉화할 수 있습니다. 프라이빗 프로퍼티의 값을 변경하려면 반드시 **set 접근자 프로퍼티** 를 사용해야 합니다.

아래 코드를 보면, **PersonModel** 로 만든 인스턴스는 어떠한 프로퍼티도 가지고 있지 않은 것으로 나타나고 있습니다.

```javascript
class PersonModel {
  #name;
  #year;
  
  constructor(name, year) {
    this.#name = name;
    this.#year = year;
  }
  
  get name() {
    return this.#name;
  }
}

const changuk = new PersonModel('우창욱', 1998);
cossole.log(changuk); // PersonModel {}
console.log(changuk.name); // 우창욱

changuk.name = '창욱' // TypeError: Cannot set property name of #<PersonModel> which has only a getter
```

## static

**static** 키워드는 인스턴스에 존재하지 않고, **클래스 자체에 귀속** 됩니다. 인스턴스를 선언하지 않고 클래스로 사용할 수 있습니다.

```javascript
class PersonModel {
  name;
  year;
  static developPart = "프론트엔드";

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static returnDevelopPart() {
    return this.developPart;
  }
}

const changuk = new PersonModel("우창욱", 1998);
console.log(changuk); // PersonModel { name: '우창욱', year: 1998 }

console.log(PersonModel.developPart); // 프론트엔드
console.log(PersonModel.returnDevelopPart()); // 프론트엔드
```

**static** 키워드는 **factory constructor** 라는 개념에 많이 쓰입니다. 아래 코드처럼, 클래스의 static 메서드를 사용하여 인스턴스를 생성하는 것입니다.

```javascript
class PersonModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  static fromObject(object) {
    return new PersonModel(object.name, object.year);
  }

  static fromList(list) {
    return new PersonModel(list[0], list[1]);
  }
}

const changuk = PersonModel.fromObject({
  name: "우창욱",
  year: 1998,
});

const sunkyo = PersonModel.fromList(["장선교", 1993]);

console.log(changuk); // PersonModel { name: '우창욱', year: 1998 }
console.log(sunkyo); // PersonModel { name: '장선교', year: 1993 }
```

## 상속(Inheritance)

상속은 **객체들 간의 관계를 구축** 하는 방법입니다. 부모 클래스와 같은 기존 클래스로부터 프로퍼티와 메서드를 상속받을 수 있습니다.

```javascript
class PersonModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class FrontendPersonModel extends PersonModel {
  ui() {
    return "프론트엔드 개발자가 UI 작업을 합니다.";
  }
}

class BackendPersonModel extends PersonModel {
  server() {
    return "백엔드 개발자가 서버를 구축합니다.";
  }
}

const changuk = new FrontendPersonModel("우창욱", 1998);
console.log(changuk); // FrontendPersonModel { name: '우창욱', year: 1998 }

const hyunji = new BackendPersonModel("이현지", 1994); 
console.log(hyunji); // BackendPersonModel { name: '이현지', year: 1994 }

console.log(changuk.ui()); // 프론트엔드 개발자가 UI 작업을 합니다.
console.log(hyunji.server()); // 백엔드 개발자가 서버를 구축합니다.

// console.log(changuk.server()) -> X
// console.log(hyunji.ui()) -> X

console.log(changuk instanceof FrontendPersonModel); // true
console.log(changuk instanceof PersonModel); // true
console.log(changuk instanceof Object); // true

console.log(changuk instanceof BackendPersonModel); // false

console.log("-----------------------------");

console.log(hyunji instanceof FrontendPersonModel); // false
console.log(hyunji instanceof PersonModel); // true
console.log(hyunji instanceof Object); // true

console.log(hyunji instanceof BackendPersonModel); // true
```

## super와 override

**super** 키워드와, 메서드를 사용하여 **부모 클래스의 메서드와 생성자 함수** 를 사용할 수 있습니다. 그러나 **super** 키워드를 사용하여 부모 클래스의 프로퍼티에는 접근할 수 는 없습니다.

```javascript
class PersonModel {
  name;
  year;

  constructor(name, year) {
    this.name = name;
    this.year = year;
  }

  sayHello() {
    return \`안녕하세요 ${this.name}입니다.\`;
  }
}

class FrontendPersonModel extends PersonModel {
  skill;

  constructor(name, year, skill) {
    super(name, year);
    this.skill = skill;
  }

  sayHello() {
    // super.name처럼 프로퍼티를 불러오는 건 안되지만, 메서드는 실행할 수 있다.
    return \`${super.sayHello()} ${this.skill}를 할 수 있습니다.\`;
  }
}

const changuk = new FrontendPersonModel("우창욱", 1998, "리액트");
console.log(changuk); // FrontendPersonModel { name: '우창욱', year: 1998, skill: '리액트' }
console.log(changuk.sayHello()); // 안녕하세요 우창욱입니다. 리액트를 할 수 있습니다.

const sunkyo = new PersonModel("장선교", 1993);
console.log(sunkyo); // PersonModel { name: '장선교', year: 1993 }
console.log(sunkyo.sayHello()); // 안녕하세요 장선교입니다.
```

#### ' > ' 카테고리의 다른 글

| [\[JavaScript\] 비동기 프로그래밍](https://from-basic-to-end.tistory.com/9) (1) | 2023.11.26 |
| --- | --- |
| [\[JavaScript\] 클로저(Closure)](https://from-basic-to-end.tistory.com/7) (2) | 2023.11.23 |
| [\[JavaScript\] this](https://from-basic-to-end.tistory.com/6) (1) | 2023.11.23 |
| [\[JavaScript\] 실행 컨텍스트 (Execution Context)](https://from-basic-to-end.tistory.com/5) (1) | 2023.11.20 |
| [\[JavaScript\] 프로토타입 (Prototype)](https://from-basic-to-end.tistory.com/4) (0) | 2023.11.16 |

---