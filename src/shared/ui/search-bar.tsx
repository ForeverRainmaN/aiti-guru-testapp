import { Search } from "lucide-react"
import { cn } from "../lib"
import { Input } from "./input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)} data-testid="search-container">
      <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Найти"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border-0 bg-gray-100 pl-10 text-base placeholder:text-gray-400 focus:bg-white"
      />
    </div>
  )
}
