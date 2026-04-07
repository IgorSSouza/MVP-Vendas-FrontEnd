import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Service } from '@domain/entities'
import { AppPortal } from '@presentation/components/shared/AppPortal'
import { CurrencyInput } from '@presentation/components/shared/CurrencyInput'
import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
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
    <AppPortal>
      <div
        className={[
          'app-overlay',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'app-drawer max-w-md border-l border-slate-200/80',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="app-panel-header">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/80">
                Serviços
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                {service ? 'Editar serviço' : 'Novo serviço'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Preencha os dados principais para manter os serviços organizados.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="app-button-secondary w-full rounded-xl px-3 py-2 sm:w-auto"
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
                className="app-input"
                placeholder="Ex.: Troca de bateria"
              />
              {errors.name ? <span className="text-sm text-rose-600">{errors.name.message}</span> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Descrição</span>
              <textarea
                {...register('description')}
                rows={4}
                className="app-textarea"
                placeholder="Detalhes breves sobre o serviço"
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
                <span className="text-sm font-medium text-slate-700">Preço de venda</span>
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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 shadow-sm">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-200"
              />
              <span className="text-sm font-medium text-slate-700">Serviço ativo</span>
            </label>
          </div>

          <div className="mt-auto border-t border-slate-200/80 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="app-button-secondary w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="app-button-primary w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? <InlineSpinner className="h-4 w-4" /> : null}
                  <span>
                    {isSubmitting
                      ? 'Salvando...'
                      : service
                        ? 'Salvar alterações'
                        : 'Cadastrar serviço'}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </aside>
    </AppPortal>
  )
}
