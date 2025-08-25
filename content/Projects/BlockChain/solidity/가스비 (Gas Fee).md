
가스비는 이더리움 네트워크에서 거래나 컨트랙트 실행에 드는 수수료입니다.

### 실생활 비유로 이해하기

- **전기요금**: 컴퓨터를 오래 쓸수록 전기요금이 많이 나옴
- **택시비**: 거리가 멀수록, 복잡한 길일수록 요금이 비쌈
- **가스비**: 복잡한 계산일수록, 많은 데이터를 저장할수록 비쌈
### 가스비가 드는 이유

1. **네트워크 보안**: 스팸 공격 방지
2. **자원 할당**: 한정된 블록 공간의 공정한 분배
3. **채굴자 보상**: 거래를 처리해주는 채굴자들에게 수수료 지급
### 가스비 차이 예시

- **변수에 숫자 저장**: 20,000 gas = 약 $5-20 (이더 가격에 따라)
- **이벤트 발생**: 1,500 gas = 약 $0.5-2
- **복잡한 계산**: 100,000+ gas = 약 $25-100+

```mermaid
graph TD
    A[사용자가 함수 호출] --> B[트랜잭션 생성]
    B --> C[트랜잭션이 블록에 포함]
    C --> D[함수 실행 시작]
    D --> E[이벤트 발생 코드 실행]
    E --> F[이벤트 데이터가 로그에 기록]
    F --> G[블록이 네트워크에 확정]
    G --> H[외부 애플리케이션이 이벤트 감지]
    
    style A fill:#e1f5fe
    style E fill:#ffeb3b
    style F fill:#eeeeee
    style H fill:#ffffff
```

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Wallet as 지갑
    participant Network as 이더리움 네트워크
    participant Contract as 스마트 컨트랙트
    participant App as 웹 애플리케이션
    
    User->>Wallet: 좀비 생성 버튼 클릭
    Wallet->>Network: 트랜잭션 전송 (가스비 지불)
    
    Note over Network: 트랜잭션 대기 중... (15초-몇분)
    
    Network->>Contract: 함수 실행 시작
    Contract->>Contract: 좀비 생성 로직 실행
    Contract->>Contract: 이벤트 발생!
    
    Note over Contract: NewZombie("좀비이름", DNA, 소유자)
    
    Contract->>Network: 이벤트 데이터를 블록에 기록
    Network->>App: 새 이벤트 알림
    App->>User: "좀비가 생성되었습니다!" 표시
```
