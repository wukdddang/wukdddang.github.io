## 관점 지향 프로그래밍(AOP) 이란? 🤔

관점 지향 프로그래밍(Aspect-Oriented Programming, AOP)은 **핵심 비즈니스 로직과 부가적인 공통 기능을 분리하여 개발하는 프로그래밍 패러다임**입니다. 마치 여러 관점에서 사물을 보듯, 애플리케이션의 핵심 기능과 공통 기능을 나누어 각각을 모듈화하고 관리하는 방식이라고 할 수 있습니다.

예를 들어, 모든 메서드의 실행 시간을 측정하거나, 특정 기능에 접근할 때 로그를 남기는 작업은 여러 클래스와 메서드에 걸쳐 반복적으로 나타나는 '부가 기능'입니다. AOP는 이러한 부가 기능들을 'Aspect'라는 별도의 모듈로 분리하여, 핵심 비즈니스 로직의 코드 수정 없이 필요한 곳에 적용할 수 있도록 합니다. 이를 통해 **코드의 중복을 줄이고, 유지보수성과 재사용성을 높일 수 있습니다.**

---

## AOP의 핵심 개념 📝

AOP를 이해하기 위해서는 몇 가지 핵심 용어를 알아야 합니다.

- **Aspect (관점)**: 여러 객체에 공통으로 적용되는 기능(부가 기능)을 모듈화한 것입니다. 예를 들어 '로깅 Aspect', '트랜잭션 Aspect'와 같이 특정 부가 기능에 대한 코드를 담고 있습니다. Advice와 Pointcut을 함께 가지고 있습니다.
    
- **Advice**: Aspect가 실제로 수행하는 작업의 내용입니다. 즉, 부가 기능의 로직 자체를 의미합니다. Advice는 적용되는 시점에 따라 다음과 같이 나뉩니다.
    
    - **Before**: 대상 메서드 실행 전에 실행되는 Advice.
        
    - **After**: 대상 메서드 실행 후에 실행되는 Advice. (예외 발생 여부와 상관없이 실행)
        
    - **After-returning**: 대상 메서드가 정상적으로 실행되고 결과를 반환한 후에 실행되는 Advice.
        
    - **After-throwing**: 대상 메서드 실행 중 예외가 발생했을 때 실행되는 Advice.
        
    - **Around**: 대상 메서드 실행 전, 후, 그리고 예외 발생 시점 등 모든 시점에 개입하여 제어할 수 있는 가장 강력한 Advice.
        
- **Join Point (조인 포인트)**: Advice가 적용될 수 있는 애플리케이션 내의 모든 지점을 의미합니다. 예를 들어 메서드 호출, 필드 값 변경, 객체 생성 등이 Join Point가 될 수 있습니다. 스프링 AOP에서는 **메서드 실행 시점**만이 Join Point로 사용됩니다.
    
- **Pointcut (포인트컷)**: 수많은 Join Point 중에서 Advice를 실제로 적용할 대상을 선별하는 표현식입니다. 즉, '어떤 클래스의 어떤 메서드에 Advice를 적용할 것인가'를 정의하는 규칙입니다.
    
- **Target (타겟)**: Advice가 적용되는 대상 객체입니다. 핵심 비즈니스 로직을 담고 있는 클래스의 인스턴스입니다.
    
- **Weaving (위빙)**: Pointcut에 의해 결정된 Join Point에 Aspect의 Advice를 삽입하는 과정입니다. 위빙을 통해 핵심 로직 코드의 변경 없이 부가 기능이 추가된 새로운 프록시 객체가 생성됩니다.
    

---

## AOP의 장점 👍

AOP를 사용하면 다음과 같은 이점을 얻을 수 있습니다.

- **모듈성 향상**: 공통 기능(부가 기능)이 별도의 Aspect로 모듈화되어 코드의 재사용성이 높아집니다.
    
- **유지보수 용이성**: 공통 기능에 수정이 필요할 경우, 해당 Aspect만 수정하면 되므로 유지보수가 간편해집니다.
    
- **핵심 로직 집중**: 개발자는 핵심 비즈니스 로직에만 집중할 수 있어 생산성이 향상됩니다.
    
- **코드 가독성 증가**: 핵심 로직과 부가 기능 코드가 분리되어 전체적인 코드의 가독성이 좋아집니다.
    

---

## AOP 사용 예시 (스프링 프레임워크) ☕

스프링 프레임워크는 AOP를 강력하게 지원하며, 주로 **메서드 실행 시간 측정, 로깅, 트랜잭션 처리, 보안** 등에서 널리 사용됩니다.

예를 들어, 모든 컨트롤러의 메서드 실행 시간을 측정하고 싶다고 가정해 봅시다. AOP를 사용하면 다음과 같이 간단하게 구현할 수 있습니다.

1. **`@Aspect` 어노테이션을 사용하여 Aspect 클래스를 정의합니다.**
    
2. **`@Around` 어노테이션을 사용하여 Advice를 작성합니다.** 이 Advice는 메서드 실행 전 시간을 기록하고, 메서드 실행 후 시간을 기록하여 그 차이를 출력하는 로직을 포함합니다.
    
3. **`@Pointcut` 어노테이션을 사용하여 Advice를 적용할 대상을 지정합니다.** 예를 들어 `"execution(* com.example.controller..*.*(..))"`와 같은 표현식으로 'com.example.controller' 패키지 하위의 모든 메서드를 대상으로 지정할 수 있습니다.
    

이렇게 하면, 각 컨트롤러 메서드 코드를 일일이 수정하지 않고도 모든 메서드의 실행 시간을 자동으로 측정하고 로그로 남길 수 있습니다. 이는 AOP가 어떻게 코드의 중복을 제거하고 개발의 효율성을 높이는지를 보여주는 좋은 예시입니다.



네, NestJS의 인터셉터와 AOP의 관계에 대해 설명해 드리겠습니다.

결론부터 말하면, **NestJS의 인터셉터는 AOP(관점 지향 프로그래밍) 패러다임을 프레임워크 차원에서 구현한 핵심 기능**입니다. 즉, 인터셉터는 AOP를 NestJS 스타일로 사용하는 구체적인 도구라고 할 수 있습니다.

---

### 🤔 AOP와 NestJS 인터셉터의 관계

AOP의 핵심은 **'공통 관심사(cross-cutting concerns)'를 '핵심 비즈니스 로직'과 분리**하는 것입니다. 예를 들어, 여러 라우트 핸들러(컨트롤러 메서드)에서 공통으로 필요한 로깅, 캐싱, 데이터 변환 등의 작업을 별도의 모듈로 분리하여 코드 중복을 없애고 유지보수성을 높이는 것이죠.

NestJS는 바로 이 AOP 개념을 **인터셉터(Interceptor)**라는 기능으로 제공합니다.

- **인터셉터**는 특정 라우트 핸들러의 **실행 전후를 가로채서(intercept)** 추가적인 로직을 실행할 수 있게 해줍니다.
    
- 이를 통해 개발자는 컨트롤러의 핵심 로직을 건드리지 않고도 공통 기능을 손쉽게 추가하거나 제거할 수 있습니다.
    

---

### 🤝 AOP 개념과 NestJS 인터셉터 매핑

AOP의 주요 개념이 NestJS 인터셉터에서 어떻게 구현되는지 비교해 보면 둘의 관계를 명확하게 이해할 수 있습니다.

|AOP 개념|NestJS 인터셉터 구현|설명|
|---|---|---|
|**Aspect (관점)**|`NestInterceptor` 인터페이스를 구현한 **인터셉터 클래스** 자체|로깅, 캐싱 등 공통 기능 로직을 담고 있는 하나의 모듈입니다.|
|**Advice (조언)**|인터셉터 클래스 내의 **`intercept()` 메서드** 로직|`next.handle()` 호출 **전**은 **Before Advice**, `pipe()` 내부 로직은 **After Advice** 역할을 합니다. 즉, **Around Advice**에 해당합니다.|
|**Join Point (지점)**|**라우트 핸들러 메서드**의 실행|Advice(부가 기능)가 적용될 수 있는 애플리케이션 내의 특정 지점입니다.|
|**Pointcut (선별)**|**`@UseInterceptors()` 데코레이터**|수많은 Join Point 중에서 실제로 Advice를 적용할 대상을 지정하는 역할을 합니다.|
|**Weaving (연결)**|**NestJS 런타임**|NestJS가 런타임에 `@UseInterceptors()`로 지정된 메서드에 인터셉터 로직을 연결(적용)해주는 과정입니다.|

Sheets로 내보내기

<br>

**예시 코드:**

TypeScript

```
// logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 1. Aspect: 로깅이라는 관점을 가진 인터셉터 클래스
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  
  // 2. Advice: intercept 메서드 안에 구현된 부가 기능 로직
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...'); // 메서드 실행 전 로직

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)), // 메서드 실행 후 로직
      );
  }
}

// app.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Controller()
export class AppController {

  // 3. Pointcut: @UseInterceptors()로 부가 기능을 적용할 위치를 지정
  // 4. Join Point: getHello() 메서드
  @Get()
  @UseInterceptors(LoggingInterceptor)
  getHello(): string {
    // 핵심 비즈니스 로직
    return 'Hello World!';
  }
}
```

---

### 💡 핵심 요약

- **AOP는 프로그래밍 철학/패러다임**이고, **NestJS 인터셉터는 그 철학을 구현한 구체적인 기술**입니다.
    
- 인터셉터를 사용하면 **로깅, 캐싱, 응답 데이터 형식 변환, 에러 처리** 등 반복적인 코드를 컨트롤러 로직에서 완벽하게 분리할 수 있습니다.
    
- 이는 코드를 더 깔끔하고(clean), 재사용 가능하며, 유지보수하기 쉽게 만들어주는 AOP의 목적과 정확히 일치합니다.