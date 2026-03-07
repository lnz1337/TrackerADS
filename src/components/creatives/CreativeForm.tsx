'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { creativeSchema, type CreativeFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ComboBox } from '@/components/ui/ComboBox'
import { ComboTextarea } from '@/components/ui/ComboTextarea'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import {
  PLATFORMS,
  STATUSES,
  CREATIVE_TYPES,
  HOOK_TYPES,
  HOLD_STRUCTURES,
  CTA_TYPES,
} from '@/lib/constants'
import type { Creative } from '@/lib/types'

interface CreativeFormProps {
  creative?: Creative
}

export function CreativeForm({ creative }: CreativeFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!creative

  const [suggestions, setSuggestions] = useState<{
    offer_name: string[]
    niche: string[]
    region: string[]
    hook_text: string[]
    main_copy: string[]
  }>({ offer_name: [], niche: [], region: [], hook_text: [], main_copy: [] })

  useEffect(() => {
    async function loadSuggestions() {
      const supabase = createClient()
      const { data } = await supabase
        .from('creatives')
        .select('offer_name, niche, region, hook_text, main_copy')
      if (data) {
        const unique = (arr: (string | null)[]) =>
          Array.from(new Set(arr.filter(Boolean) as string[])).sort()
        setSuggestions({
          offer_name: unique(data.map((c) => c.offer_name)),
          niche: unique(data.map((c) => c.niche)),
          region: unique(data.map((c) => c.region)),
          hook_text: unique(data.map((c) => c.hook_text)),
          main_copy: unique(data.map((c) => c.main_copy)),
        })
      }
    }
    loadSuggestions()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreativeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(creativeSchema) as any,
    defaultValues: creative
      ? {
          name: creative.name,
          platform: creative.platform as CreativeFormData['platform'],
          offer_name: creative.offer_name,
          niche: creative.niche || '',
          region: creative.region || '',
          creative_type: creative.creative_type || '',
          angle: creative.angle || '',
          hook_text: creative.hook_text || '',
          hook_type: creative.hook_type || '',
          hold_structure: creative.hold_structure || '',
          main_copy: creative.main_copy || '',
          cta_type: creative.cta_type || '',
          duration_seconds: creative.duration_seconds,
          creative_url: creative.creative_url || '',
          ad_url: creative.ad_url || '',
          status: creative.status as CreativeFormData['status'],
          start_date: creative.start_date,
          notes: creative.notes || '',
        }
      : {
          status: 'Em teste',
          start_date: new Date().toISOString().split('T')[0],
        },
  })

  const onSubmit = async (data: CreativeFormData) => {
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const duration = data.duration_seconds
      const payload = {
        ...data,
        niche: data.niche || null,
        region: data.region || null,
        creative_type: data.creative_type || null,
        angle: data.angle || null,
        hook_text: data.hook_text || null,
        hook_type: data.hook_type || null,
        hold_structure: data.hold_structure || null,
        main_copy: data.main_copy || null,
        cta_type: data.cta_type || null,
        duration_seconds: duration === '' || duration == null ? null : Number(duration),
        creative_url: data.creative_url || null,
        ad_url: data.ad_url || null,
        notes: data.notes || null,
      }

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('creatives')
          .update(payload)
          .eq('id', creative.id)
        if (updateError) throw updateError
        router.push(`/creatives/${creative.id}`)
      } else {
        const { error: insertError } = await supabase
          .from('creatives')
          .insert(payload)
        if (insertError) throw insertError
        router.push('/')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar criativo')
    } finally {
      setSubmitting(false)
    }
  }

  const toOptions = (arr: readonly string[]) =>
    arr.map((v) => ({ value: v, label: v }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Criativo *"
          id="name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Select
          label="Plataforma *"
          id="platform"
          options={toOptions(PLATFORMS)}
          placeholder="Selecione..."
          {...register('platform')}
          error={errors.platform?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComboBox
          label="Nome da Oferta *"
          id="offer_name"
          suggestions={suggestions.offer_name}
          {...register('offer_name')}
          error={errors.offer_name?.message}
        />
        <Select
          label="Status *"
          id="status"
          options={toOptions(STATUSES)}
          {...register('status')}
          error={errors.status?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ComboBox label="Nicho" id="niche" suggestions={suggestions.niche} {...register('niche')} />
        <ComboBox label="Região" id="region" suggestions={suggestions.region} {...register('region')} />
        <Input
          label="Data de Início *"
          id="start_date"
          type="date"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Tipo de Criativo"
          id="creative_type"
          options={toOptions(CREATIVE_TYPES)}
          placeholder="Selecione..."
          {...register('creative_type')}
        />
        <Input label="Ângulo" id="angle" {...register('angle')} />
        <Input
          label="Duração (segundos)"
          id="duration_seconds"
          type="number"
          min="0"
          {...register('duration_seconds')}
          error={errors.duration_seconds?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de Hook"
          id="hook_type"
          options={toOptions(HOOK_TYPES)}
          placeholder="Selecione..."
          {...register('hook_type')}
        />
        <Select
          label="Estrutura de Hold"
          id="hold_structure"
          options={toOptions(HOLD_STRUCTURES)}
          placeholder="Selecione..."
          {...register('hold_structure')}
        />
      </div>

      <ComboTextarea
        label="Texto do Hook"
        id="hook_text"
        suggestions={suggestions.hook_text}
        {...register('hook_text')}
      />

      <ComboTextarea
        label="Copy Principal"
        id="main_copy"
        suggestions={suggestions.main_copy}
        {...register('main_copy')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de CTA"
          id="cta_type"
          options={toOptions(CTA_TYPES)}
          placeholder="Selecione..."
          {...register('cta_type')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="URL do Criativo"
          id="creative_url"
          type="url"
          placeholder="https://..."
          {...register('creative_url')}
          error={errors.creative_url?.message}
        />
        <Input
          label="URL do Anúncio"
          id="ad_url"
          type="url"
          placeholder="https://..."
          {...register('ad_url')}
          error={errors.ad_url?.message}
        />
      </div>

      <Textarea label="Observações" id="notes" {...register('notes')} />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Criativo'}
        </Button>
      </div>
    </form>
  )
}
