import { useEffect, useMemo, useState } from 'react'

import type { Product } from '@domain/entities'
import { ProductFormPanel } from '@presentation/components/products/ProductFormPanel'
import type { ProductFormValues } from '@presentation/components/products/product-form-schema'
import { ProductTable } from '@presentation/components/products/ProductTable'
import { isLowStock } from '@presentation/components/products/product-utils'
import { AppSelect } from '@presentation/components/shared/AppSelect'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { ApiError, getApiErrorMessage } from '@shared/api/http-client'
import { productsApi } from '@shared/api/products-api'

type StatusFilter = 'all' | 'active' | 'inactive'
type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'created-desc'
  | 'created-asc'
  | 'stock-asc'
  | 'stock-desc'

type Feedback = {
  type: 'success' | 'error'
  message: string
}

const pageSizeOptions = [8, 12, 20]

function resolveProductSaveErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const normalizedMessage = error.message.toLowerCase()

    if (normalizedMessage.includes('barcode') || normalizedMessage.includes('código')) {
      return 'Já existe um produto com este código de barras. Informe outro valor ou deixe o campo em branco.'
    }
  }

  return getApiErrorMessage(error, 'Não foi possível salvar o produto.')
}

export function ProductsPage() {
  const statusOptions = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'active' as const, label: 'Ativos' },
    { value: 'inactive' as const, label: 'Inativos' },
  ]

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingProductId, setProcessingProductId] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    void loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const visibleProducts = products.filter((product) => {
      const normalizedSearch = search.trim().toLowerCase()
      const barcode = product.barcode?.toLowerCase() ?? ''
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        barcode.includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive)

      return matchesSearch && matchesStatus
    })

    return [...visibleProducts].sort((left, right) => {
      switch (sortOption) {
        case 'name-desc':
          return right.name.localeCompare(left.name, 'pt-BR')
        case 'created-desc':
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        case 'created-asc':
          return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        case 'stock-asc':
          return left.stockQuantity - right.stockQuantity
        case 'stock-desc':
          return right.stockQuantity - left.stockQuantity
        case 'name-asc':
        default:
          return left.name.localeCompare(right.name, 'pt-BR')
      }
    })
  }, [products, search, sortOption, statusFilter])

  const totalFilteredProducts = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalFilteredProducts / pageSize))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [currentPage, filteredProducts, pageSize])

  const pageStart = totalFilteredProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const pageEnd = totalFilteredProducts === 0 ? 0 : pageStart + paginatedProducts.length - 1

  const totalProducts = products.length
  const activeProducts = products.filter((product) => product.isActive).length
  const lowStockProducts = products.filter((product) => isLowStock(product.stockQuantity)).length

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, sortOption, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  async function loadProducts(showLoading = true) {
    if (showLoading) {
      setIsLoading(true)
    }

    try {
      const data = await productsApi.getAll()
      setProducts(data)
      setFeedback(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível carregar os produtos.'),
      })
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
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

    const payload = {
      ...values,
      barcode: values.barcode || null,
    }

    try {
      if (selectedProduct) {
        await productsApi.update(selectedProduct.id, payload)
        setFeedback({
          type: 'success',
          message: 'Produto atualizado com sucesso.',
        })
      } else {
        await productsApi.create(payload)
        setFeedback({
          type: 'success',
          message: 'Produto cadastrado com sucesso.',
        })
      }

      await loadProducts(false)
      setIsPanelOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: resolveProductSaveErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(product: Product) {
    setFeedback(null)
    setProcessingProductId(product.id)

    try {
      await productsApi.toggleStatus(product.id)
      await loadProducts(false)
      setFeedback({
        type: 'success',
        message: product.isActive
          ? 'Produto inativado com sucesso.'
          : 'Produto reativado com sucesso.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível alterar o status do produto.'),
      })
    } finally {
      setProcessingProductId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Produtos"
          title="Catálogo de produtos"
          description="Centralize os itens da operação, acompanhe status, estoque e código de barras e mantenha o catálogo pronto para vender com agilidade."
          action={
            <button
              type="button"
              onClick={openCreatePanel}
              className="app-button-primary w-full px-5 sm:w-auto"
            >
              Novo produto
            </button>
          }
        />
      </div>

      <div className="grid gap-4 app-enter-soft-delay-1 sm:grid-cols-2 xl:grid-cols-3">
        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Visão geral
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {totalProducts}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Produtos cadastrados no catálogo atual.
          </p>
        </article>

        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700/80 dark:text-emerald-300/80">
            Status ativo
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {activeProducts}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Itens disponíveis para a operação comercial.
          </p>
        </article>

        <article className="app-surface-muted p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700/80 dark:text-amber-300/80">
            Atenção
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {lowStockProducts}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Produtos com estoque baixo e maior risco de ruptura.
          </p>
        </article>
      </div>

      <div className="app-surface p-5 sm:p-6 app-enter-soft-delay-2">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800/80 dark:text-cyan-300/80">
              Filtros e busca
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Encontre, edite e acompanhe os itens com rapidez
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Filtre por nome, categoria, código de barras ou status e acesse as ações
              principais sem perder o contexto da listagem.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
            <span className="font-semibold text-slate-950 dark:text-slate-50">
              {totalFilteredProducts}
            </span>{' '}
            {totalFilteredProducts === 1 ? 'resultado visível' : 'resultados visíveis'}
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_220px_auto]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Buscar
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por nome, categoria ou código"
              className="app-input"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </span>
            <AppSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
          </label>

          <div className="flex items-end xl:justify-end">
            <button
              type="button"
              onClick={openCreatePanel}
              className="app-button-primary w-full px-5 xl:w-auto"
            >
              Novo produto
            </button>
          </div>
        </div>

        <div className="mt-4 app-feedback-stack">
          {feedback ? <FeedbackBanner {...feedback} /> : null}
          {isLoading ? <LoadingNotice message="Carregando catálogo de produtos..." /> : null}
        </div>
      </div>

      <div className="app-enter-soft-delay-3">
        <ProductTable
          products={paginatedProducts}
          isLoading={isLoading}
          processingId={processingProductId}
          sortOption={sortOption}
          pageSize={pageSize}
          totalItems={totalFilteredProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          pageSizeOptions={pageSizeOptions}
          onEdit={openEditPanel}
          onToggleActive={handleToggleActive}
          onSortChange={setSortOption}
          onPageSizeChange={(value) => setPageSize(value)}
          onPreviousPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNextPage={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </div>

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
