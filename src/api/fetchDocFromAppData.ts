import { MetaDataError } from '../consts'
import { AnyAppDataDocVersion } from '../generatedTypes'
import { appDataHexToCid, appDataHexToCidLegacy } from './appDataHexToCid'
import { fetchDocFromCid } from './fetchDocFromCid'

/**
 *
 * @param appDataHex Derives the CID from the appData hex, and fetches and parses the document from IPFS
 * @param ipfsUri URL of the IPFS gateway to use for the fetch
 *
 * @returns a parsed AppData document
 */
export async function fetchDocFromAppDataHex(
  appDataHex: string,
  ipfsUri?: string
): Promise<void | AnyAppDataDocVersion> {
  return _fetchDocFromCidAux(appDataHexToCid, appDataHex, ipfsUri)
}

/**
 * Fetches the document from IPFS using the appData hex
 *
 * @deprecated
 *
 * @param appDataHex
 * @param ipfsUri
 * @returns
 */
export async function fetchDocFromAppDataHexLegacy(
  appDataHex: string,
  ipfsUri?: string
): Promise<void | AnyAppDataDocVersion> {
  return _fetchDocFromCidAux(appDataHexToCidLegacy, appDataHex, ipfsUri)
}

export async function _fetchDocFromCidAux(
  hexToCid: (appDataHex: string) => Promise<string>,
  appDataHex: string,
  ipfsUri?: string
): Promise<void | AnyAppDataDocVersion> {
  try {
    const cid = await hexToCid(appDataHex)
    if (!cid) throw new MetaDataError('Error getting serialized CID')
    return fetchDocFromCid(cid, ipfsUri)
  } catch (e) {
    const error = e as MetaDataError
    // console.error(`Error fetching the IPFS document: appDataHex=${appDataHex}`, error)
    throw new MetaDataError(`Error decoding AppData: appDataHex=${appDataHex}, message=${error.message}`)
  }
}
