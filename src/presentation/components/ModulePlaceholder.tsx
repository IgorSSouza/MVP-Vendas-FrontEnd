type ModulePlaceholderProps = {
  eyebrow: string
  title: string
  description: string
}

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Objetivo desta area</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Validar a rota, o layout e a organizacao da interface antes da implementacao real.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Status atual</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Placeholder funcional, sem regras de negocio, API ou formularios completos.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Proxima evolucao</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Receber componentes e fluxos reais do MVP conforme os modulos forem priorizados.
          </p>
        </article>
      </div>
    </section>
  )
}
