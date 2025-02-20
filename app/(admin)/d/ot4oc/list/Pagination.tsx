/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const PaginationControl = ({
  HasNext,
  currentPage,
  totalPage,
  show
}: {
  currentPage: string | number
  HasNext: boolean
  totalPage: string | number
  show: boolean
}) => {

  const pathname = usePathname()
  const { push } = useRouter()
  const searchParams = useSearchParams()
  if (!show) return null
  
  const handelChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    push(`${pathname}?${params.toString()}`)
  }

  const generatePagesArray = () => {
    const currentPageNum = Number(currentPage)
    const totalPageNum = Number(totalPage)
    let pages:any = []

    if (totalPageNum <= 5) {
      for (let i = 1; i <= totalPageNum; i++) {
        pages.push(i)
      }
    } else {
      if (currentPageNum <= 3) {
        pages = [1, 2, 3, 4, '...', totalPageNum]
      } else if (currentPageNum >= totalPageNum - 2) {
        pages = [
          1,
          '...',
          totalPageNum - 3,
          totalPageNum - 2,
          totalPageNum - 1,
          totalPageNum,
        ]
      } else {
        pages = [
          1,
          '...',
          currentPageNum - 1,
          currentPageNum,
          currentPageNum + 1,
          '...',
          totalPageNum,
        ]
      }
    }
    return pages
  }

  return (
    <Pagination className='scale-75 md:scale-100'>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => handelChangePage(Number(currentPage) - 1)}
            disabled={Number(currentPage) === 1}
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>

        {generatePagesArray().map((page:any, index:any) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <Button
                variant={Number(currentPage) === page ? 'default' : 'ghost'}
                onClick={() => handelChangePage(Number(page))}
              >
                {page}
              </Button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => handelChangePage(Number(currentPage) + 1)}
            disabled={!HasNext}
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationControl
