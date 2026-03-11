import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  total: number
  skip: number
  limit: number
  onPageChange: (page: number) => void
}
export function Pagination({
  currentPage,
  totalPages,
  total,
  skip,
  limit,
  onPageChange
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1)
  const from = skip + 1
  const to = Math.min(skip + limit, total)
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-gray-label text-sm">
        Показано {from}-{to} из {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-gray-border h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 w-8 text-sm",
              currentPage === page
                ? "bg-primary text-white hover:bg-blue-700"
                : "border-gray-border text-gray-label bg-white hover:bg-gray-100"
            )}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-gray-border h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
