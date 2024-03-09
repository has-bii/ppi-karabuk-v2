import axios from "axios"

const axiosBlog = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BLOG_API}/api`,
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLOG_TOKEN}` },
  timeout: 10000,
})

const axiosBlogUpdate = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BLOG_API}/api`,
  headers: { Authorization: `Bearer ${process.env.UPDATE_BLOG_TOKEN}` },
  timeout: 10000,
})

export { axiosBlog, axiosBlogUpdate }
