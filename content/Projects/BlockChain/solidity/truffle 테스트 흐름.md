좋은 질문입니다! 테스트 실행 시 컨트랙트가 매번 새롭게 배포되는 내부 매커니즘을 자세히 설명드리겠습니다.

## 테스트 실행 시 컨트랙트 배포 내부 매커니즘

### 1. Truffle 테스트 환경 설정

테스트 실행 시 Truffle이 하는 일:

### 1. Truffle 테스트 환경 설정

테스트 실행 시 Truffle이 하는 일:

```javascript
// truffle test 실행 시 내부적으로 일어나는 일들:
// 1. 테스트용 블록체인 네트워크 생성
const testNetwork = {
  host: "127.0.0.1",
  port: 7545,  // Ganache 포트
  network_id: "*"
};
// 2. Web3 인스턴스 생성
const web3 = new Web3(provider);
// 3. 계정 목록 가져오기
const accounts = await web3.eth.getAccounts();
// [owner, customer, ...] 형태로 계정들 할당
```




### 2. 컨트랙트 배포 내부 과정

Tether.new() 호출 시 일어나는 일:

```javascript
// 1. 컨트랙트 아티팩트 로드
const Tether = artifacts.require("Tether");
// → src/truffle_abis/Tether.json에서 ABI와 바이트코드 로드
// 2. 컨트랙트 인스턴스 생성
const tether = await Tether.new();
// 내부적으로:
// - 컨트랙트 생성자 호출
// - 블록체인에 트랜잭션 전송
// - 새로운 컨트랙트 주소 반환
```
### 3. 실제 블록체인 트랜잭션 과정
컨트랙트 배포 트랜잭션:

```javascript
// Tether.new() 내부 동작:
const deployTransaction = {
  from: accounts[0],        // 배포자 주소
  gas: 2000000,            // 가스 한도
  gasPrice: 20000000000,   // 가스 가격
  data: "0x6080604052..."  // 컴파일된 바이트코드
};
// 블록체인에 트랜잭션 전송
const receipt = await web3.eth.sendTransaction(deployTransaction);
// 새로 생성된 컨트랙트 주소
const contractAddress = receipt.contractAddress; // 예: 0x123...
```


### 4. 생성자 실행 과정

Tether.sol 생성자:

```solidity
constructor() public {
  balanceOf[msg.sender] = totalSupply; // 1백만 토큰 할당
}
```

실행 과정:
1. 바이트코드 실행 - 생성자 함수가 실행됨
2. 상태 변수 초기화 - balanceOf[msg.sender] = 1000000000000000000000000
3. 스토리지 업데이트 - 블록체인 상태에 저장
### 5. 매번 새로운 주소가 생성되는 이유

컨트랙트 주소 생성 알고리즘:
```javascript
// Ethereum 컨트랙트 주소 생성 공식:
// address = keccak256(rlp.encode([sender, nonce]))[12:]
// 예시:
// 첫 번째 배포: nonce = 0 → 주소: 0x123...
// 두 번째 배포: nonce = 1 → 주소: 0x456...
// 세 번째 배포: nonce = 2 → 주소: 0x789...
```

### 6. 테스트 격리 메커니즘

각 테스트 실행 시:

```javascript
contract("DecentralBank", ([owner, customer]) => {
  before(async () => {
    // 매번 새로운 블록체인 상태에서 시작
    // 이전 테스트의 상태는 완전히 무시됨
    tether = await Tether.new(); // 새로운 주소
    rwd = await RWD.new();       // 새로운 주소
    decentralBank = await DecentralBank.new(rwd.address, tether.address);
  });
});
```

### 7. 실제 실행 흐름

```bash
# truffle test 실행 시:
1. 테스트 환경 초기화
2. Ganache 연결 (또는 내장 테스트 네트워크)
3. 계정 목록 가져오기
4. 각 테스트 파일별로:
   - before 블록 실행
   - 컨트랙트 배포 (새로운 주소)
   - 테스트 실행
   - after 블록 실행 (정리)
5. 다음 테스트 파일로 이동
```

핵심: Truffle은 각 테스트 실행 시 완전히 새로운 블록체인 상태를 생성하고, 컨트랙트 배포 시 Ethereum의 표준 주소 생성 알고리즘을 사용하여 매번 고유한 주소를 생성합니다. 이를 통해 테스트 간 완전한 격리를 보장합니다!