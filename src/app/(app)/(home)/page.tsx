import SectionAds from '@/components/SectionAds'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionMagazine10 from '@/components/SectionMagazine10'
import SectionMagazine11 from '@/components/SectionMagazine11'
import SectionMagazine2 from '@/components/SectionMagazine2'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionPostsWithWidgets from '@/components/SectionPostsWithWidgets'
import { getAuthors } from '@/data/authors'
import { getCategoriesWithPosts, getTags } from '@/data/categories'
import { getAllPosts } from '@/data/posts'
import { Divider } from '@/shared/divider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beramalbersama - Blog & Inspirasi Kebaikan',
  description: 'Temukan artikel inspiratif, kabar penyaluran, khasanah islam, dan kisah kebaikan bersama Beramalbersama.',
}

const Page = async () => {
  const [posts, authors, categories, tags] = await Promise.all([
    getAllPosts(),
    getAuthors(),
    getCategoriesWithPosts(),
    getTags(),
  ])

  return (
    <div className="relative container space-y-28 pb-28 lg:space-y-32 lg:pb-32">
      <SectionMagazine10 posts={posts.slice(0, 8)} />

      <SectionMagazine9
        heading="Artikel Terbaru"
        subHeading="Jelajahi berbagai kategori dan topik inspiratif"
        posts={posts.slice(0, 18)}
      />

      {/* <SectionAds /> */}

      <SectionMagazine2
        heading="Kisah & Inspirasi Pilihan"
        subHeading="Temukan artikel dan cerita paling menginspirasi"
        posts={posts.slice(0, 7)}
      />

      <Divider />

      {/* <SectionMagazine11
        categories={categories.slice(0, 3)}
        heading="Kategori Pilihan"
        subHeading="Eksplorasi artikel berdasarkan kategori favorit"
      /> */}

      <SectionBecomeAnAuthor />

      <SectionPostsWithWidgets
        heading="Kabar Terbaru"
        subHeading="Update berita dan artikel terkini dari Beramalbersama"
        posts={posts.slice(0, 8)}
        postCardName="card4"
        gridClass="sm:grid-cols-2"
        widgetAuthors={authors.slice(0, 4)}
        widgetCategories={categories.slice(0, 7)}
        widgetTags={tags.slice(0, 6)}
        widgetPosts={posts.slice(0, 4)}
      />
    </div>
  )
}

export default Page
