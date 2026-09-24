import ArchiveSortByListBox from '@/components/ArchiveSortByListBox'
import ModalCategories from '@/components/ModalCategories'
import ModalTags from '@/components/ModalTags'
import PaginationWrapper from '@/components/PaginationWrapper'
import Card11 from '@/components/PostCards/Card11'
import { getCategories, getCategoryByHandle, getTags } from '@/data/categories'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageHeader from '../page-header'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)

  if (!category) {
    return {
      title: 'Category not found',
      description: 'Category not found',
    }
  }

  return {
    title: category?.name,
    description: category?.description,
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const category = await getCategoryByHandle(handle)
  const posts = category.posts || []
  const categories = await getCategories()
  const tags = await getTags()

  if (!category) {
    return notFound()
  }

  const filterOptions = [
    { name: 'Most recent', value: 'most-recent' },
    { name: 'Curated by admin', value: 'curated-by-admin' },
    { name: 'Most appreciated', value: 'most-appreciated' },
    { name: 'Most discussed', value: 'most-discussed' },
    { name: 'Most viewed', value: 'most-viewed' },
  ]

  return (
    <div className={`page-category-${handle}`}>
      <PageHeader category={category} />

      <div className="container pt-10 lg:pt-20">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <ModalCategories categories={categories} />
          <ModalTags tags={tags} />
          <div className="ms-auto">
            <ArchiveSortByListBox filterOptions={filterOptions} />
          </div>
        </div>

        {/* LOOP ITEMS */}
        {posts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-7 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <Card11 key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300">Belum ada artikel dalam kategori ini</h3>
            <p className="mt-2 text-sm text-neutral-500">Silakan jelajahi kategori lainnya atau kembali ke beranda.</p>
          </div>
        )}

        {/* PAGINATIONS */}
        <PaginationWrapper className="mt-20" totalPages={Math.max(1, Math.ceil(posts.length / 12))} />
      </div>
    </div>
  )
}

export default Page
