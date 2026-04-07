import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  category: z.string().trim().min(1, 'Informe a categoria do produto.'),
  costPrice: z.coerce.number().min(0, 'O custo nao pode ser negativo.'),
  salePrice: z.coerce.number().min(0, 'O preco de venda nao pode ser negativo.'),
  stockQuantity: z.coerce.number().min(0, 'O estoque nao pode ser negativo.'),
  isActive: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
