import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

const REGION = 'ap-south-1'
const BUCKET = 'whjr-prod-cocos-applet'
// const CDN = 'https://s3-whjr-prod-cocos-applet.whjr.online';

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

export async function getAppletData(id: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: `SEO/ReactAppletDev/CDN/applets/${id}/umd/index.umd.js`,
    // Get latest, not cached version
    ResponseCacheControl: 'no-cache',
  })

  let response
  try {
    response = await client.send(command)
  } catch (err) {
    return null
  }
  // FIXME: Handle an error while streaming the response body
  if (response.Body == null) return null

  return response.Body.transformToString()
}
