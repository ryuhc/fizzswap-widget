# Fizzswap Widget

[![npm](https://img.shields.io/npm/v/fizzswap-widget)](https://www.npmjs.com/package/fizzswap-widget)

React 기반의 가볍고 범용적인 fizzswap swap widget (아직 개발 중)

# 개요

실리콘 대표 DEX fizzswap 의 스왑 기능을 어디서든 손쉽게 연동할 수 있는 위젯 프로젝트입니다. 아래와 같이 루트 컴포넌트 하나만 불러오면 끝입니다.

```jsx
function main() {
  return (
    <SwapWidget />
  )
}
```

프로젝트에 맞춰 theme, 입력 수량 및 토큰 기본값과 같은 다양한 설정을 커스터마이징 할 수 있으며 사이트와 지갑 세션도 연동됩니다. (wagmi 호환 시)

## 설치

`npm` or `yarn` or `pnpm` 등 원하는 패키지 매니저를 이용해 다음과 같이 패키지를 설치해주세요.

```shell
yarn add fizzswap-widget
```
```shell
npm i --save fizzswap-widget
```
```shell
pnpm i fizzswap-widget
```

## 커스터마이징

클라이언트에 최적화된 사용 경험을 위해 아래와 같이 widget 의 커스터마이징을 지원하고 있습니다. 
```typescript
import { Chain } from 'viem'

declare type SwapType = 'normal' | 'inputOnly' | 'outputOnly'

declare type SwapWidgetProps = {
  rpcUrl?: string
  chainId?: Chain['id']
  inputTokenAddress?: `0x${string}`
  inputAmount?: string
  outputTokenAddress?: `0x${string}`
  outputAmount?: string
  theme?: {
    light: { [p:string]: string },
    dark: { [p:string]: string }
  }
  selectable?: boolean
  apiUrl?: {
    [p: number]: string
  }
  operatorUrl?: string
  wcApiKey?: string
  swapType: SwapType
}

declare type SwapWidget = (props: SwapWidgetProps) => JSX.Element

// ex : <SwapWidget selectable={true} swapType="normal" />
```

## 예시

보다 편리한 연동을 위해 간단한 Demo 사이트를 제공할 예정입니다.

- [TODO]()

실리콘 생태계의 다양한 프로젝트들이 이미 해당 위젯을 활용하여 편리한 거래 환경을 제공하고 있습니다.

- [Vennie](https://vennie.io/)
- [Silicon Scope](https://scope.silicon.network)

## Legal notice

이 위젯은 무료이며 오픈소스입니다. 생태계 발전을 위한 코드 기여도 언제든 환영합니다.

다만 우리는 서비스 업체가 이 위젯을 자사 제품에 연동할 때 소재 지역의 경제 또는 무역 제재를 준수하는지 사전에 철저히 검토할것을 권장합니다.\
충분한 검토없이 위젯을 사용했을 시 발생할 수 있는 민형사상 책임 및 각종 이슈에 대해 우리는 책임지지 않습니다. 