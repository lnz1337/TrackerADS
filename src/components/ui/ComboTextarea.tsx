'use client'

import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react'

interface ComboTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  suggestions: string[]
}

export const ComboTextarea = forwardRef<HTMLTextAreaElement, ComboTextareaProps>(
  ({ className, label, error, id, suggestions, onChange, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function truncate(text: string, max: number) {
      return text.length > max ? text.slice(0, max) + '…' : text
    }

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        {suggestions.length > 0 && (
          <div className="relative mb-1">
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              onClick={() => setOpen(!open)}
            >
              {open ? 'Fechar sugestões' : `Usar texto anterior (${suggestions.length})`}
            </button>
            {open && (
              <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg">
                {suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer px-3 py-2 hover:bg-blue-50 text-gray-900"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      const textarea = containerRef.current?.querySelector('textarea')
                      if (textarea) {
                        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                          window.HTMLTextAreaElement.prototype,
                          'value'
                        )?.set
                        nativeTextAreaValueSetter?.call(textarea, suggestion)
                        textarea.dispatchEvent(new Event('input', { bubbles: true }))
                      }
                      setOpen(false)
                    }}
                  >
                    {truncate(suggestion, 100)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={cn(
            'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          onChange={onChange}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

ComboTextarea.displayName = 'ComboTextarea'
