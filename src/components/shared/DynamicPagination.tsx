import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DynamicPaginationProps {
  pageSize: number
  setPageSize: (size: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
}

export function DynamicPagination({
  pageSize,
  setPageSize,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: DynamicPaginationProps) {
  
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || 0)

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left section: Rows per page */}
      <div className="flex items-center space-x-2">
        <p className="text-xs font-medium text-black">Rows per page</p>
        <Select
          value={pageSize ? pageSize.toString() : ""}
          onValueChange={(value) => {
            setPageSize(Number(value))
            onPageChange(1) 
          }}
        >
          <SelectTrigger className="h-8 w-[80px] bg-white text-black font-medium rounded-lg shadow-sm text-xs border border-zinc-200">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent side="top" className="rounded-lg">
            {[100, 200, 300, 400, 500, 1000].map((size) => (
              <SelectItem key={size} value={size.toString()} className="text-xs text-black">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Optional: Show item range */}
        {totalItems && totalItems > 0 && (
          <span className="text-xs text-black ml-4">
            {startItem}-{endItem} of {totalItems}
          </span>
        )}
      </div>

      {/* Right section: Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Page counter display */}
        <div className="text-xs font-medium text-black min-w-[90px] text-center">
          Page <span className="font-semibold">{currentPage}</span> of{" "}
          <span className="font-semibold">{totalPages || 1}</span>
        </div>

        {/* Arrow Button controls */}
        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white border border-zinc-700 text-black hover:bg-zinc-50 shadow-md transition-colors"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white border border-zinc-700 text-black hover:bg-zinc-50 shadow-md transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white border border-zinc-700 text-black hover:bg-zinc-50 shadow-md transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4 text-black" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-white border border-zinc-700 text-black hover:bg-zinc-50 shadow-md transition-colors"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>
    </div>
  )
}