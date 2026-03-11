import { zodResolver } from "@hookform/resolvers/zod"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, Input, NumberInput } from "@/shared/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"

import { ProductFormSchema, type Product, type ProductFormData } from "../model/schema"

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialData: O.Option<Product>
  onSave: (data: ProductFormData, id?: number) => void
}

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSave
}: ProductFormModalProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: "",
      price: 0,
      brand: "",
      sku: ""
    }
  })

  useEffect(() => {
    if (open) {
      pipe(
        initialData,
        O.fold(
          () => form.reset({ title: "", price: 0, brand: "", sku: "" }),
          (product) =>
            form.reset({
              title: product.title,
              price: product.price,
              brand: product.brand ?? "",
              sku: product.sku ?? ""
            })
        )
      )
      form.clearErrors()
    }
  }, [open, initialData, form])

  const onSubmit = useCallback(
    (values: ProductFormData) => {
      const cleanedData = {
        ...values,
        brand: values.brand || undefined,
        sku: values.sku || undefined
      }
      const id = pipe(
        initialData,
        O.fold(
          () => undefined,
          (product) => product.id
        )
      )
      onSave(cleanedData, id)
      onOpenChange(false)
    },
    [initialData, onSave, onOpenChange]
  )

  const descriptionId = "product-form-description"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 sm:max-w-md" aria-describedby={descriptionId}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Добавить товар" : "Редактировать товар"}
          </DialogTitle>
          <p id={descriptionId} className="sr-only">
            {mode === "add"
              ? "Форма для добавления нового товара"
              : "Форма для редактирования товара. Измените необходимые поля"}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Наименование</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название"
                      className="border-gray-border focus:border-primary-light mt-1 w-full rounded-md shadow-sm focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? undefined}
                      onValueChange={(val) => field.onChange(val)}
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator=" "
                      hideStepper
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Вендор</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Бренд (опционально)"
                      className="border-gray-border focus:border-primary-light mt-1 w-full rounded-md shadow-sm focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-sm font-medium text-gray-700">Артикул</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Артикул (опционально)"
                      className="border-gray-border focus:border-primary-light mt-1 w-full rounded-md shadow-sm focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />

            <div className="mt-2 flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                aria-label="Закрыть форму без сохранения"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                aria-label={mode === "add" ? "Добавить товар" : "Сохранить изменения"}
              >
                {mode === "add" ? "Добавить" : "Сохранить"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
