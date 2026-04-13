import { useEffect, useMemo, useState } from 'react'

import {
  calculateSaleItemProfit,
  calculateSaleItemSubtotal,
  calculateSaleProfit,
  calculateSaleSubtotal,
  calculateSaleTotal,
} from '@application/calculators'
import type { Product, SaleItem, Service } from '@domain/entities'
import { PaymentMethod, SaleItemType } from '@domain/enums'
import { SaleCatalogSection } from '@presentation/components/sales/SaleCatalogSection'
import { SaleItemsList } from '@presentation/components/sales/SaleItemsList'
import { SaleSummaryCard } from '@presentation/components/sales/SaleSummaryCard'
import { formatCurrency } from '@presentation/components/sales/sale-utils'
import { FeedbackBanner } from '@presentation/components/shared/FeedbackBanner'
import { LoadingNotice } from '@presentation/components/shared/LoadingNotice'
import { PageHeader } from '@presentation/components/shared/PageHeader'
import { getApiErrorMessage } from '@shared/api/http-client'
import { productsApi } from '@shared/api/products-api'
import { salesApi } from '@shared/api/sales-api'
import { servicesApi } from '@shared/api/services-api'

type DraftSaleItem = Omit<SaleItem, 'id'> & {
  availableStock?: number
}

type Feedback = {
  type: 'success' | 'error'
  message: string
}

function getPaymentMethodName(paymentMethod: PaymentMethod) {
  switch (paymentMethod) {
    case PaymentMethod.PIX:
      return 'Pix'
    case PaymentMethod.CASH:
      return 'Dinheiro'
    case PaymentMethod.DEBIT_CARD:
      return 'Cartão de débito'
    case PaymentMethod.CREDIT_CARD:
      return 'Cartão de crédito'
    default:
      return paymentMethod
  }
}

export function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [items, setItems] = useState<DraftSaleItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [lastAddedLabel, setLastAddedLabel] = useState<string | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    if (!lastAddedLabel) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setLastAddedLabel(null)
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [lastAddedLabel])

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  )

  const activeServices = useMemo(
    () => services.filter((service) => service.isActive),
    [services],
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = productSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return activeProducts
    }

    return activeProducts.filter((product) => {
      const barcode = product.barcode?.toLowerCase() ?? ''

      return (
        product.name.toLowerCase().includes(normalizedSearch) ||
        barcode.includes(normalizedSearch)
      )
    })
  }, [activeProducts, productSearch])

  const filteredServices = useMemo(() => {
    const normalizedSearch = serviceSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return activeServices
    }

    return activeServices.filter((service) =>
      service.name.toLowerCase().includes(normalizedSearch),
    )
  }, [activeServices, serviceSearch])

  const summary = useMemo(() => {
    const subtotal = calculateSaleSubtotal(items)
    const sanitizedDiscount = Math.max(discount, 0)
    const total = calculateSaleTotal(subtotal, sanitizedDiscount)
    const profit = calculateSaleProfit(items, sanitizedDiscount)

    return {
      subtotal,
      discount: sanitizedDiscount,
      total,
      profit,
    }
  }, [discount, items])

  async function loadData(showLoading = true) {
    if (showLoading) {
      setIsLoading(true)
    }

    try {
      const [productData, serviceData] = await Promise.all([
        productsApi.getAll(),
        servicesApi.getAll(),
      ])

      setProducts(productData)
      setServices(serviceData)
      setFeedback(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível carregar os dados para a venda.'),
      })
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  function recalculateItem(item: {
    itemType: SaleItem['itemType']
    itemId: string
    name: string
    quantity: number
    unitCostPrice: number
    unitSalePrice: number
    availableStock?: number
  }): DraftSaleItem {
    return {
      ...item,
      subtotal: calculateSaleItemSubtotal(item.quantity, item.unitSalePrice),
      profit: calculateSaleItemProfit(item.quantity, item.unitCostPrice, item.unitSalePrice),
    }
  }

  function findProductStock(itemId: string) {
    return products.find((product) => product.id === itemId)?.stockQuantity ?? 0
  }

  function addProduct(product: Product) {
    setFeedback(null)

    if (product.stockQuantity <= 0) {
      setFeedback({
        type: 'error',
        message: 'Este produto está sem estoque disponível.',
      })
      return
    }

    setLastAddedLabel(product.name)

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.itemId === product.id)

      if (existingItem) {
        if (existingItem.quantity >= product.stockQuantity) {
          setFeedback({
            type: 'error',
            message: 'Quantidade solicitada maior que o estoque disponível.',
          })
          return currentItems
        }

        return currentItems.map((item) =>
          item.itemId === product.id
            ? recalculateItem({
                ...item,
                quantity: item.quantity + 1,
                availableStock: product.stockQuantity,
              })
            : item,
        )
      }

      return [
        ...currentItems,
        recalculateItem({
          itemType: SaleItemType.PRODUCT,
          itemId: product.id,
          name: product.name,
          quantity: 1,
          unitCostPrice: product.costPrice,
          unitSalePrice: product.salePrice,
          availableStock: product.stockQuantity,
        }),
      ]
    })
  }

  function addService(service: Service) {
    setFeedback(null)
    setLastAddedLabel(service.name)

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.itemId === service.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.itemId === service.id
            ? recalculateItem({
                ...item,
                quantity: item.quantity + 1,
              })
            : item,
        )
      }

      return [
        ...currentItems,
        recalculateItem({
          itemType: SaleItemType.SERVICE,
          itemId: service.id,
          name: service.name,
          quantity: 1,
          unitCostPrice: service.costPrice,
          unitSalePrice: service.salePrice,
        }),
      ]
    })
  }

  function handleQuantityChange(itemId: string, quantity: number) {
    setFeedback(null)

    if (!Number.isFinite(quantity) || quantity < 1) {
      setFeedback({
        type: 'error',
        message: 'A quantidade mínima para cada item é 1.',
      })
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.itemId !== itemId) {
          return item
        }

        if (item.itemType === SaleItemType.PRODUCT) {
          const availableStock = findProductStock(item.itemId)

          if (quantity > availableStock) {
            setFeedback({
              type: 'error',
              message: 'Quantidade solicitada maior que o estoque disponível.',
            })
            return item
          }

          return recalculateItem({
            ...item,
            quantity,
            availableStock,
          })
        }

        return recalculateItem({
          ...item,
          quantity,
        })
      }),
    )
  }

  function handleRemoveItem(itemId: string) {
    setFeedback(null)
    setItems((currentItems) => currentItems.filter((item) => item.itemId !== itemId))
  }

  async function handleSubmit() {
    setFeedback(null)

    if (!items.length) {
      setFeedback({
        type: 'error',
        message: 'Adicione pelo menos um item antes de finalizar a venda.',
      })
      return
    }

    if (summary.discount > summary.subtotal) {
      setFeedback({
        type: 'error',
        message: 'O desconto não pode ser maior que o subtotal da venda.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await salesApi.create({
        items: items.map((item) => ({
          itemType: item.itemType,
          itemId: item.itemId,
          quantity: item.quantity,
        })),
        paymentMethod,
        discount: summary.discount,
      })

      await loadData(false)

      setItems([])
      setDiscount(0)
      setPaymentMethod(PaymentMethod.PIX)
      setLastAddedLabel(null)
      setFeedback({
        type: 'success',
        message: 'Venda finalizada com sucesso.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'Não foi possível finalizar a venda.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="app-enter-soft">
        <PageHeader
          eyebrow="Nova venda"
          title="Montar venda"
          description="Selecione itens, configure a venda e finalize com clareza, mantendo o fluxo rápido mesmo com muitos produtos e serviços."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner {...feedback} /> : null}
        {isLoading ? (
          <LoadingNotice message="Carregando produtos e serviços para a venda..." />
        ) : null}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_420px]">
        <div className="space-y-6 app-enter-soft-delay-2">
          <section className="app-surface p-5">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700/80 dark:text-cyan-300/80">
                  1. Escolha os itens
                </p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                  Busque produtos e serviços com mais agilidade
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Use as buscas abaixo para localizar rapidamente o que deseja vender e adicionar à operação.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                    Itens na venda
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                    {items.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                    Pagamento atual
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-950 dark:text-slate-50">
                    {getPaymentMethodName(paymentMethod)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                    Total parcial
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                    {formatCurrency(summary.total)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <SaleCatalogSection
              title="Produtos ativos"
              description="Busque e selecione produtos disponíveis em estoque para compor a venda."
              searchValue={productSearch}
              searchPlaceholder="Buscar produto por nome ou código"
              onSearchChange={setProductSearch}
              items={filteredProducts.map((product) => ({
                ...product,
                type: SaleItemType.PRODUCT,
              }))}
              totalItems={activeProducts.length}
              emptyMessage={
                productSearch
                  ? 'Nenhum produto encontrado para esta busca.'
                  : isLoading
                    ? 'Carregando produtos...'
                    : 'Nenhum produto ativo disponível.'
              }
              isDisabled={isLoading || isSubmitting}
              onAdd={(item) => addProduct(item as Product)}
            />

            <SaleCatalogSection
              title="Serviços ativos"
              description="Busque e selecione serviços da assistência técnica para o pedido."
              searchValue={serviceSearch}
              searchPlaceholder="Buscar serviço pelo nome"
              onSearchChange={setServiceSearch}
              items={filteredServices.map((service) => ({
                ...service,
                type: SaleItemType.SERVICE,
              }))}
              totalItems={activeServices.length}
              emptyMessage={
                serviceSearch
                  ? 'Nenhum serviço encontrado para esta busca.'
                  : isLoading
                    ? 'Carregando serviços...'
                    : 'Nenhum serviço ativo disponível.'
              }
              isDisabled={isLoading || isSubmitting}
              onAdd={(item) => addService(item as Service)}
            />
          </div>

          <section className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700/80 dark:text-cyan-300/80">
                2. Revise os itens
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                Ajuste quantidades e valide a composição da venda
              </h2>
            </div>

            <SaleItemsList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              lastAddedLabel={lastAddedLabel}
            />
          </section>
        </div>

        <div className="app-enter-soft-delay-3">
          <SaleSummaryCard
            discount={discount}
            subtotal={summary.subtotal}
            total={summary.total}
            profit={summary.profit}
            paymentMethod={paymentMethod}
            isSubmitting={isSubmitting}
            canSubmit={items.length > 0}
            onDiscountChange={(value) => {
              setFeedback(null)
              setDiscount(Math.max(value, 0))
            }}
            onPaymentMethodChange={setPaymentMethod}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  )
}
