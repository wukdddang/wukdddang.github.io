컴퓨터를 종료했다가 ganache 를 다시 켜고, 새로 주소 발급이 되면  

truffle migrate 를 해야하는거야?

네, 맞습니다! Ganache를 다시 시작하면 반드시 truffle migrate를 다시 해야 합니다.
## Ganache 재시작 시 필요한 이유

### 1. 새로운 네트워크
- Ganache 재시작 = 새로운 블록체인 네트워크
- 이전에 배포된 컨트랙트들이 모두 사라짐
- 새로운 계정 주소들이 생성됨

### 2. 연결 정보 변경

```javascript
// truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,  // Ganache 포트
      network_id: "*"
    }
  }
};
```

## Ganache 재시작 후 작업 순서

### 1. Ganache 재시작

``` bash
# Ganache를 다시 실행
# 새로운 계정들이 생성됨
```
### 2. Truffle 마이그레이션

``` bash
# 컨트랙트를 새 네트워크에 배포
truffle migrate
```

### 3. 배포 확인

```bash
# Truffle 콘솔에서 확인
truffle console
truffle(development)> Tether.deployed().then(t => console.log(t.address))
```



## 왜 다시 배포해야 하는가?

### 블록체인 네트워크의 특성:
- 각 네트워크는 독립적
- 컨트랙트 주소는 네트워크별로 다름
- 상태(잔액, 변수 등)도 네트워크별로 다름
### 예시:

```javascript
// Ganache 첫 실행
Tether 주소: 0x1234...
// Ganache 재시작 후
Tether 주소: 0x5678... (완전히 다른 주소)
```

## 개발 팁

### 1. Ganache 설정 저장

- Ganache에서 프로젝트 저장 기능 사용

- 재시작해도 같은 상태 유지 가능

### 2. 환경별 네트워크 사용

```javascript
// truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    testnet: {
      // 테스트넷 설정
    }
  }
};
```

### 3. 자동화 스크립트

```bash
# package.json에 스크립트 추가
"scripts": {
  "deploy": "truffle migrate --reset"
}
```

결론: Ganache 재시작 시에는 반드시 truffle migrate를 다시 실행해야 하며, 이는 새로운 블록체인 네트워크에 컨트랙트를 배포하는 과정입니다!