import { z } from 'zod'

const validBarcodeLengths = new Set([8, 12, 13, 14])

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  category: z.string().trim().min(1, 'Informe a categoria do produto.'),
  barcode: z
    .string()
    .trim()
    .max(14, 'O código de barras deve ter no máximo 14 dígitos.')
    .refine(
      (value) => value.length === 0 || /^\d+$/.test(value),
      'Informe apenas números no código de barras.',
    )
    .refine(
      (value) => value.length === 0 || validBarcodeLengths.has(value.length),
      'Use um código com 8, 12, 13 ou 14 dígitos.',
    )
    .optional()
    .transform((value) => (value && value.length > 0 ? value : '')),
  costPrice: z.coerce.number().min(0, 'O custo não pode ser negativo.'),
  salePrice: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  stockQuantity: z.coerce.number().min(0, 'O estoque não pode ser negativo.'),
  isActive: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
