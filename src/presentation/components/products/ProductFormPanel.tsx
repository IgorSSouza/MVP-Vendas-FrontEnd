import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Product } from '@domain/entities'

import { CurrencyInput } from '@presentation/components/shared/CurrencyInput'
import { productFormSchema, type ProductFormValues } from '@presentation/components/products/product-form-schema'

type ProductFormPanelProps = {
  isOpen: boolean
  product: Product | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (values: ProductFormValues) => Promise<void>
}

const defaultValues: ProductFormValues = {
  name: '',
  category: '',
  costPrice: 0,
  salePrice: 0,
  stockQuantity: 0,
  isActive: true,
}

export function ProductFormPanel({
  isOpen,
  product,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormPanelProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues,
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (product) {
      reset({
        name: product.name,
        category: product.category,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
      })

      return
    }

    reset(defaultValues)
  }, [isOpen, product, reset])

  async function handleValidSubmit(values: ProductFormValues) {
    const parsedValues = productFormSchema.safeParse(values)

    if (!parsedValues.success) {
      parsedValues.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]

        if (typeof fieldName === 'string') {
          setError(fieldName as keyof ProductFormValues, {
            type: 'manual',
            message: issue.message,
          })
        }
      })

      return
    }

    await onSubmit(parsedValues.data)
  }

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-slate-950/40 transition',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                Produtos
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {product ? 'Editar produto' : 'Novo produto'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados principais para manter o catalogo organizado.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 sm:w-auto"
            >
              Fechar
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="grid gap-5 px-4 py-6 sm:px-6">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Nome</span>
              <input
                {...register('name')}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="Ex.: Cabo USB-C 1m"
              />
              {errors.name ? <span className="text-sm text-rose-600">{errors.name.message}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Categoria</span>
              <input
                {...register('category')}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="Ex.: Carregadores"
              />
              {errors.category ? (
                <span className="text-sm text-rose-600">{errors.category.message}</span>
              ) : null}
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Custo</span>
                <Controller
                  control={control}
                  name="costPrice"
                  render={({ field }) => (
                    <CurrencyInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.costPrice ? (
                  <span className="text-sm text-rose-600">{errors.costPrice.message}</span>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Preco de venda</span>
                <Controller
                  control={control}
                  name="salePrice"
                  render={({ field }) => (
                    <CurrencyInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.salePrice ? (
                  <span className="text-sm text-rose-600">{errors.salePrice.message}</span>
                ) : null}
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Estoque</span>
              <input
                {...register('stockQuantity', { valueAsNumber: true })}
                type="number"
                min="0"
                step="1"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
              {errors.stockQuantity ? (
                <span className="text-sm text-rose-600">{errors.stockQuantity.message}</span>
              ) : null}
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-200"
              />
              <span className="text-sm font-medium text-slate-700">Produto ativo</span>
            </label>
          </div>

          <div className="mt-auto border-t border-slate-200 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? 'Salvando...' : product ? 'Salvar alteracoes' : 'Cadastrar produto'}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </>
  )
}
