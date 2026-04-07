import type { Service } from '@domain/entities'

export const mockServices: Service[] = [
  {
    id: 'service_screen_replace',
    name: 'Troca de tela',
    description: 'Substituicao da tela com mao de obra da assistencia.',
    costPrice: 120,
    salePrice: 220,
    isActive: true,
    createdAt: '2026-03-20T09:00:00.000Z',
    updatedAt: '2026-04-01T09:30:00.000Z',
  },
  {
    id: 'service_battery_replace',
    name: 'Troca de bateria',
    description: 'Servico de substituicao com testes basicos do aparelho.',
    costPrice: 45,
    salePrice: 120,
    isActive: true,
    createdAt: '2026-03-21T09:00:00.000Z',
    updatedAt: '2026-04-02T10:15:00.000Z',
  },
  {
    id: 'service_software_update',
    name: 'Atualizacao de software',
    description: 'Atualizacao, configuracao inicial e verificacao do sistema.',
    costPrice: 10,
    salePrice: 60,
    isActive: true,
    createdAt: '2026-03-22T09:00:00.000Z',
    updatedAt: '2026-04-03T12:10:00.000Z',
  },
  {
    id: 'service_board_repair',
    name: 'Reparo de placa',
    description: 'Diagnostico e reparo especializado em placa principal.',
    costPrice: 180,
    salePrice: 350,
    isActive: false,
    createdAt: '2026-03-23T09:00:00.000Z',
    updatedAt: '2026-04-04T13:00:00.000Z',
  },
]
