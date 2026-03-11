import { Button } from "@/shared/ui"
import { Plus } from "lucide-react"

interface AddProductButtonProps {
  onClick: () => void
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-primary hover:bg-primary-dark h-10 gap-2 rounded-md px-4 text-white"
    >
      <Plus className="h-5 w-5" />
      <span className="text-sm font-medium">Добавить</span>
    </Button>
  )
}
