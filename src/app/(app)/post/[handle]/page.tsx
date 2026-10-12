import { getAllPosts, getCommentsByPostId, getPostByHandle } from '@/data/posts'
import { Metadata } from 'next'
import SingleContentContainer from '../SingleContentContainer'
import SingleHeaderContainer from '../SingleHeaderContainer'
import SingleRelatedPosts from '../SingleRelatedPosts'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const post = await getPostByHandle(handle)
  if (!post) {
    return {
      title: 'Post not found',
      description: 'Post not found',
    }
  }

  const rawImage =
    (typeof post.featuredImage === 'string'
      ? post.featuredImage
      : post.featuredImage?.src) ||
    post.galleryImgs?.[0] ||
    ''

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://beramalbersama.com'

  const imageUrl = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${siteUrl.replace(/\/$/, '')}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
    : undefined

  const postUrl = `${siteUrl.replace(/\/$/, '')}/post/${post.handle}`
  const title = post.title

  // Clean description from any HTML tags and limit length
  const cleanDescription = (post.excerpt || post.content || post.title)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const description =
    cleanDescription.length > 160 ? `${cleanDescription.slice(0, 157)}...` : cleanDescription

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: 'Beramalbersama',
      locale: 'id_ID',
      type: 'article',
      publishedTime: post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const { handle } = await params
  const post = await getPostByHandle(handle)
  const comments = await getCommentsByPostId(post.id)
  const relatedPosts = (await getAllPosts()).slice(0, 6)
  const moreFromAuthorPosts = (await getAllPosts()).slice(1, 7)

  return (
    <>
      <div className="single-post-page page-style-3">
        <SingleHeaderContainer post={post} headerStyle="style3" />

        <div className="container mt-12">
          <SingleContentContainer post={post} comments={comments} />
        </div>

        <SingleRelatedPosts relatedPosts={relatedPosts} moreFromAuthorPosts={moreFromAuthorPosts} />
      </div>
    </>
  )
}

export default Page
