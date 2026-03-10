import { AddProductButton } from "./add-product-button"
import { SearchBar } from "./search-bar"

interface ProductsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
}

export function ProductsHeader({ searchQuery, onSearchChange, onAddClick }: ProductsHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
      <div className="flex items-center gap-4">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <AddProductButton onClick={onAddClick} />
      </div>
    </div>
  )
}
