import type { DashboardLowStockProduct } from '@shared/api/dashboard-api'

type LowStockCardProps = {
  products: DashboardLowStockProduct[]
}

export function LowStockCard({ products }: LowStockCardProps) {
  return (
    <section className="app-surface p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Produtos com estoque baixo</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Itens ativos que merecem reposição nas próximas compras.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {products.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
              </div>

              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                Estoque: {product.stockQuantity}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Nenhum produto ativo com estoque baixo neste momento.
          </div>
        )}
      </div>
    </section>
  )
}
