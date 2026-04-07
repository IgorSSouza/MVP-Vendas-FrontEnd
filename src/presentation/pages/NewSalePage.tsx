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

export function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [items, setItems] = useState<DraftSaleItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  )
  const activeServices = useMemo(
    () => services.filter((service) => service.isActive),
    [services],
  )

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
        message: getApiErrorMessage(
          error,
          'Não foi possível carregar os dados para a venda.',
        ),
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
          description="Adicione produtos e serviços, ajuste os itens da venda e finalize a operação com cálculo imediato de subtotal, total e lucro."
        />
      </div>

      <div className="app-feedback-stack app-enter-soft-delay-1">
        {feedback ? <FeedbackBanner {...feedback} /> : null}
        {isLoading ? (
          <LoadingNotice message="Carregando produtos e serviços para a venda..." />
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6 app-enter-soft-delay-2">
          <div className="grid gap-6 lg:grid-cols-2">
            <SaleCatalogSection
              title="Produtos ativos"
              description="Escolha produtos disponíveis em estoque para adicionar na venda."
              items={activeProducts.map((product) => ({
                ...product,
                type: SaleItemType.PRODUCT,
              }))}
              emptyMessage={
                isLoading ? 'Carregando produtos...' : 'Nenhum produto ativo disponível.'
              }
              isDisabled={isLoading || isSubmitting}
              onAdd={(item) => addProduct(item as Product)}
            />

            <SaleCatalogSection
              title="Serviços ativos"
              description="Adicione serviços ativos da assistência técnica ao pedido."
              items={activeServices.map((service) => ({
                ...service,
                type: SaleItemType.SERVICE,
              }))}
              emptyMessage={
                isLoading ? 'Carregando serviços...' : 'Nenhum serviço ativo disponível.'
              }
              isDisabled={isLoading || isSubmitting}
              onAdd={(item) => addService(item as Service)}
            />
          </div>

          <SaleItemsList
            items={items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
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
