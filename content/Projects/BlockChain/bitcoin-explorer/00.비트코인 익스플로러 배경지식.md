# 비트코인 익스플로러 개발 배경지식 📚

## 목차

1. [비트코인 블록체인 기본 구조](#1-비트코인-블록체인-기본-구조)
2. [블록(Block) 이해하기](#2-블록block-이해하기)
3. [트랜잭션(Transaction) 구조](#3-트랜잭션transaction-구조)
4. [UTXO 모델의 핵심](#4-utxo-모델의-핵심)
5. [비트코인 주소 체계](#5-비트코인-주소-체계)
6. [엔티티 설계 배경](#6-엔티티-설계-배경)
7. [인덱싱 전략의 이유](#7-인덱싱-전략의-이유)
8. [비트코인 네트워크 통신](#8-비트코인-네트워크-통신)

---

## 1. 비트코인 블록체인 기본 구조

### 1.1 블록체인이란?

비트코인 블록체인은 **체인 형태로 연결된 블록들의 분산 원장**입니다.

```
Genesis Block → Block #1 → Block #2 → Block #3 → ... → Latest Block
     ↓              ↓          ↓          ↓                ↓
 [Transactions] [Transactions] [Transactions] [Transactions] [Transactions]
```

### 1.2 핵심 개념

| 개념 | 설명 | 실제 예시 |
|------|------|-----------|
| **블록 높이** | 블록의 순서 번호 (0번부터 시작) | Genesis Block = 0, 현재 약 820,000+ |
| **블록 해시** | 블록의 고유 식별자 | `00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054` |
| **이전 블록 해시** | 직전 블록의 해시 (체인 연결고리) | 각 블록이 이전 블록을 참조 |
| **머클루트** | 블록 내 모든 거래의 요약 해시 | 트랜잭션 무결성 검증용 |

### 1.3 왜 이런 구조인가?

```typescript
// 왜 Block 엔티티에 previousBlockHash가 있는지 이해
@Column({ name: "previous_block_hash", length: 64, nullable: true })
previousBlockHash: string;

// → 블록들이 체인처럼 연결되어 있기 때문!
// → 이전 블록 해시가 변경되면 모든 후속 블록이 무효화됨 (보안)
```

---

## 2. 블록(Block) 이해하기

### 2.1 블록의 구성 요소

실제 비트코인 블록은 **헤더**와 **트랜잭션 리스트**로 구성됩니다:

```json
{
  "hash": "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
  "height": 820123,
  "time": 1703123456,
  "nonce": 1234567890,
  "difficulty": 62463471666284.52,
  "merkleroot": "a1b2c3d4e5f6...",
  "previousblockhash": "00000000000000000001...",
  "size": 1048576,
  "tx": [
    "coinbase_transaction_id",
    "regular_transaction_id_1",
    "regular_transaction_id_2",
    // ... 더 많은 트랜잭션들
  ]
}
```

### 2.2 Block 엔티티 설계 배경

```typescript
@Entity("blocks")
@Index(["height"])      // ← 블록 높이로 빠른 조회
@Index(["hash"])        // ← 블록 해시로 빠른 조회  
@Index(["timestamp"])   // ← 시간별 블록 조회
export class Block {
  @PrimaryColumn()
  height: number;       // ← 블록 번호 (Primary Key로 사용하는 이유?)
  
  @Column({ length: 64, unique: true })
  hash: string;         // ← 블록 해시는 유일하지만 PK가 아닌 이유?
  
  @Column({ type: "bigint" })
  nonce: number;        // ← 채굴 과정에서 사용되는 숫자
  
  @Column({ type: "int" })
  difficulty: number;   // ← 채굴 난이도
  
  @Column({ type: "bigint", name: "block_size" })
  blockSize: number;    // ← 블록 크기 (바이트 단위)
}
```

### 2.3 설계 선택의 이유

#### 왜 height를 Primary Key로?

```typescript
// ❌ 이렇게 하면 안 되는 이유
@PrimaryColumn()
hash: string;  // 64자 문자열을 PK로 사용하면 성능 저하

// ✅ 이렇게 하는 이유
@PrimaryColumn()
height: number;  // 정수형 PK는 성능이 뛰어남
```

- **성능**: 정수형 인덱스가 문자열보다 빠름
- **순서**: 높이로 블록 순서를 자연스럽게 표현
- **조인**: 다른 테이블과 조인 시 성능 우수

#### 왜 bigint 타입을 사용?

```typescript
@Column({ type: "bigint" })
nonce: number;        // nonce는 최대 2^32 (4,294,967,295)

@Column({ type: "bigint", name: "block_size" })
blockSize: number;    // 블록 크기는 계속 증가할 수 있음
```

- 비트코인에서 숫자값들이 매우 클 수 있음
- 미래의 확장성을 고려한 안전한 선택

---

## 3. 트랜잭션(Transaction) 구조

### 3.1 트랜잭션의 본질

비트코인 트랜잭션은 **"코인을 이전 거래에서 받아서 새로운 주소로 보내는 것"**입니다.

```
이전 거래 A → [Input] → 현재 거래 → [Output] → 다음 거래 B
```

### 3.2 실제 트랜잭션 예시

```json
{
  "txid": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
  "size": 225,
  "vsize": 144,
  "version": 1,
  "vin": [  // ← Inputs (어디서 받았는지)
    {
      "txid": "previous_tx_id",
      "vout": 0,
      "scriptSig": {
        "asm": "304502210...",
        "hex": "48304502210..."
      }
    }
  ],
  "vout": [ // ← Outputs (어디로 보낼지)  
    {
      "value": 0.50000000,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 89abcd...",
        "hex": "76a91489abcd...",
        "addresses": ["1DZTzaBHUDM7T3QvUKBz4qXMRpkg8jsfB5"]
      }
    },
    {
      "value": 0.49990000,
      "n": 1,
      "scriptPubKey": {
        "addresses": ["1A2B3C4D5E6F..."]  // ← 잔돈 주소
      }
    }
  ]
}
```

### 3.3 Transaction 엔티티 설계 배경

```typescript
@Entity("transactions")
@Index(["txid"])           // ← 트랜잭션 해시로 빠른 조회
@Index(["block_height"])   // ← 특정 블록의 거래들 조회
@Index(["fee"])            // ← 수수료별 정렬/필터링
export class Transaction {
  @PrimaryColumn({ length: 64 })
  txid: string;            // ← 트랜잭션 해시 (64자 고정)
  
  @Column({ name: "block_height" })
  blockHeight: number;     // ← 어떤 블록에 포함되었는지
  
  @ManyToOne(() => Block, (block) => block.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "block_height", referencedColumnName: "height" })
  block: Block;           // ← Block과의 관계 설정
  
  @Column({ type: "int", name: "tx_index" })
  txIndex: number;        // ← 블록 내에서의 순서 (중요!)
  
  @Column({ type: "bigint" })
  fee: number;            // ← 수수료 (satoshi 단위)
  
  @Column({ type: "int", name: "virtual_size" })
  virtualSize: number;    // ← SegWit 고려한 크기
}
```

### 3.4 설계 선택의 이유

#### 왜 txid를 Primary Key로?

```typescript
@PrimaryColumn({ length: 64 })
txid: string;  // 트랜잭션 해시는 전역적으로 유일함
```

- 트랜잭션 해시는 **전 세계적으로 유일**
- 블록체인 익스플로러에서 가장 많이 조회되는 값
- 외부 API와 호환성 유지

#### 왜 block_height를 외래키로?

```typescript
@JoinColumn({ name: "block_height", referencedColumnName: "height" })
```

- Block의 PK가 height이므로 이를 참조
- 특정 블록의 모든 거래를 빠르게 조회 가능

---

## 4. UTXO 모델의 핵심

### 4.1 UTXO란?

**UTXO (Unspent Transaction Output)** = "아직 사용되지 않은 거래 출력"

```
Alice가 Bob에게 1 BTC를 보내는 상황:

이전 상태:
- Alice가 소유한 UTXO: 1.5 BTC (이전 거래에서 받은 것)

거래 실행:
Input:  Alice의 1.5 BTC UTXO를 소비
Output: Bob에게 1.0 BTC + Alice에게 0.49 BTC (잔돈) + 0.01 BTC (수수료)

새로운 상태:
- Alice의 이전 UTXO는 "사용됨" 상태가 됨
- Bob이 새로운 1.0 BTC UTXO를 소유
- Alice가 새로운 0.49 BTC UTXO를 소유 (잔돈)
```

### 4.2 TxOutput 엔티티 설계 배경

```typescript
@Entity("tx_outputs")
@Index(["txid", "output_index"])  // ← 특정 거래의 특정 출력 조회
@Index(["address"])               // ← 주소별 UTXO 조회
@Index(["is_spent"])              // ← 사용된/안된 UTXO 구분
@Index(["value"])                 // ← 금액별 정렬
export class TxOutput {
  @Column({ length: 64 })
  txid: string;                   // ← 어떤 거래의 출력인지
  
  @Column({ type: "int", name: "output_index" })
  outputIndex: number;            // ← 거래 내에서의 출력 순서 (0, 1, 2...)
  
  @Column({ length: 62, nullable: true })
  address: string;                // ← 받는 사람의 주소
  
  @Column({ type: "bigint" })
  value: number;                  // ← 금액 (satoshi 단위)
  
  @Column({ type: "boolean", name: "is_spent", default: false })
  isSpent: boolean;               // ← UTXO의 핵심! 사용 여부
  
  @Column({ length: 64, name: "spent_in_txid", nullable: true })
  spentInTxid: string;           // ← 어떤 거래에서 사용되었는지
}
```

### 4.3 UTXO 추적이 중요한 이유

```typescript
// 주소의 잔액을 계산하는 방법
async calculateAddressBalance(address: string): Promise<number> {
  const utxos = await this.txOutputRepository.find({
    where: {
      address: address,
      isSpent: false  // ← 아직 사용되지 않은 출력만
    }
  });
  
  return utxos.reduce((sum, utxo) => sum + utxo.value, 0);
}
```

- **잔액 계산**: isSpent = false인 출력들의 합
- **거래 검증**: 입력으로 사용할 UTXO가 실제로 존재하고 미사용 상태인지 확인
- **거래 추적**: 특정 코인이 어떻게 이동했는지 추적 가능

---

## 5. 비트코인 주소 체계

### 5.1 주소 형식별 특징

| 주소 형식 | 시작 문자 | 예시 | 특징 |
|-----------|-----------|------|------|
| **P2PKH** | `1` | `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` | 전통적인 주소, 가장 일반적 |
| **P2SH** | `3` | `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy` | 멀티시그, 스크립트 주소 |
| **Bech32** | `bc1` | `bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq` | SegWit, 수수료 절약 |

### 5.2 주소 검증 로직

```typescript
// 주소 유효성 검사 (DTO에서 사용)
@Matches(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, {
  message: "유효하지 않은 비트코인 주소 형식입니다.",
})
address: string;

// Elasticsearch에서 주소 타입 분류
private getAddressType(address: string): string {
  if (address.startsWith("1")) return "P2PKH";
  if (address.startsWith("3")) return "P2SH";
  if (address.startsWith("bc1")) return "Bech32";
  return "Unknown";
}
```

### 5.3 주소별 처리 차이점

- **P2PKH**: 가장 기본적인 형태, 개인 지갑 주소
- **P2SH**: 복잡한 스크립트 (멀티시그 등), 거래소나 기업에서 사용
- **Bech32**: SegWit 주소, 수수료 효율적, 최신 지갑에서 지원

---

## 6. 엔티티 설계 배경

### 6.1 왜 이런 구조로 설계했는가?

#### 정규화 vs 성능의 균형

```typescript
// Option A: 모든 데이터를 한 테이블에 (비정규화)
❌ TransactionWithEverything {
  txid, blockHeight, blockHash, blockTime, inputData, outputData, ...
}

// Option B: 적절한 정규화 (우리의 선택)
✅ Transaction + TxInput + TxOutput + Block
```

**우리가 선택한 이유:**
- **쿼리 효율성**: 필요한 데이터만 로딩
- **유지보수성**: 각 엔티티가 명확한 책임
- **확장성**: 새로운 필드 추가가 용이

#### 관계 설정의 이유

```typescript
// Transaction → Block (Many-to-One)
@ManyToOne(() => Block, (block) => block.transactions, { onDelete: "CASCADE" })
// → 한 블록에는 여러 거래가 있지만, 각 거래는 하나의 블록에만 속함
// → CASCADE: 블록이 삭제되면 관련 거래들도 자동 삭제 (무결성)

// Transaction → TxInput/TxOutput (One-to-Many)
@OneToMany(() => TxInput, (input) => input.transaction, { cascade: true })
// → 한 거래는 여러 입력/출력을 가질 수 있음
// → cascade: 거래 삭제 시 입력/출력도 함께 삭제
```

### 6.2 타입 선택의 배경

```typescript
// 비트코인의 숫자 범위 고려
@Column({ type: "bigint" })
value: number;        // 1 satoshi = 0.00000001 BTC
                      // 2,100만 BTC × 10^8 = 2.1 × 10^15 satoshi

@Column({ type: "int" })
difficulty: number;   // 현재 약 62조... 하지만 int 범위 내

@Column({ length: 64 })
hash: string;        // SHA-256 해시는 항상 64자 (성능 최적화)
```

---

## 7. 인덱싱 전략의 이유

### 7.1 자주 사용되는 쿼리 패턴

```sql
-- 1. 특정 주소의 모든 거래 조회
SELECT * FROM tx_outputs WHERE address = '1A1zP1...' 
→ @Index(['address']) 필요

-- 2. 특정 블록의 모든 거래
SELECT * FROM transactions WHERE block_height = 820123
→ @Index(['block_height']) 필요

-- 3. 수수료가 높은 거래들
SELECT * FROM transactions ORDER BY fee DESC
→ @Index(['fee']) 필요

-- 4. 미사용 UTXO 조회 (잔액 계산)
SELECT * FROM tx_outputs WHERE address = '1A1zP1...' AND is_spent = false
→ @Index(['address', 'is_spent']) 복합 인덱스 필요
```

### 7.2 복합 인덱스의 이유

```typescript
@Index(["txid", "output_index"])  // TxOutput에서
```

**왜 이 순서인가?**
- `txid`로 먼저 필터링 (높은 선택성)
- 그 다음 `output_index`로 정확한 출력 특정
- 이 조합은 거래의 특정 출력을 조회할 때 가장 효율적

### 7.3 인덱스 전략 원칙

1. **WHERE 절에 자주 사용되는 컬럼**은 인덱스 생성
2. **복합 인덱스**는 선택성 높은 컬럼을 앞에
3. **ORDER BY**에 사용되는 컬럼도 인덱스 고려
4. **JOIN**에 사용되는 외래키는 반드시 인덱스

---

## 8. 비트코인 네트워크 통신

### 8.1 Bitcoin Core RPC

```typescript
// Bitcoin Core와 통신하는 방법
const response = await axios.post('http://bitcoin-node:8332', {
  jsonrpc: "2.0",
  id: 1,
  method: "getblock",           // ← RPC 메서드
  params: [blockHash, 2]        // ← 파라미터 (상세 정보 포함)
}, {
  auth: {
    username: "bitcoinrpc",     // ← RPC 인증
    password: "password"
  }
});
```

### 8.2 ZeroMQ (실시간 알림)

```typescript
// Bitcoin Core에서 새 블록 알림 받기
const zmq = require("zeromq");
const sock = zmq.socket("sub");
sock.connect("tcp://bitcoin-node:28332");
sock.subscribe("hashblock");        // ← 새 블록 해시 구독

sock.on("message", (topic, message) => {
  if (topic.toString() === "hashblock") {
    const blockHash = message.toString("hex");
    // 새 블록 처리 큐에 추가
    this.blockQueue.add("new-block", { blockHash });
  }
});
```

### 8.3 왜 이런 통신 방식인가?

- **RPC**: 요청/응답 방식, 특정 데이터 조회에 적합
- **ZeroMQ**: 발행/구독 방식, 실시간 이벤트에 적합
- **Bull Queue**: 비동기 처리, 대용량 데이터 처리에 필수

---

## 결론: 설계 결정의 배경

### 🎯 핵심 설계 원칙

1. **비트코인 데이터 구조 반영**: 블록체인의 실제 구조를 그대로 모델링
2. **성능 최적화**: 자주 사용되는 쿼리 패턴에 맞춘 인덱싱
3. **확장성 고려**: 미래의 데이터 증가와 기능 확장에 대비
4. **무결성 보장**: 관계 설정과 제약조건으로 데이터 일관성 유지

### 🔍 실제 비즈니스 요구사항과 연결

| 기능 | 필요한 엔티티 설계 | 이유 |
|------|-------------------|------|
| **주소 잔액 조회** | TxOutput + isSpent 필드 | UTXO 모델 구현 |
| **거래 내역 조회** | Transaction + address 인덱스 | 빠른 주소별 조회 |
| **블록 탐색** | Block + height PK | 순차적 블록 탐색 |
| **실시간 업데이트** | ZMQ + Bull Queue | 새 블록/거래 즉시 처리 |

이제 엔티티 설계의 모든 결정이 **실제 비트코인의 동작 방식**과 **익스플로러의 비즈니스 요구사항**에서 나온 것임을 이해하실 수 있을 것입니다! 🚀
