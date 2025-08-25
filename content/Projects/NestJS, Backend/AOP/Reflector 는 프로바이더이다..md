## Reflector가 Provider인 이유

### 1. Metadata 접근을 위한 핵심 서비스
```typescript
// Reflector는 데코레이터로 설정된 메타데이터를 읽어오는 역할
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // IoC Container에서 주입받음

  canActivate(context: ExecutionContext): boolean {
    // 메타데이터를 읽어와서 가드 로직 결정
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true; // 공개 엔드포인트면 통과
    
    // 인증 로직 실행
    return this.validateRequest(context);
  }
}
```
### 2. NestJS 내부에서 자동 등록
```typescript
// NestJS 내부에서 이미 등록되어 있음
@Module({
  providers: [
    Reflector, // 자동으로 등록됨
    // 다른 providers...
  ],
})
export class AppModule {}
```
## Reflector의 주요 기능

### 1. 데코레이터 메타데이터 읽기
```typescript
// 커스텀 데코레이터
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 컨트롤러에서 사용
@Controller('coffees')
export class CoffeesController {
  @Public() // 이 메타데이터를 Reflector가 읽음
  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }
}

// 가드에서 메타데이터 확인
canActivate(context: ExecutionContext): boolean {
  const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
  if (isPublic) return true; // Public 데코레이터가 있으면 통과
}
```
### 2. 다양한 메타데이터 접근
```typescript
// 핸들러(메서드) 레벨 메타데이터
const handlerMetadata = this.reflector.get('key', context.getHandler());

// 클래스 레벨 메타데이터
const classMetadata = this.reflector.get('key', context.getClass());

// 모든 메타데이터
const allMetadata = this.reflector.getAll('key', [
  context.getHandler(),
  context.getClass(),
]);
```


## 결론
Reflector가 Provider인 이유:
1. 메타데이터 접근의 중앙화: 모든 데코레이터 메타데이터를 일관되게 접근
2. 성능 최적화: 싱글톤으로 메타데이터 캐싱
3. 의존성 주입: 다른 서비스에서도 쉽게 사용 가능
4. 테스트 용이성: Mock 객체로 대체 가능
5. NestJS 아키텍처: IoC Container의 핵심 구성 요소