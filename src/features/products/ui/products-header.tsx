import { SearchBar } from "@/shared/ui"

interface ProductsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function ProductsHeader({ searchQuery, onSearchChange }: ProductsHeaderProps) {
  return (
    <div className="mb-8 flex h-24 items-center rounded-lg bg-white px-8 shadow-sm">
      <div className="w-40">
        <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
      </div>
      <div className="flex flex-1 justify-center">
        <SearchBar value={searchQuery} onChange={onSearchChange} className="w-full max-w-xl" />
      </div>
    </div>
  )
}
