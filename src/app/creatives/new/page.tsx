import { CreativeForm } from '@/components/creatives/CreativeForm'

export default function NewCreativePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Criativo</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CreativeForm />
      </div>
    </div>
  )
}
