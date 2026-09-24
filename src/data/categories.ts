import { fetchBlogs, fetchCategories, fetchTags } from '@/services/blogService'
import { slugify, transformApiBlogToPost, transformApiCategoryToCategory, transformApiTagToTag } from '@/utils/blogMapper'
import { getAllPosts, getPostsDefault, TPost } from './posts'

const _demo_category_image_urls = [
  'https://images.unsplash.com/photo-1539477857993-860599c2e840?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1636306950045-4dbb10b7e0f4?q=80&w=2670&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1679913969285-64f089885005?q=80&w=2274&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1680792563719-288027b2a090?q=80&w=2693&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1679403855896-49b0bd34744a?q=80&w=2693&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533090368676-1fd25485db88?q=80&w=2669&auto=format&fit=crop',
]

// CATEGORIES
export async function getCategories() {
  try {
    const [apiCategories, allBlogs] = await Promise.all([
      fetchCategories(),
      fetchBlogs({ limit: 50, is_active: true }),
    ])

    if (apiCategories && apiCategories.length > 0) {
      return apiCategories.map((item, index) => {
        const count = allBlogs.filter((b) => b.category?.id === item.id).length
        const categoryObj = transformApiCategoryToCategory(item, count)
        const matchingBlog = allBlogs.find((b) => b.category?.id === item.id && b.image_url)
        if (matchingBlog?.image_url) {
          categoryObj.thumbnail.src = matchingBlog.image_url
          categoryObj.cover.src = matchingBlog.image_url
        } else {
          categoryObj.thumbnail.src = _demo_category_image_urls[index % _demo_category_image_urls.length]
          categoryObj.cover.src = _demo_category_image_urls[index % _demo_category_image_urls.length]
        }
        return categoryObj
      })
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }

  return [
    {
      id: 'category-1',
      categoryId: 1,
      name: 'Inspirasi Kebaikan',
      handle: 'inspirasi-kebaikan',
      description: 'Berbagi inspirasi kisah kebaikan dan aksi nyata untuk sesama.',
      color: 'indigo',
      count: 13,
      date: '2025-06-10',
      thumbnail: {
        src: _demo_category_image_urls[0],
        alt: 'Inspirasi Kebaikan',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[0],
        alt: 'Inspirasi Kebaikan',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-2',
      categoryId: 2,
      name: 'Khasanah Islam',
      handle: 'khasanah-islam',
      description: 'Wawasan keislaman, fiqih, dan teladan kehidupan sehari-hari.',
      color: 'emerald',
      count: 25,
      date: '2025-05-15',
      thumbnail: {
        src: _demo_category_image_urls[1],
        alt: 'Khasanah Islam',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[1],
        alt: 'Khasanah Islam',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-3',
      categoryId: 3,
      name: 'Teknologi',
      handle: 'teknologi',
      description: 'Perkembangan inovasi dan teknologi untuk kemudahan umat.',
      color: 'blue',
      count: 18,
      date: '2025-04-20',
      thumbnail: {
        src: _demo_category_image_urls[2],
        alt: 'Teknologi',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[2],
        alt: 'Teknologi',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-4',
      categoryId: 4,
      name: 'Kemanusiaan',
      handle: 'kemanusiaan',
      description: 'Aksi kemanusiaan, respon darurat, dan kepedulian bersama.',
      color: 'red',
      count: 22,
      date: '2025-03-05',
      thumbnail: {
        src: _demo_category_image_urls[3],
        alt: 'Kemanusiaan',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[3],
        alt: 'Kemanusiaan',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-5',
      categoryId: 5,
      name: 'Update Penyaluran',
      handle: 'update-penyaluran',
      description: 'Laporan dan dokumentasi penyaluran bantuan kepada yang membutuhkan.',
      color: 'amber',
      count: 30,
      date: '2025-02-15',
      thumbnail: {
        src: _demo_category_image_urls[4],
        alt: 'Update Penyaluran',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[4],
        alt: 'Update Penyaluran',
        width: 1920,
        height: 1080,
      },
    },
    {
      id: 'category-6',
      categoryId: 6,
      name: 'Keluarga',
      handle: 'keluarga',
      description: 'Tips kehangatan keluarga, parenting islami, dan resep sahur berkah.',
      color: 'purple',
      count: 15,
      date: '2025-01-20',
      thumbnail: {
        src: _demo_category_image_urls[5],
        alt: 'Keluarga',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[5],
        alt: 'Keluarga',
        width: 1920,
        height: 1080,
      },
    },
  ]
}

export async function getCategoryByHandle(handle: string) {
  handle = handle?.toLowerCase()
  const categories = await getCategories()

  if (handle === 'all') {
    const posts = await getAllPosts()
    return {
      id: 'category-all',
      categoryId: 0,
      name: 'All articles',
      handle: 'all',
      description: 'Jelajahi semua artikel inspiratif dan bermanfaat.',
      count: posts.length,
      date: '2025-01-01',
      thumbnail: {
        src: _demo_category_image_urls[0],
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      cover: {
        src: _demo_category_image_urls[0],
        alt: 'All',
        width: 1920,
        height: 1080,
      },
      color: 'indigo',
      posts,
    }
  }

  let category = categories.find(
    (cat) =>
      cat.handle.toLowerCase() === handle ||
      String((cat as any).categoryId) === handle ||
      slugify(cat.name) === handle
  )

  if (!category) {
    category = categories[0]
  }

  // Fetch blogs filtered by this category_id
  let posts: TPost[] = []
  try {
    const categoryId = (category as any).categoryId
    if (categoryId) {
      const apiBlogs = await fetchBlogs({ category_id: categoryId, is_active: true, limit: 50 })
      if (apiBlogs && apiBlogs.length > 0) {
        posts = apiBlogs.map(transformApiBlogToPost)
      }
    }
  } catch (err) {
    console.error(`Error fetching posts for category ${handle}:`, err)
  }

  if (posts.length === 0) {
    const all = await getAllPosts()
    posts = all.filter((p) => p.categories?.some((c) => c.handle === category?.handle || c.name === category?.name))
    if (posts.length === 0) posts = all.slice(0, 8)
  }

  return {
    ...category,
    count: posts.length || category.count,
    posts,
  }
}

export async function getCategoriesWithPosts() {
  const categories = await getCategories()
  const allPosts = await getAllPosts()

  return categories.map((category) => {
    const categoryPosts = allPosts.filter(
      (p) => p.categories?.some((c) => c.handle === category.handle || c.name === category.name)
    )
    return {
      ...category,
      posts: categoryPosts.length > 0 ? categoryPosts.slice(0, 8) : allPosts.slice(0, 8),
    }
  })
}

// TAGS
export async function getTags() {
  try {
    const [apiTags, allBlogs] = await Promise.all([
      fetchTags(),
      fetchBlogs({ limit: 50, is_active: true }),
    ])

    if (apiTags && apiTags.length > 0) {
      return apiTags.map((item) => {
        const count = allBlogs.filter((b) =>
          b.title?.toLowerCase().includes(item.nama.toLowerCase()) ||
          b.description?.toLowerCase().includes(item.nama.toLowerCase()) ||
          b.content?.toLowerCase().includes(item.nama.toLowerCase())
        ).length
        return transformApiTagToTag(item, Math.max(1, count))
      })
    }
  } catch (error) {
    console.error('Error fetching tags:', error)
  }

  return [
    {
      id: 'tag-1',
      tagId: 1,
      name: 'kebaikan',
      handle: 'kebaikan',
      description: 'Kumpulan artikel inspirasi kebaikan dan aksi berbagi.',
      count: 12,
    },
    {
      id: 'tag-2',
      tagId: 2,
      name: 'ramadhan',
      handle: 'ramadhan',
      description: 'Persiapan, panduan ibadah, dan amalan di bulan suci Ramadhan.',
      count: 10,
    },
    {
      id: 'tag-3',
      tagId: 3,
      name: 'sura',
      handle: 'sura',
      description: 'Kegiatan dan peringatan bulan Muharram serta aksi sosial.',
      count: 8,
    },
    {
      id: 'tag-4',
      tagId: 4,
      name: 'sedekah',
      handle: 'sedekah',
      description: 'Keutamaan bersedekah, fiqih infak dan zakat.',
      count: 15,
    },
    {
      id: 'tag-5',
      tagId: 5,
      name: 'yatim',
      handle: 'yatim',
      description: 'Program dan santunan membahagiakan anak-anak yatim.',
      count: 14,
    },
    {
      id: 'tag-6',
      tagId: 6,
      name: 'qurban',
      handle: 'qurban',
      description: 'Informasi dan penyaluran ibadah qurban ke pelosok nusantara.',
      count: 9,
    },
  ]
}

export async function getTagsWithPosts() {
  const tags = await getTags()
  const posts = await getAllPosts()
  return tags.map((tag) => ({
    ...tag,
    posts: posts.slice(0, 8),
  }))
}

export async function getTagByHandle(handle: string) {
  handle = handle?.toLowerCase()
  const tags = await getTags()

  if (handle === 'all') {
    const posts = await getAllPosts()
    return {
      id: 'tag-all',
      tagId: 0,
      name: 'All articles',
      handle: 'all',
      description: 'Explore all articles',
      count: posts.length,
      posts,
    }
  }

  let tag = tags.find(
    (t) =>
      t.handle.toLowerCase() === handle ||
      String((t as any).tagId) === handle ||
      slugify(t.name) === handle
  )

  if (!tag) {
    tag = tags[0]
  }

  // Fetch blogs filtered by tag_id or matching keyword
  let posts: TPost[] = []
  try {
    const tagId = (tag as any).tagId
    if (tagId) {
      const apiBlogs = await fetchBlogs({ tag_id: tagId, is_active: true, limit: 50 })
      if (apiBlogs && apiBlogs.length > 0) {
        posts = apiBlogs.map(transformApiBlogToPost)
      }
    }
  } catch (err) {
    console.error(`Error fetching posts for tag ${handle}:`, err)
  }

  if (posts.length === 0) {
    // Search blogs containing tag keyword
    try {
      const searchBlogs = await fetchBlogs({ search: tag.name, is_active: true, limit: 50 })
      if (searchBlogs && searchBlogs.length > 0) {
        posts = searchBlogs.map(transformApiBlogToPost)
      }
    } catch (e) {}
  }

  if (posts.length === 0) {
    posts = (await getAllPosts()).slice(0, 12)
  }

  return {
    ...tag,
    count: posts.length,
    posts,
  }
}

// Types
export type TCategory = Awaited<ReturnType<typeof getCategories>>[number] & {
  posts?: TPost[]
  cover?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

export type TTag = Awaited<ReturnType<typeof getTags>>[number] & {
  posts?: TPost[]
}
