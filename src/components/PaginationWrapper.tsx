'use client'

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/shared/Pagination'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useCallback } from 'react'

interface Props {
  totalPages?: number
  className?: string
}

function PaginationComponent({ totalPages = 1, className }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to show
  const getPages = () => {
    const pages: (number | 'gap')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('gap')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('gap')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <Pagination className={className}>
      <PaginationPrevious
        href={currentPage > 1 ? pathname + '?' + createQueryString('page', (currentPage - 1).toString()) : null}
      />
      <PaginationList>
        {getPages().map((page, idx) =>
          page === 'gap' ? (
            <PaginationGap key={`gap-${idx}`} />
          ) : (
            <PaginationPage
              key={page}
              current={page === currentPage}
              href={pathname + '?' + createQueryString('page', page.toString())}
            >
              {page}
            </PaginationPage>
          )
        )}
      </PaginationList>
      <PaginationNext
        href={
          currentPage < totalPages ? pathname + '?' + createQueryString('page', (currentPage + 1).toString()) : null
        }
      />
    </Pagination>
  )
}

export default function PaginationWrapper(props: Props) {
  return (
    <Suspense>
      <PaginationComponent {...props} />
    </Suspense>
  )
}
