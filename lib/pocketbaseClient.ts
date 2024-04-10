// URL to the PocketBase backend API
export const pocketbaseURL = (doi: string) => {
  return `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/${doi}/transform/application/vnd.commonmeta+json`
}
