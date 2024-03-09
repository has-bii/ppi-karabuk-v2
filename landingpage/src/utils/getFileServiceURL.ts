export default function getFileServiceURL(path: string): string {
  return process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_IMG_PROVIDER_URL + path
    : path
}
