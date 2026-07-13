import type { BlogItem, BlogTagCountMap } from "@/types"

const cache = new Map()

type Query = {
  searchTerm: string
  selectedTags: string[]
  isOrLogic: boolean
  pageSize: number
  currentPage: number
}

export function fetchBlogs(data: BlogItem[], query: Query) {
  const searchParams = new URLSearchParams({
    searchTerm: query.searchTerm,
    pageSize: query.pageSize.toString(),
    isOrLogic: query.isOrLogic.toString(),
    selectedTags: query.selectedTags
      .sort((prev, next) =>
        prev.localeCompare(next, undefined, { sensitivity: "base" }),
      )
      .join(","),
    currentPage: query.currentPage.toString(),
  })

  const key = searchParams.toString()

  if (!cache.has(key)) {
    cache.set(key, getData(data, query))
  }

  return cache.get(key)
}

async function getData(data: BlogItem[], query: Query) {
  return await getSearchResults(data, query)
}

async function getSearchResults(data: BlogItem[], query: Query) {
  await new Promise((resolve) => {
    setTimeout(resolve, 0)
  })

  if (query.searchTerm == "") {
    const results = data.filter((blogPost) => {
      if (query.selectedTags.length === 0) return true
      return query.selectedTags
        .map((tag) => blogPost.tags.includes(tag))
        [query.isOrLogic ? "some" : "every"]((b) => b)
    })

    return {
      results: results.slice(
        (query.currentPage - 1) * query.pageSize,
        query.currentPage * query.pageSize,
      ),
      currentPage: query.currentPage,
      totalPage: Math.ceil(results.length / query.pageSize),
    }
  }

  const results = data
    .filter((blogPost) => {
      return blogPost.title
        .toLowerCase()
        .includes(query.searchTerm.toLowerCase())
    })
    .filter((blogPost) => {
      if (query.selectedTags.length === 0) return true
      return query.selectedTags
        .map((tag) => blogPost.tags.includes(tag))
        [query.isOrLogic ? "some" : "every"]((b) => b)
    })

  return {
    results: results.slice(
      (query.currentPage - 1) * query.pageSize,
      query.currentPage * query.pageSize,
    ),
    currentPage: query.currentPage,
    totalPage: Math.ceil(results.length / query.pageSize),
  }
}
