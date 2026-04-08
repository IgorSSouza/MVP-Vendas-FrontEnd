import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@app/providers/AuthProvider'
import { AuthShell } from '@presentation/components/auth/AuthShell'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { getApiErrorMessage } from '@shared/api/http-client'
import { appBrand } from '@shared/constants/app-brand'
import { appRoutes } from '@shared/constants/app-routes'

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
const CAROUSEL_INTERVAL_MS = 5200

function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity Services indisponível.'))
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as
      | HTMLScriptElement
      | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Falha ao carregar o login do Google.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Falha ao carregar o login do Google.'))
    document.head.appendChild(script)
  })
}

function resolvePostLoginPath(
  requestedPathname: string | undefined,
  needsCompanySetup: boolean,
) {
  if (needsCompanySetup) {
    return appRoutes.setupCompany
  }

  if (
    requestedPathname &&
    requestedPathname !== appRoutes.login &&
    requestedPathname !== appRoutes.setupCompany
  ) {
    return requestedPathname
  }

  return appRoutes.dashboard
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const { signInWithGoogle } = useAuth()
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const carouselSlides = useMemo(
    () => [
      {
        eyebrow: 'Dashboard',
        title: 'Gestão completa da operação em um painel simples.',
        metrics: [
          { label: 'Receita do dia', value: 'R$ 2.450' },
          { label: 'Itens vendidos', value: '87' },
          { label: 'Clientes ativos', value: '32' },
        ],
      },
      {
        eyebrow: 'Catálogo',
        title: 'Produtos e serviços organizados em uma base consistente.',
        metrics: [
          { label: 'Produtos ativos', value: '148' },
          { label: 'Serviços ativos', value: '36' },
          { label: 'Baixo estoque', value: '5' },
        ],
      },
      {
        eyebrow: 'Vendas',
        title: 'Fluxo rápido para vender, acompanhar histórico e resultado.',
        metrics: [
          { label: 'Vendas do mês', value: '214' },
          { label: 'Ticket médio', value: 'R$ 186' },
          { label: 'Lucro estimado', value: 'R$ 18,2 mil' },
        ],
      },
    ],
    [],
  )

  const requestedPathname = useMemo(() => {
    const fromState = location.state as { from?: { pathname?: string } } | null
    return fromState?.from?.pathname
  }, [location.state])

  useEffect(() => {
    let isCancelled = false

    async function setupGoogleSignIn() {
      if (!GOOGLE_CLIENT_ID) {
        setErrorMessage(
          'Configure o VITE_GOOGLE_CLIENT_ID para habilitar o login com Google.',
        )
        return
      }

      try {
        await loadGoogleIdentityScript()

        if (isCancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          cancel_on_tap_outside: true,
          auto_select: false,
          callback: async ({ credential }) => {
            if (!credential) {
              setErrorMessage(
                'Não foi possível receber a credencial do Google. Tente novamente.',
              )
              return
            }

            setIsSubmitting(true)
            setErrorMessage(null)

            try {
              const session = await signInWithGoogle(credential)
              navigate(
                resolvePostLoginPath(requestedPathname, session.needsCompanySetup),
                { replace: true },
              )
            } catch (error) {
              setErrorMessage(
                getApiErrorMessage(
                  error,
                  'Não foi possível concluir o login com Google. Tente novamente.',
                ),
              )
            } finally {
              setIsSubmitting(false)
            }
          },
        })

        googleButtonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 280,
        })

        setIsGoogleReady(true)
      } catch (error) {
        if (isCancelled) {
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o login com Google.',
        )
      }
    }

    void setupGoogleSignIn()

    return () => {
      isCancelled = true
    }
  }, [navigate, requestedPathname, signInWithGoogle])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length)
    }, CAROUSEL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [carouselSlides.length])

  const activeShowcase = carouselSlides[activeSlide]

  const showcase = (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_32px_90px_-44px_rgba(8,15,35,0.72)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/90">
            {activeShowcase.eyebrow}
          </p>
          <h3 className="mt-3 max-w-[520px] text-[clamp(1.6rem,2.4vw,2.1rem)] font-semibold leading-[1.08] tracking-tight text-white">
            {activeShowcase.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              setActiveSlide((current) =>
                current === 0 ? carouselSlides.length - 1 : current - 1,
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
            aria-label="Slide anterior"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path
                d="M11.75 5.75L7.5 10L11.75 14.25"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setActiveSlide((current) => (current + 1) % carouselSlides.length)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
            aria-label="Próximo slide"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path
                d="M8.25 5.75L12.5 10L8.25 14.25"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-white/8 bg-slate-900/72 p-4 shadow-inner shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold tracking-[0.14em] text-cyan-200">
            {appBrand.shortName}
          </div>
          <div>
            <p className="text-base font-semibold text-white">Gestão de Vendas</p>
            <p className="mt-1 text-sm text-slate-400">Base operacional integrada</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 md:grid-cols-3">
          {activeShowcase.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[16px] border border-white/8 bg-white/[0.02] px-3 py-3"
            >
              <p className="text-[12px] text-slate-400">{metric.label}</p>
              <p className="mt-1 text-[1.2rem] font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-5 overflow-hidden rounded-[20px] border border-white/8 bg-slate-950/55 px-3.5 py-3.5">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.15),transparent_65%)]" />

          <div className="grid grid-cols-[1.05fr_0.75fr_0.75fr] gap-3">
            <div className="border-r border-white/8 pr-3">
              <p className="text-[12px] font-medium text-slate-300">Vendas do dia</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-[1.15rem] font-semibold text-white">R$ 2.450,00</p>
                <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                  +24%
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-400/80" />
                <span className="h-3 w-8 rounded-full bg-cyan-400/50" />
                <span className="h-3 w-14 rounded-full bg-white/15" />
              </div>
            </div>

            <div>
              <p className="text-[1.15rem] font-semibold text-white">87</p>
              <p className="mt-2 text-[11px] text-slate-300">Itens vendidos</p>
            </div>

            <div>
              <p className="text-[1.15rem] font-semibold text-white">32</p>
              <p className="mt-2 text-[11px] text-slate-300">Clientes ativos</p>
            </div>
          </div>

          <div className="relative mt-3 min-h-[84px] overflow-hidden rounded-[18px] border border-white/8 bg-slate-950/55">
            <svg viewBox="0 0 640 180" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="login-chart-main" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(56,189,248,0.2)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0.95)" />
                </linearGradient>
                <linearGradient id="login-chart-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(37,99,235,0.14)" />
                  <stop offset="100%" stopColor="rgba(56,189,248,0.38)" />
                </linearGradient>
              </defs>
              <path
                d="M0 150 C 68 126, 102 134, 146 120 S 232 90, 286 104 S 388 134, 436 112 S 532 86, 640 58"
                fill="none"
                stroke="url(#login-chart-secondary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 124 C 56 98, 108 110, 152 86 S 240 92, 286 72 S 372 48, 430 60 S 532 42, 640 16"
                fill="none"
                stroke="url(#login-chart-main)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {carouselSlides.map((slide, index) => (
          <button
            key={slide.eyebrow}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={[
              'h-2.5 rounded-full transition',
              index === activeSlide ? 'w-10 bg-cyan-300' : 'w-2.5 bg-white/20',
            ].join(' ')}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )

  return (
    <AuthShell
      eyebrow="Acesso ao sistema"
      title={appBrand.systemName}
      description="Acesse com sua conta Google para entrar no ambiente da sua empresa."
      highlights={[]}
      showcase={showcase}
    >
      <div className="rounded-[30px] border border-white/10 bg-slate-900/92 p-5 text-white shadow-[0_32px_90px_-38px_rgba(8,15,35,0.85)] backdrop-blur-sm sm:p-6">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-base font-semibold tracking-[0.14em] text-cyan-200">
            {appBrand.shortName}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
              Entrar
            </p>
            <p className="text-sm text-slate-300">Ambiente protegido</p>
          </div>
        </div>

        <h2 className="mt-6 text-[1.35rem] font-semibold tracking-tight text-white">
          Entre com sua conta
        </h2>
        <p className="mt-3 text-[13px] leading-6 text-slate-300">
          Continue com Google para acessar sua empresa e concluir o primeiro acesso quando necessário.
        </p>

        <div className="app-feedback-stack mt-6">
          {errorMessage ? <FeedbackBanner type="error" message={errorMessage} /> : null}
        </div>

        <div className="mt-5 rounded-[22px] border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-base font-semibold text-white">Google</p>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-300">
              OAuth
            </span>
          </div>

          <p className="mt-3 text-[13px] leading-6 text-slate-300">
            A sessão é validada pela API e continua automaticamente para o dashboard ou para a configuração inicial.
          </p>

          <div className="mt-5 flex justify-center">
            <div className="relative w-full max-w-[270px]">
              <div className="absolute inset-x-4 -bottom-3 h-px bg-cyan-300/85 shadow-[0_0_22px_rgba(34,211,238,0.95)]" />
              <div
                ref={googleButtonRef}
                className={[
                  'relative min-h-[44px] overflow-hidden rounded-2xl transition',
                  isGoogleReady ? 'opacity-100' : 'opacity-60',
                ].join(' ')}
              />
            </div>
          </div>

          {isSubmitting ? (
            <p className="mt-4 text-center text-sm font-medium text-slate-300">
              Validando acesso...
            </p>
          ) : null}

          {!isGoogleReady && !errorMessage ? (
            <p className="mt-4 text-center text-sm text-slate-400">Carregando Google...</p>
          ) : null}
        </div>

        <p className="mt-6 text-[13px] leading-6 text-slate-300">
          Se ainda não houver empresa vinculada, você continuará para a configuração inicial.
        </p>
      </div>
    </AuthShell>
  )
}
