'use client'

import BookmarkBtn from '@/components/BookmarkBtn'
import PostCardCommentBtn from '@/components/PostCardCommentBtn'
import PostCardLikeBtn from '@/components/PostCardLikeBtn'
import { TPostDetail } from '@/data/posts'
import { Button } from '@/shared/Button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
  CheckmarkCircle02Icon,
  ClipboardIcon,
  Comment01Icon,
  CopyLinkIcon,
  Facebook01Icon,
  Flag03Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  NewTwitterIcon,
  Share03Icon,
  ViewOffSlashIcon,
  WhatsappIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'

function ActionDropdown({ handle, title, author }: { handle: string; title: string; author: TPostDetail['author'] }) {
  const [isOpenDialogHideAuthor, setIsOpenDialogHideAuthor] = useState(false)
  const [isOpenDialogReportPost, setIsOpenDialogReportPost] = useState(false)

  const actions = [
    {
      name: 'Copy link',
      icon: ClipboardIcon,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
      },
    },
    {
      name: 'Comment on this post',
      icon: Comment01Icon,
      href: '#comments',
    },
    {
      name: 'Hide this author',
      icon: ViewOffSlashIcon,
      onClick: () => {
        setIsOpenDialogHideAuthor(true)
      },
    },
    {
      name: 'Report this post',
      icon: Flag03Icon,
      onClick: () => {
        setIsOpenDialogReportPost(true)
      },
    },
  ]

  return (
    <>
      <Dropdown>
        <DropdownButton
          as="button"
          className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
        </DropdownButton>
        <DropdownMenu>
          {actions.map((item) =>
            item.href ? (
              <DropdownItem key={item.name} href={item.href} onClick={item.onClick}>
                <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                {item.name}
              </DropdownItem>
            ) : (
              <DropdownItem key={item.name} onClick={item.onClick}>
                <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                {item.name}
              </DropdownItem>
            )
          )}
        </DropdownMenu>
      </Dropdown>

      {/* DIALOG HIDE AUTHOR */}
      <Dialog open={isOpenDialogHideAuthor} onClose={() => setIsOpenDialogHideAuthor(false)}>
        <DialogTitle>
          Hide this author? <span className="font-semibold">({author.name.trim()})</span>
        </DialogTitle>
        <DialogBody>
          <p>
            Are you sure you want to hide the <span className="font-semibold">{author.name.trim()}</span>? This action
            will hide all posts from this author.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDialogHideAuthor(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpenDialogHideAuthor(false)}>Hide</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG REPORT POST */}
      <Dialog open={isOpenDialogReportPost} onClose={() => setIsOpenDialogReportPost(false)}>
        <DialogTitle>Report this post?</DialogTitle>
        <DialogBody>
          <p>
            Are you sure you want to report the <span className="font-semibold">&quot;{title.trim()}&quot;</span>? This
            action will report this post.
          </p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDialogReportPost(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpenDialogReportPost(false)}>Report</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function ShareDropdown({ handle }: { handle: string }) {
  const [showToast, setShowToast] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2500)
        })
        .catch(() => {
          fallbackCopyText(url)
        })
    } else {
      fallbackCopyText(url)
    }
  }

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    } catch (err) {
      console.error('Failed to copy', err)
    }
    document.body.removeChild(textArea)
  }

  const socialsShare = [
    {
      name: 'Copy link',
      icon: ClipboardIcon,
      onClick: handleCopyLink,
    },
    {
      name: 'WhatsApp',
      href: currentUrl ? `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}` : '#',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: WhatsappIcon,
    },
    {
      name: 'Facebook',
      href: currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` : '#',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: Facebook01Icon,
    },
    {
      name: 'Twitter',
      href: currentUrl ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}` : '#',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: NewTwitterIcon,
    },
    {
      name: 'Email',
      href: currentUrl ? `mailto:?body=${encodeURIComponent(currentUrl)}` : '#',
      icon: Mail01Icon,
    },
  ]

  return (
    <>
      <Dropdown>
        <DropdownButton
          as="button"
          className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <HugeiconsIcon icon={Share03Icon} size={20} />
        </DropdownButton>
        <DropdownMenu>
          {socialsShare.map((item) =>
            item.href ? (
              <DropdownItem key={item.name} href={item.href} target={item.target} rel={item.rel}>
                <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                {item.name}
              </DropdownItem>
            ) : (
              <DropdownItem key={item.name} onClick={item.onClick}>
                <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                {item.name}
              </DropdownItem>
            )
          )}
        </DropdownMenu>
      </Dropdown>

      {/* TOAST COPIED */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-2xl dark:bg-white dark:text-neutral-900">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-emerald-400 dark:text-emerald-600" />
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </>
  )
}

interface Props extends Pick<TPostDetail, 'likeCount' | 'liked' | 'commentCount' | 'handle' | 'title' | 'author'> {
  className?: string
}

const SingleMetaAction: FC<Props> = ({ className, likeCount, liked, commentCount, handle, title, author }) => {
  return (
    <div className={clsx('single-meta-action', className)}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        {/* <PostCardLikeBtn likeCount={likeCount} liked={liked} />
        <PostCardCommentBtn commentCount={commentCount} handle={handle} />
        <p className="font-light text-neutral-400 sm:mx-1">/</p>
        <BookmarkBtn className="size-8.5!" /> */}
        <ShareDropdown handle={handle} />
        {/* <ActionDropdown handle={handle} title={title} author={author} /> */}
      </div>
    </div>
  )
}

export { ActionDropdown, ShareDropdown, SingleMetaAction }
