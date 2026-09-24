import { fetchBlogs, fetchCategories, fetchTags } from '@/services/blogService'
import { transformApiBlogToPost, transformApiCategoryToCategory, transformApiTagToTag } from '@/utils/blogMapper'
import { getAuthors } from './authors'
import { getCategories, getTags } from './categories'
import { getAllPosts } from './posts'

export async function getSearchResults(query: string, type: 'posts' | 'categories' | 'tags' | 'authors') {
  const recommendedSearches = ['Kebaikan', 'Sedekah', 'Ramadhan', 'Yatim', 'Kemanusiaan', 'Teknologi']

  switch (type) {
    case 'categories': {
      try {
        const apiCategories = await fetchCategories({ search: query || undefined })
        if (apiCategories && apiCategories.length > 0) {
          const allBlogs = await fetchBlogs({ limit: 50, is_active: true })
          const categories = apiCategories.map((item) => {
            const count = allBlogs.filter((b) => b.category?.id === item.id).length
            return transformApiCategoryToCategory(item, count)
          })
          return {
            query,
            categories,
            totalResults: categories.length,
            recommendedSearches,
          }
        }
      } catch (e) {}

      const all = await getCategories()
      const filtered = query
        ? all.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        : all
      return {
        query,
        categories: filtered,
        totalResults: filtered.length,
        recommendedSearches,
      }
    }

    case 'tags': {
      try {
        const apiTags = await fetchTags({ search: query || undefined })
        if (apiTags && apiTags.length > 0) {
          const tags = apiTags.map((item) => transformApiTagToTag(item))
          return {
            query,
            tags,
            totalResults: tags.length,
            recommendedSearches,
          }
        }
      } catch (e) {}

      const all = await getTags()
      const filtered = query
        ? all.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
        : all
      return {
        query,
        tags: filtered,
        totalResults: filtered.length,
        recommendedSearches,
      }
    }

    case 'authors': {
      const allAuthors = await getAuthors()
      const filtered = query
        ? allAuthors.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
        : allAuthors
      return {
        query,
        authors: filtered,
        totalResults: filtered.length,
        recommendedSearches,
      }
    }

    default: {
      try {
        if (query && query.trim().length > 0) {
          const apiBlogs = await fetchBlogs({ search: query, is_active: true, limit: 50 })
          const posts = apiBlogs.map(transformApiBlogToPost)
          return {
            query,
            posts,
            totalResults: posts.length,
            recommendedSearches,
          }
        }
      } catch (e) {}

      const all = await getAllPosts()
      const filtered = query
        ? all.filter(
            (p) =>
              p.title.toLowerCase().includes(query.toLowerCase()) ||
              p.excerpt.toLowerCase().includes(query.toLowerCase())
          )
        : all

      return {
        query,
        posts: filtered,
        totalResults: filtered.length,
        recommendedSearches,
      }
    }
  }
}
