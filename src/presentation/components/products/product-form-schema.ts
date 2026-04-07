import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  category: z.string().trim().min(1, 'Informe a categoria do produto.'),
  costPrice: z.coerce.number().min(0, 'O custo não pode ser negativo.'),
  salePrice: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  stockQuantity: z.coerce.number().min(0, 'O estoque não pode ser negativo.'),
  isActive: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
