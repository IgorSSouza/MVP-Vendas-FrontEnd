import { z } from 'zod'

export const serviceFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do servico.'),
  description: z.string().trim().optional(),
  costPrice: z.coerce.number().min(0, 'O custo nao pode ser negativo.'),
  salePrice: z.coerce.number().min(0, 'O preco de venda nao pode ser negativo.'),
  isActive: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>
