import { silicon, siliconSepolia, SUPPORT_CHAIN_IDS } from '@/constants/chain/config'

export const contractAddresses: { [p: string]: Record<SUPPORT_CHAIN_IDS, `0x${string}`>} = {
  native: {
    [silicon.id]: '0x0000000000000000000000000000000000000000',
    [siliconSepolia.id]: '0x0000000000000000000000000000000000000000',
  },
  wNative: {
    [silicon.id]: '0xe66863B695A392507F5d68b6A7B8AA8218914059',
    [siliconSepolia.id]: '0x2f9cc2c11d5E10a5fd5C90c68f7FaD69f82ceD0b',
  },
  universalRouter: {
    [silicon.id]: '0x95D5C0fDb9c71c68296ffa50E7A82D41F386740D',
    [siliconSepolia.id]: '0x8e838b867534701fe0CB5fdc4A82D8cFd9EdE31C',
  },
  govToken: {
    [silicon.id]: '0x3a3F0074F29147769aC856e0D980165495933cCc',
    [siliconSepolia.id]: '0xb286B3Eecfdb537aAC71d8EeaD2Cc757e3568989',
  },
  V2Factory: {
    [silicon.id]: '0xCB72354080A1d3B8A48425B889025d0799c52095',
    [siliconSepolia.id]: '0xE81668086f31fbA115960Cd74d5D7c56F1a99Ab8',
  },
  V2Router: {
    [silicon.id]: '0x1c0Ec9E1316498664536D404eEB7c4159c1A7bBf',
    [siliconSepolia.id]: '0xbF726B70da180F27cd73087FaB027e784eEACf78',
  },
  zapV2: {
    [silicon.id]: '0x647C6188A2f969aB0e2f883108d77BBE155ce147',
    [siliconSepolia.id]: '0xf2e5133CE54C0c41383941d485C3E9D59b99a6F5',
  },
  V3Manager: {
    [silicon.id]: '0x4326474279780C0Dab506121C225854575CDcB8a',
    [siliconSepolia.id]: '0xD301583496AaAD6B89401A115F691EC58FeA607F',
  },
  V3Factory: {
    [silicon.id]: '0x2aeEC787Be499ef6f68e527B64FADF969D048042',
    [siliconSepolia.id]: '0x356bc1450071752631882999B3dcd065202894CA',
  },
  V3TickMigrator: {
    [silicon.id]: '0x922A9688D39F191b7f39EfFC2683DE2Cbe4463ad',
    [siliconSepolia.id]: '0xF65199b5b3ac15A398332755d5375bc91ADA4EF0',
  },
  V3VersionMigrator: {
    [silicon.id]: '0x7C3ea90428BaF92a135E443ADA78F6170C349a78',
    [siliconSepolia.id]: '0xfCd4Efa539f664284C1b9F9C0c16c37c57b7F6CD',
  },
  V3PositionView: {
    [silicon.id]: '0x66071576095E9c9cECa01299e1Ef72F8fb763797',
    [siliconSepolia.id]: '0x061C92734B23274D2a70F901Bd596D6D774B483c',
  },
  governance: {
    [silicon.id]: '0x481b0c3e2b3FeF38DF758e5F01811096F1d77e69',
    [siliconSepolia.id]: '0xab848624F4A28a2A5cbAb1E0c6D56cE69dE08f3c',
  },
  governor: {
    [silicon.id]: '0x15a06EE6c27e31FfA89c2bf10597C9cba36c5Cdf',
    [siliconSepolia.id]: '0xcDa19E0bDc5BaC21d88ec607b287c4906C2c4d70',
  },
  governorView: {
    [silicon.id]: '0xFdcC365CF4e3CBc29F4830136b0c0A02ADE87528',
    [siliconSepolia.id]: '0x1626A2bbC07DbfaC8d3017C02565a55C0F916ca0',
  },
  voting: {
    [silicon.id]: '0xE7256af50ac1a78D0912f8C1c8F54c24Db0C9636',
    [siliconSepolia.id]: '0x23c1A8A8a591400832f9F354a78Be0041DA297b2',
  },
  votingView: {
    [silicon.id]: '0xa2B00Ce5f95a541667B606469Bab5676ebE143Ec',
    [siliconSepolia.id]: '0xDfF6285c7474BA9E1A41021F7438497699dAcB9c',
  },
  multicall: {
    [silicon.id]: '0x566da61a4D0841a67bA8F2c7e5975885fa0Af4DA',
    [siliconSepolia.id]: '0x256A01De68390E8C5002F7197EF1c318dD185494',
  }
}

export const contractAddressesInternal: { [p: string]: Record<SUPPORT_CHAIN_IDS, `0x${string}`>} = {
  native: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x0000000000000000000000000000000000000000',
  },
  wNative: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x2f9cc2c11d5E10a5fd5C90c68f7FaD69f82ceD0b',
  },
  universalRouter: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x82DAE79A7604497e592528998B72b96383B41F02',
  },
  govToken: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x9A43Ff40e633AEAF2384edCbFeB720f5B784177B',
  },
  V2Factory: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x262055e2Ca03150d30ea0386F55E35abDED641dF',
  },
  V2Router: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0xd4FfEe85e42832Ed550B36AebC8c1c59fDf2803B',
  },
  zapV2: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0xfF3a5BBB3bB75EB699F3866ec6716856B3911cb7',
  },
  V3Manager: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x7e8D319A4475d97BDA55b82b4462E0eB768d1Ad1',
  },
  V3Factory: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x07Ae8cCEea4931a2E2805f96fA91F7ADA9509c6b',
  },
  V3TickMigrator: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x486299c2eE399Cad9dACcC8Db96399745AcD1b6C',
  },
  V3VersionMigrator: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x99b9eD89d931b6eCD95531734F88e64c54cB8053',
  },
  V3PositionView: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0xe2868cb2002504d8914Cc0f5d0d6F9A0120e29eD',
  },
  governance: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x98F146CE64B376bBff06A17237956bAD0fDfc50A',
  },
  governor: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0xb66115Ee1d9471288e95DdfD8d307cC245fcba6D',
  },
  governorView: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0xF28D670a1bf5994a5a3Bb392b25915b37ccda7ca',
  },
  voting: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x0d71E8091c2D2a5690cE8e6c731bE5E37e97BD78',
  },
  votingView: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x31d2585910b78c98b2884efb4875b03fCb275BAe',
  },
  multicall: {
    [silicon.id]: '0x',
    [siliconSepolia.id]: '0x256A01De68390E8C5002F7197EF1c318dD185494',
  }
}

export const INIT_CODE_HASH_V3 = {
  [silicon.id]:
    '0x47e16bdd17ff4843341a69de44b9e6db1cb1744da1684e9f9ae60997c4642449',
  [siliconSepolia.id]:
    '0x47e16bdd17ff4843341a69de44b9e6db1cb1744da1684e9f9ae60997c4642449',
}
