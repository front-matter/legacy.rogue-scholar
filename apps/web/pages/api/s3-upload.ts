import { APIRoute } from 'next-s3-upload'

export default APIRoute.configure({
  accessKeyId: process.env.NEXT_PUBLIC_S3_UPLOAD_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_UPLOAD_SECRET,
  bucket: 'assets.rogue-scholar.org',
  region: 'fra',
  endpoint: 'https://fra.digitaloceanspaces.com',
})
