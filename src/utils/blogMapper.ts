import { ApiBlogItem, ApiCategoryItem, ApiTagItem } from '@/services/blogService'

const CATEGORY_COLORS: Record<number, string> = {
  1: 'indigo', // Inspirasi Kebaikan
  2: 'emerald', // Khasanah Islam
  3: 'blue', // Teknologi
  4: 'red', // Kemanusiaan
  5: 'amber', // Update Penyaluran
  6: 'purple', // Keluarga
}

const COLOR_NAMES = ['indigo', 'blue', 'red', 'amber', 'emerald', 'purple', 'sky', 'teal', 'pink']

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

export function getCategoryColor(id?: number, name?: string): string {
  if (id && CATEGORY_COLORS[id]) {
    return CATEGORY_COLORS[id]
  }
  if (name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % COLOR_NAMES.length
    return COLOR_NAMES[index]
  }
  return 'indigo'
}

export function transformApiBlogToPost(item: ApiBlogItem) {
  const categoryId = item.category?.id || 1
  const categoryName = item.category?.name || 'Umum'
  const categoryHandle = slugify(categoryName)
  const categoryColor = getCategoryColor(categoryId, categoryName)

  // Calculate estimated reading time
  const cleanContent = (item.content || item.description || '').replace(/<[^>]*>/g, '')
  const wordCount = cleanContent.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 180))

  return {
    id: String(item.id),
    title: item.title,
    handle: item.link || String(item.id),
    excerpt: item.description || '',
    content: item.content || '',
    date: item.created_at || item.updated_at || new Date().toISOString(),
    readingTime,
    commentCount: 0,
    viewCount: item.visitor || 0,
    bookmarkCount: 0,
    bookmarked: false,
    likeCount: 0,
    liked: false,
    postType: 'standard' as const,
    status: item.is_active ? 'published' : 'draft',
    featuredImage: {
      src: item.image_url || 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=2454&auto=format&fit=crop',
      alt: item.title,
      width: 1200,
      height: 800,
    },
    author: {
      id: 'author-admin',
      name: item.creator || 'Admin Beramal',
      handle: slugify(item.creator || 'admin-beramal'),
      description: 'Penulis dan kontributor inspirasi kebaikan Beramalbersama.',
      avatar: {
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        alt: item.creator || 'Admin Beramal',
        width: 100,
        height: 100,
      },
    },
    categories: [
      {
        id: `category-${categoryId}`,
        categoryId: categoryId,
        name: categoryName,
        handle: categoryHandle,
        color: categoryColor,
      },
    ],
    category: {
      id: `category-${categoryId}`,
      categoryId: categoryId,
      name: categoryName,
      handle: categoryHandle,
      color: categoryColor,
    },
  }
}

export function transformApiCategoryToCategory(
  item: ApiCategoryItem,
  count = 0
) {
  const categoryHandle = slugify(item.nama)
  const categoryColor = getCategoryColor(item.id, item.nama)

  return {
    id: `category-${item.id}`,
    categoryId: item.id,
    name: item.nama,
    handle: categoryHandle,
    description: `Artikel dan informasi seputar topik ${item.nama}`,
    color: categoryColor,
    count,
    date: item.created_at || '2025-01-01',
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=1200&auto=format&fit=crop',
      alt: item.nama,
      width: 1200,
      height: 800,
    },
    cover: {
      src: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?q=80&w=1920&auto=format&fit=crop',
      alt: item.nama,
      width: 1920,
      height: 1080,
    },
  }
}

export function transformApiTagToTag(
  item: ApiTagItem,
  count = 0
) {
  const tagHandle = slugify(item.nama)

  return {
    id: `tag-${item.id}`,
    tagId: item.id,
    name: item.nama,
    handle: tagHandle,
    description: `Kumpulan artikel dengan topik #${item.nama}`,
    count,
  }
}
