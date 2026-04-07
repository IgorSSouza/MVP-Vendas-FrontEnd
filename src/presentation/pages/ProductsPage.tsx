import { useEffect, useMemo, useState } from 'react'

import type { Product } from '@domain/entities'
import { productRepository } from '@infra/mock/repositories'
import { ProductFormPanel } from '@presentation/components/products/ProductFormPanel'
import type { ProductFormValues } from '@presentation/components/products/product-form-schema'
import { ProductTable } from '@presentation/components/products/ProductTable'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'

type StatusFilter = 'all' | 'active' | 'inactive'
type Feedback = {
  type: 'success' | 'error'
  message: string
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingProductId, setProcessingProductId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    void loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive)

      return matchesSearch && matchesStatus
    })
  }, [products, search, statusFilter])

  async function loadProducts() {
    setIsLoading(true)

    try {
      const data = await productRepository.getAll()
      setProducts(data)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Nao foi possivel carregar os produtos.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function openCreatePanel() {
    setSelectedProduct(null)
    setIsPanelOpen(true)
  }

  function openEditPanel(product: Product) {
    setSelectedProduct(product)
    setIsPanelOpen(true)
  }

  function closePanel() {
    if (isSubmitting) {
      return
    }

    setIsPanelOpen(false)
    setSelectedProduct(null)
  }

  async function handleSubmit(values: ProductFormValues) {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      if (selectedProduct) {
        await productRepository.update(selectedProduct.id, values)
        setFeedback({
          type: 'success',
          message: 'Produto atualizado com sucesso.',
        })
      } else {
        await productRepository.create(values)
        setFeedback({
          type: 'success',
          message: 'Produto cadastrado com sucesso.',
        })
      }

      await loadProducts()
      setIsPanelOpen(false)
      setSelectedProduct(null)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Nao foi possivel salvar o produto.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(product: Product) {
    setFeedback(null)
    setProcessingProductId(product.id)

    try {
      await productRepository.toggleActive(product.id)
      await loadProducts()
      setFeedback({
        type: 'success',
        message: product.isActive
          ? 'Produto inativado com sucesso.'
          : 'Produto reativado com sucesso.',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Nao foi possivel alterar o status do produto.',
      })
    } finally {
      setProcessingProductId(null)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Produtos"
        title="Catalogo de produtos"
        description="Gerencie os produtos da loja com uma operacao simples de cadastro, edicao, status e consulta rapida."
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] xl:w-full xl:max-w-3xl">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Buscar</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o nome ou a categoria"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={openCreatePanel}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Novo produto
          </button>
        </div>

        {feedback ? <div className="mt-4"><FeedbackBanner {...feedback} /></div> : null}
        {isLoading ? <div className="mt-4"><LoadingNotice message="Carregando lista de produtos..." /></div> : null}
      </div>

      <ProductTable
        products={filteredProducts}
        isLoading={isLoading}
        processingId={processingProductId}
        onEdit={openEditPanel}
        onToggleActive={handleToggleActive}
      />

      <ProductFormPanel
        isOpen={isPanelOpen}
        product={selectedProduct}
        isSubmitting={isSubmitting}
        onClose={closePanel}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
