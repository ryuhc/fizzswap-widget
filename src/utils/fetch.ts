import axios from 'axios'
import qs from 'query-string'
import {
  Abi,
  DecodeFunctionDataParameters,
  decodeFunctionResult,
  encodeFunctionData,
  EncodeFunctionDataParameters,
} from 'viem'

import MulticallABI from '@/abi/common/Multicall.json'

/** util **/
export function createQueryStr(options?: any): string {
  return options ? `?${qs.stringify(options)}` : ''
}

/** common data **/

export async function fetchTokenList(path: string, options?: { skip?: number, take?: number, keyword?: string, addresses?: string }) {
  try {
    const res = await fetch(`${path}/tokens${createQueryStr(options)}`)
    return await res.json()
  } catch {
    return {skip: 0, take: 0, total: 0, tokens: []}
  }
}

export async function callNativeBalance(path: string, user: `0x${string}`) {
  try {
    return await axios.post(`${path}/call/balance`, {
      address: user
    }, {
      timeout: 60 * 1000
    }).then(res => {
      return BigInt(res.data.balance)
    })
  } catch {
    return 0n
  }
}

export async function callContractFunction(path: string, data: `0x${string}`, contract: `0x${string}`) {
  try {
    return await axios.post(`${path}/call/contract`, {
      data,
      to: contract
    }, {
      timeout: 60 * 1000
    }).then(res => {
      return res.data.result
    })
  } catch {
    return '0x0000000000000000000000000000000000000000000000000000000000000000'
  }
}

export async function callAndDecodeContractFunction(
  path: string,
  params: { address: `0x${string}`, abi: Abi, functionName: string, args: any[] }
) {
  const callData = encodeFunctionData({
    abi: params.abi,
    args: params.args,
    functionName: params.functionName
  } as EncodeFunctionDataParameters)
  const callResult = await callContractFunction(path, callData, params.address)

  if (callResult === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return undefined
  }

  return decodeFunctionResult({
    abi: params.abi,
    args: params.args,
    functionName: params.functionName,
    data: callResult
  } as any)
}

export async function callAndDecodeContractFunctions(
  path: string,
  multicallAddress: `0x${string}`,
  params: { address: `0x${string}`, abi: Abi, functionName: string, args: any[] }[]
) {
  try {
    const callDatas = []

    for (const method of params) {
      const callData = encodeFunctionData({
        abi: method.abi,
        args: method.args,
        functionName: method.functionName
      } as EncodeFunctionDataParameters)

      callDatas.push({
        target: method.address,
        callData
      })
    }

    const aggregateParam = {
      abi: MulticallABI,
      args: [callDatas],
      functionName: 'aggregate',
    }
    const aggregateData = encodeFunctionData(aggregateParam as EncodeFunctionDataParameters)
    const aggregateResult = await callContractFunction(path, aggregateData, multicallAddress)

    if (aggregateResult === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return undefined
    }

    const [_, decodedAggregate] = decodeFunctionResult({
      ...aggregateParam,
      data: aggregateResult
    } as DecodeFunctionDataParameters) as [number, any[]]

    const result: any[] = []
    const allowZeroDataCalls = ['balanceOf', 'getEthBalance', 'allowance']

    for (let i = 0; i < decodedAggregate.length; i++) {
      const decodedMethodResult = decodedAggregate[i] && decodedAggregate[i] === '0x' && allowZeroDataCalls.includes(params[i].functionName) ? '0' : decodeFunctionResult({
        ...params[i],
        data: decodedAggregate[i]
      } as DecodeFunctionDataParameters)

      result.push(decodedMethodResult)
    }

    return result
  } catch(err) {
    console.log({ err })
    return undefined
  }
}