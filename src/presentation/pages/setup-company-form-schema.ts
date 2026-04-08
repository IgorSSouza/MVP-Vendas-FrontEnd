import { z } from 'zod'

function normalizeCnpj(value: string) {
  return value.replace(/\D/g, '')
}

export const setupCompanyFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da empresa.'),
  cnpj: z
    .string()
    .trim()
    .min(1, 'Informe o CNPJ da empresa.')
    .refine((value) => normalizeCnpj(value).length === 14, 'Informe um CNPJ com 14 dígitos.')
    .transform((value) => normalizeCnpj(value)),
})

export type SetupCompanyFormValues = z.input<typeof setupCompanyFormSchema>
export type SetupCompanyPayload = z.output<typeof setupCompanyFormSchema>
