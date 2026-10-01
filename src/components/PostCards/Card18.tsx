import PostFeaturedMedia from '@/components/PostFeaturedMedia/PostFeaturedMedia'
import { TPost } from '@/data/posts'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import CategoryBadgeList from '../CategoryBadgeList'
import PostTypeFeaturedIcon from '../PostTypeFeaturedIcon'

interface Props {
  className?: string
  ratio?: string
  titleClass?: string
  post: TPost
}

const Card18: FC<Props> = ({ className, titleClass = 'text-lg ', ratio = 'aspect-4/3', post }) => {
  const { title, handle, featuredImage, categories, postType } = post

  return (
    <div className={clsx('group post-card-18 relative flex flex-col overflow-hidden rounded-xl', className)}>
      <div className={clsx('relative size-full', ratio)}>
        {postType === 'audio' ? (
          <PostFeaturedMedia post={post} />
        ) : (
          <>
            <Image
              sizes="(max-width: 1024px) 100vw, 33vw"
              alt={title}
              className="size-full rounded-xl object-cover brightness-100 transition-[filter] duration-300 group-hover:brightness-75"
              src={featuredImage}
              priority
              fill
            />
            <PostTypeFeaturedIcon
              className="absolute end-3.5 top-3.5 group-hover:hidden"
              postType={postType}
              wrapSize="size-7"
              iconSize="size-4"
            />
            <Link href={`/post/${handle}`} className="absolute inset-0"></Link>
          </>
        )}
      </div>

      <Link
        href={`/post/${handle}`}
        className="absolute inset-x-0 bottom-0 block h-1/2 bg-linear-to-t from-black opacity-80"
      />

      <div className="absolute inset-x-0 bottom-0 flex grow flex-col p-6">
        <Link href={`/post/${handle}`} className="absolute inset-0" />
        <CategoryBadgeList categories={categories} />
        <h2 className={clsx('mt-3 leading-snug font-semibold text-white', titleClass)}>{title}</h2>
      </div>
    </div>
  )
}

export default Card18
