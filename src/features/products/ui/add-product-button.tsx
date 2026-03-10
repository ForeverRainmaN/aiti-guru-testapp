import { Button } from "@/shared/ui"
import { Plus } from "lucide-react"

interface AddProductButtonProps {
  onClick: () => void
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-primary hover:bg-primary-dark focus:ring-primary-light h-12 w-12 rounded-full p-0 text-white shadow-lg focus:ring-2 focus:ring-offset-2"
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}
