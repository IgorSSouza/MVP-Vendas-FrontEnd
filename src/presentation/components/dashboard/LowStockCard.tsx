import type { Product } from '@domain/entities'

type LowStockCardProps = {
  products: Product[]
}

export function LowStockCard({ products }: LowStockCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Produtos com estoque baixo</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Itens ativos que merecem reposicao nas proximas compras.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {products.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{product.name}</p>
                <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              </div>

              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Estoque: {product.stockQuantity}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Nenhum produto ativo com estoque baixo neste momento.
          </div>
        )}
      </div>
    </section>
  )
}
