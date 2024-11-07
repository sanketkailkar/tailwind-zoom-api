import { KJUR } from "jsrsasign";

export async function getSdkToken(slug) {
  const JWT = await generateSignature(slug, 1);
  return JWT;
}

function generateSignature(sessionName, role) {
  if (!process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || !process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET) {
    throw new Error("Missing ZOOM_SDK_KEY or ZOOM_SDK_SECRET");
  }

  const iat = Math.round(new Date().getTime() / 1000);
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
  const sdkSecret = process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET;

  const oPayload = {
    app_key: sdkKey, tpc: sessionName, role_type: role, version: 1, iat: iat, exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);

  const signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  return signature;
}
