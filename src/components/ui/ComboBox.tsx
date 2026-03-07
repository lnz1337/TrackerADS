'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react'

interface ComboBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  suggestions: string[]
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(
  ({ className, label, error, id, suggestions, onChange, onFocus, onBlur, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(filter.toLowerCase())
    )

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            onChange={(e) => {
              setFilter(e.target.value)
              setOpen(true)
              onChange?.(e)
            }}
            onFocus={(e) => {
              setOpen(true)
              setFilter(e.target.value)
              onFocus?.(e)
            }}
            onBlur={(e) => {
              onBlur?.(e)
            }}
            autoComplete="off"
            {...props}
          />
          {open && filtered.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg">
              {filtered.map((suggestion) => (
                <li
                  key={suggestion}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-50 text-gray-900"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const input = containerRef.current?.querySelector('input')
                    if (input) {
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        'value'
                      )?.set
                      nativeInputValueSetter?.call(input, suggestion)
                      input.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                    setFilter(suggestion)
                    setOpen(false)
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

ComboBox.displayName = 'ComboBox'
