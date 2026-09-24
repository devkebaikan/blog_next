export interface ApiBlogItem {
  id: number
  title: string
  link: string
  content: string
  description: string
  image: string
  image_url: string
  is_active: boolean
  creator: string
  visitor: number
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
  }
}

export interface ApiCategoryItem {
  id: number
  nama: string
  created_at?: string
  updated_at?: string
}

export interface ApiTagItem {
  id: number
  nama: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.PUBLIC_API_URL ||
  'https://fapi.beramalbersama.com/api/v1'

const DEFAULT_CATEGORIES: ApiCategoryItem[] = [
  { id: 1, nama: 'Inspirasi Kebaikan' },
  { id: 2, nama: 'Khasanah Islam' },
  { id: 3, nama: 'Teknologi' },
  { id: 4, nama: 'Kemanusiaan' },
  { id: 5, nama: 'Update Penyaluran' },
  { id: 6, nama: 'Keluarga' },
]

const DEFAULT_TAGS: ApiTagItem[] = [
  { id: 1, nama: 'kebaikan' },
  { id: 2, nama: 'ramadhan' },
  { id: 3, nama: 'sura' },
  { id: 4, nama: 'sedekah' },
  { id: 5, nama: 'yatim' },
  { id: 6, nama: 'qurban' },
]

export interface GetBlogsParams {
  search?: string
  category_id?: number | string
  tag_id?: number | string
  is_active?: boolean
  mode?: 'pagination' | 'list'
  limit?: number
  page?: number
}

export async function fetchBlogs(params: GetBlogsParams = {}): Promise<ApiBlogItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/blogs`)

    if (params.search) url.searchParams.set('search', params.search)
    if (params.category_id !== undefined && params.category_id !== '' && params.category_id !== 'all') {
      url.searchParams.set('category_id', String(params.category_id))
    }
    if (params.tag_id !== undefined && params.tag_id !== '' && params.tag_id !== 'all') {
      url.searchParams.set('tag_id', String(params.tag_id))
    }
    if (params.is_active !== undefined) {
      url.searchParams.set('is_active', String(params.is_active))
    }
    if (params.mode) url.searchParams.set('mode', params.mode)
    if (params.limit) url.searchParams.set('limit', String(params.limit))
    if (params.page) url.searchParams.set('page', String(params.page))

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      console.error(`Failed to fetch blogs: ${res.status} ${res.statusText}`)
      return []
    }

    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
  } catch (error) {
    console.error('Error in fetchBlogs:', error)
    return []
  }
}

export async function fetchBlogBySlug(slug: string): Promise<ApiBlogItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      // If not found by direct slug, fallback to searching list
      const all = await fetchBlogs({ limit: 50 })
      const found = all.find(
        (b) => b.link?.toLowerCase() === slug.toLowerCase() || String(b.id) === slug
      )
      return found || null
    }

    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error(`Error in fetchBlogBySlug for ${slug}:`, error)
    return null
  }
}

export async function fetchCategories(params?: {
  search?: string
  mode?: string
  limit?: number
  page?: number
}): Promise<ApiCategoryItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/blogs/kategori`)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.mode) url.searchParams.set('mode', params.mode)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))
    if (params?.page) url.searchParams.set('page', String(params.page))

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
      headers: {
        Accept: 'application/json',
      },
    })

    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data
      }
    }
  } catch (error) {
    // Suppress network error and use fallback
  }

  // Fallback to DEFAULT_CATEGORIES
  if (params?.search) {
    return DEFAULT_CATEGORIES.filter((c) =>
      c.nama.toLowerCase().includes(params.search!.toLowerCase())
    )
  }
  return DEFAULT_CATEGORIES
}

export async function fetchTags(params?: {
  search?: string
  mode?: string
  limit?: number
  page?: number
}): Promise<ApiTagItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/blogs/tags`)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.mode) url.searchParams.set('mode', params.mode)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))
    if (params?.page) url.searchParams.set('page', String(params.page))

    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
      headers: {
        Accept: 'application/json',
      },
    })

    if (res.ok) {
      const json = await res.json()
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data
      }
    }
  } catch (error) {
    // Suppress network error and use fallback
  }

  // Fallback to DEFAULT_TAGS
  if (params?.search) {
    return DEFAULT_TAGS.filter((t) =>
      t.nama.toLowerCase().includes(params.search!.toLowerCase())
    )
  }
  return DEFAULT_TAGS
}
