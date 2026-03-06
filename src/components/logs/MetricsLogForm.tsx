'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { metricsLogSchema, type MetricsLogFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { CreativeMetricsLog } from '@/lib/types'

interface MetricsLogFormProps {
  creativeId: string
  creativeName: string
  existingLog?: CreativeMetricsLog
}

export function MetricsLogForm({ creativeId, creativeName, existingLog }: MetricsLogFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingDate, setCheckingDate] = useState(false)
  const [foundLog, setFoundLog] = useState<CreativeMetricsLog | null>(existingLog || null)
  const isEditing = !!foundLog

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<MetricsLogFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(metricsLogSchema) as any,
    defaultValues: existingLog
      ? {
          log_date: existingLog.log_date,
          impressions: existingLog.impressions,
          cpm: existingLog.cpm,
          cpc: existingLog.cpc,
          ctr: existingLog.ctr,
          link_ctr: existingLog.link_ctr,
          hook_rate: existingLog.hook_rate,
          hold_rate: existingLog.hold_rate,
          thumbstop_rate: existingLog.thumbstop_rate,
          view_25: existingLog.view_25,
          view_50: existingLog.view_50,
          view_75: existingLog.view_75,
          view_95: existingLog.view_95,
          clicks: existingLog.clicks,
          cost: existingLog.cost,
          leads: existingLog.leads,
          checkouts: existingLog.checkouts,
          sales: existingLog.sales,
          revenue: existingLog.revenue,
          cpa: existingLog.cpa,
          roas: existingLog.roas,
          notes: existingLog.notes || '',
        }
      : {
          log_date: new Date().toISOString().split('T')[0],
        },
  })

  const logDate = watch('log_date')

  useEffect(() => {
    if (!logDate || existingLog) return

    const checkExistingLog = async () => {
      setCheckingDate(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('creative_metrics_logs')
          .select('*')
          .eq('creative_id', creativeId)
          .eq('log_date', logDate)
          .single()

        if (data) {
          setFoundLog(data)
          reset({
            log_date: data.log_date,
            impressions: data.impressions,
            cpm: data.cpm,
            cpc: data.cpc,
            ctr: data.ctr,
            link_ctr: data.link_ctr,
            hook_rate: data.hook_rate,
            hold_rate: data.hold_rate,
            thumbstop_rate: data.thumbstop_rate,
            view_25: data.view_25,
            view_50: data.view_50,
            view_75: data.view_75,
            view_95: data.view_95,
            clicks: data.clicks,
            cost: data.cost,
            leads: data.leads,
            checkouts: data.checkouts,
            sales: data.sales,
            revenue: data.revenue,
            cpa: data.cpa,
            roas: data.roas,
            notes: data.notes || '',
          })
        } else {
          setFoundLog(null)
        }
      } catch {
        setFoundLog(null)
      } finally {
        setCheckingDate(false)
      }
    }

    checkExistingLog()
  }, [logDate, creativeId, existingLog, reset])

  const onSubmit = async (data: MetricsLogFormData) => {
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const toNum = (v: unknown) => (v === '' || v == null ? null : Number(v))
      const payload = {
        creative_id: creativeId,
        log_date: data.log_date,
        impressions: toNum(data.impressions),
        cpm: toNum(data.cpm),
        cpc: toNum(data.cpc),
        ctr: toNum(data.ctr),
        link_ctr: toNum(data.link_ctr),
        hook_rate: toNum(data.hook_rate),
        hold_rate: toNum(data.hold_rate),
        thumbstop_rate: toNum(data.thumbstop_rate),
        view_25: toNum(data.view_25),
        view_50: toNum(data.view_50),
        view_75: toNum(data.view_75),
        view_95: toNum(data.view_95),
        clicks: toNum(data.clicks),
        cost: toNum(data.cost),
        leads: toNum(data.leads),
        checkouts: toNum(data.checkouts),
        sales: toNum(data.sales),
        revenue: toNum(data.revenue),
        cpa: toNum(data.cpa),
        roas: toNum(data.roas),
        notes: data.notes || null,
      }

      if (isEditing && foundLog) {
        const { error: updateError } = await supabase
          .from('creative_metrics_logs')
          .update(payload)
          .eq('id', foundLog.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('creative_metrics_logs')
          .insert(payload)
        if (insertError) throw insertError
      }

      router.push(`/creatives/${creativeId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar log')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!foundLog || !confirm('Tem certeza que deseja excluir este log?')) return

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('creative_metrics_logs')
        .delete()
        .eq('id', foundLog.id)
      if (deleteError) throw deleteError

      router.push(`/creatives/${creativeId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir log')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-sm text-gray-500 mb-2">
        Criativo: <span className="font-medium text-gray-900">{creativeName}</span>
      </div>

      {isEditing && (
        <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
          Log existente para esta data. Editando registro atual.
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Input
        label="Data *"
        id="log_date"
        type="date"
        {...register('log_date')}
        error={errors.log_date?.message}
      />
      {checkingDate && <p className="text-xs text-gray-400">Verificando data...</p>}

      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">Engajamento</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Input label="Impressões" type="number" min="0" step="1" {...register('impressions')} error={errors.impressions?.message} />
          <Input label="CPM" type="number" min="0" step="0.01" {...register('cpm')} error={errors.cpm?.message} />
          <Input label="CPC" type="number" min="0" step="0.01" {...register('cpc')} error={errors.cpc?.message} />
          <Input label="CTR (%)" type="number" min="0" step="0.01" {...register('ctr')} error={errors.ctr?.message} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Input label="Link CTR (%)" type="number" min="0" step="0.01" {...register('link_ctr')} error={errors.link_ctr?.message} />
          <Input label="Clicks" type="number" min="0" step="1" {...register('clicks')} error={errors.clicks?.message} />
          <Input label="Custo" type="number" min="0" step="0.01" {...register('cost')} error={errors.cost?.message} />
        </div>
      </fieldset>

      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">Hook & Hold</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Input label="Hook Rate (%)" type="number" min="0" step="0.01" {...register('hook_rate')} error={errors.hook_rate?.message} />
          <Input label="Hold Rate (%)" type="number" min="0" step="0.01" {...register('hold_rate')} error={errors.hold_rate?.message} />
          <Input label="ThumbStop Rate (%)" type="number" min="0" step="0.01" {...register('thumbstop_rate')} error={errors.thumbstop_rate?.message} />
        </div>
      </fieldset>

      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">Retenção de Vídeo</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Input label="View 25% (%)" type="number" min="0" step="0.01" {...register('view_25')} error={errors.view_25?.message} />
          <Input label="View 50% (%)" type="number" min="0" step="0.01" {...register('view_50')} error={errors.view_50?.message} />
          <Input label="View 75% (%)" type="number" min="0" step="0.01" {...register('view_75')} error={errors.view_75?.message} />
          <Input label="View 95% (%)" type="number" min="0" step="0.01" {...register('view_95')} error={errors.view_95?.message} />
        </div>
      </fieldset>

      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">Conversões</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Input label="Leads" type="number" min="0" step="1" {...register('leads')} error={errors.leads?.message} />
          <Input label="Checkouts" type="number" min="0" step="1" {...register('checkouts')} error={errors.checkouts?.message} />
          <Input label="Vendas" type="number" min="0" step="1" {...register('sales')} error={errors.sales?.message} />
          <Input label="Receita" type="number" min="0" step="0.01" {...register('revenue')} error={errors.revenue?.message} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Input label="CPA" type="number" min="0" step="0.01" {...register('cpa')} error={errors.cpa?.message} />
          <Input label="ROAS" type="number" min="0" step="0.01" {...register('roas')} error={errors.roas?.message} />
        </div>
      </fieldset>

      <Textarea label="Observações" {...register('notes')} />

      <div className="flex justify-between">
        <div>
          {isEditing && (
            <Button type="button" variant="danger" onClick={handleDelete} disabled={submitting}>
              Excluir Log
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : isEditing ? 'Atualizar Log' : 'Adicionar Log'}
          </Button>
        </div>
      </div>
    </form>
  )
}
