import { KJUR } from "jsrsasign";

export async function getSdkJWT() {
  const JWT = await generateVideoSdkApiJwt();
  return JWT;
}

function generateVideoSdkApiJwt() {

    const sdkApiKey = process.env.NEXT_PUBLIC_ZOOM_API_KEY;
    const sdkApiSecret = process.env.NEXT_PUBLIC_ZOOM_API_SECRET;
    
    const iat = Math.round((new Date().getTime() - 30000) / 1000)
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }
  
    const oPayload = {
      iss: sdkApiKey,
      iat: iat,
      exp: exp
    }
  
    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const videosdk_api_token = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkApiSecret)
    return videosdk_api_token
  }
