import { z } from 'zod'

export const serviceFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do serviço.'),
  description: z.string().trim().optional(),
  costPrice: z.coerce.number().min(0, 'O custo não pode ser negativo.'),
  salePrice: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  isActive: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>
