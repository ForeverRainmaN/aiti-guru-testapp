import { Input } from "@/shared/ui"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Найти" }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-4 pl-10 text-lg placeholder:text-gray-400 focus:bg-white"
      />
    </div>
  )
}
