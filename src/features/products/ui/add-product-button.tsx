import { Button } from "@/shared/ui"
import { PlusCircle } from "lucide-react"

type AddProductButtonProps = {
  onClick: () => void
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-primary h-10 gap-2 rounded-md px-4 text-white hover:bg-blue-700"
    >
      <PlusCircle className="h-5 w-5" />
      <span className="text-sm font-medium">Добавить</span>
    </Button>
  )
}
