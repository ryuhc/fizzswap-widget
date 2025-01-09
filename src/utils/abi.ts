import { find } from 'lodash'
import { Abi, decodeEventLog, TransactionReceipt } from 'viem'

export function getInterface(abi: any[], functionName: string) {
  return find(abi, row => {
    return row.type === 'function' && functionName === row.name
  })
}

export function decodeEventOnReceipt(receipt: TransactionReceipt, abi: Abi, eventName: string) {
  for (const log of receipt.logs) {
    try {
      const topic = decodeEventLog({
        abi,
        data: log.data,
        topics: log.topics
      })

      if (topic.eventName === eventName) {
        return topic.args
      }
    } catch { /* empty */ }
  }

  return null
}