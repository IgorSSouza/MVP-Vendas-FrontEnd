import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@app/providers/AuthProvider'
import { AuthShell } from '@presentation/components/auth/AuthShell'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'
import {
  setupCompanyFormSchema,
  type SetupCompanyFormValues,
} from '@presentation/pages/setup-company-form-schema'
import { getApiErrorMessage } from '@shared/api/http-client'
import { appBrand } from '@shared/constants/app-brand'
import { appRoutes } from '@shared/constants/app-routes'

const defaultValues: SetupCompanyFormValues = {
  name: '',
  cnpj: '',
}

export function SetupCompanyPage() {
  const navigate = useNavigate()
  const { completeCompanySetup, signOut } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SetupCompanyFormValues>({
    defaultValues,
  })

  async function handleValidSubmit(values: SetupCompanyFormValues) {
    setFeedback(null)

    const parsedValues = setupCompanyFormSchema.safeParse(values)

    if (!parsedValues.success) {
      parsedValues.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]

        if (typeof fieldName === 'string') {
          setError(fieldName as keyof SetupCompanyFormValues, {
            type: 'manual',
            message: issue.message,
          })
        }
      })

      return
    }

    setIsSubmitting(true)

    try {
      await completeCompanySetup(parsedValues.data)
      setFeedback({
        type: 'success',
        message: 'Empresa configurada com sucesso. Redirecionando para o dashboard...',
      })
      navigate(appRoutes.dashboard, { replace: true })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(
          error,
          'Não foi possível concluir a configuração inicial da empresa.',
        ),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Primeiro acesso"
      title={`Vamos conectar sua empresa no ${appBrand.systemName}`}
      description="Falta apenas cadastrar a empresa para trocar o token temporário pela sessão final da API e liberar o sistema."
      highlights={['Nome da empresa', 'CNPJ validado', 'Entrada no dashboard']}
    >
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.22)] dark:border-slate-800/80 dark:bg-slate-900/95 dark:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-800/80 dark:text-cyan-300/80">
              Empresa
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Configuração inicial
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              signOut()
              navigate(appRoutes.login, { replace: true })
            }}
            className="app-button-secondary rounded-xl px-3 py-2"
          >
            Sair
          </button>
        </div>

        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          Informe os dados principais da empresa para concluir o primeiro acesso.
        </p>

        <div className="app-feedback-stack mt-6">
          {feedback ? <FeedbackBanner type={feedback.type} message={feedback.message} /> : null}
        </div>

        <form onSubmit={handleSubmit(handleValidSubmit)} className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Nome da empresa
            </span>
            <input
              {...register('name')}
              className="app-input"
              placeholder="Ex.: IS Assistência Técnica"
            />
            {errors.name ? (
              <span className="text-sm text-rose-600">{errors.name.message}</span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              CNPJ
            </span>
            <input
              {...register('cnpj')}
              inputMode="numeric"
              className="app-input"
              placeholder="Somente números ou formato livre"
            />
            <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              O envio é normalizado automaticamente para 14 dígitos.
            </span>
            {errors.cnpj ? (
              <span className="text-sm text-rose-600">{errors.cnpj.message}</span>
            ) : null}
          </label>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-400">
            Ao concluir este passo, sua sessão de onboarding será substituída pelo token final da empresa.
          </div>

          <button type="submit" disabled={isSubmitting} className="app-button-primary">
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? <InlineSpinner className="h-4 w-4" /> : null}
              <span>{isSubmitting ? 'Configurando empresa...' : 'Concluir configuração'}</span>
            </span>
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
