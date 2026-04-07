import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Service } from '@domain/entities'
import { CurrencyInput } from '@presentation/components/shared/CurrencyInput'
import { serviceFormSchema, type ServiceFormValues } from '@presentation/components/services/service-form-schema'

type ServiceFormPanelProps = {
  isOpen: boolean
  service: Service | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (values: ServiceFormValues) => Promise<void>
}

const defaultValues: ServiceFormValues = {
  name: '',
  description: '',
  costPrice: 0,
  salePrice: 0,
  isActive: true,
}

export function ServiceFormPanel({
  isOpen,
  service,
  isSubmitting,
  onClose,
  onSubmit,
}: ServiceFormPanelProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    defaultValues,
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (service) {
      reset({
        name: service.name,
        description: service.description,
        costPrice: service.costPrice,
        salePrice: service.salePrice,
        isActive: service.isActive,
      })

      return
    }

    reset(defaultValues)
  }, [isOpen, reset, service])

  async function handleValidSubmit(values: ServiceFormValues) {
    const parsedValues = serviceFormSchema.safeParse(values)

    if (!parsedValues.success) {
      parsedValues.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]

        if (typeof fieldName === 'string') {
          setError(fieldName as keyof ServiceFormValues, {
            type: 'manual',
            message: issue.message,
          })
        }
      })

      return
    }

    await onSubmit({
      ...parsedValues.data,
      description: parsedValues.data.description ?? '',
    })
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
                Servicos
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {service ? 'Editar servico' : 'Novo servico'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Preencha os dados principais para manter os servicos organizados.
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
                placeholder="Ex.: Troca de bateria"
              />
              {errors.name ? <span className="text-sm text-rose-600">{errors.name.message}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Descricao</span>
              <textarea
                {...register('description')}
                rows={4}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                placeholder="Detalhes breves sobre o servico"
              />
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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-200"
              />
              <span className="text-sm font-medium text-slate-700">Servico ativo</span>
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
                {isSubmitting ? 'Salvando...' : service ? 'Salvar alteracoes' : 'Cadastrar servico'}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </>
  )
}
