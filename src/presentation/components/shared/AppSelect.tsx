import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { AppPortal } from '@presentation/components/shared/AppPortal'

type SelectOption<T extends string | number> = {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

type AppSelectProps<T extends string | number> = {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

type MenuPosition = {
  top: number
  left: number
  width: number
}

const defaultPosition: MenuPosition = {
  top: 0,
  left: 0,
  width: 0,
}

export function AppSelect<T extends string | number>({
  value,
  options,
  onChange,
  disabled = false,
  className = '',
}: AppSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [menuPosition, setMenuPosition] = useState<MenuPosition>(defaultPosition)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const listboxId = useId()

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  )

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : options[0]

  function updateMenuPosition() {
    if (!triggerRef.current) {
      return
    }

    const rect = triggerRef.current.getBoundingClientRect()

    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    })
  }

  function openMenu() {
    if (disabled) {
      return
    }

    updateMenuPosition()
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setIsOpen(true)
  }

  function closeMenu() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }

      closeMenu()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()

        setActiveIndex((currentIndex) => {
          const nextIndex =
            currentIndex < options.length - 1 ? currentIndex + 1 : currentIndex

          return nextIndex
        })

        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        setActiveIndex((currentIndex) => {
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex

          return nextIndex
        })

        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()

        const option = options[activeIndex]

        if (!option || option.disabled) {
          return
        }

        onChange(option.value)
        closeMenu()
        triggerRef.current?.focus()
      }
    }

    const handleViewportChange = () => {
      updateMenuPosition()
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, isOpen, onChange, options])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const activeOption = menuRef.current?.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`,
    )

    activeOption?.scrollIntoView({
      block: 'nearest',
    })
  }, [activeIndex, isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className={['app-select', className].filter(Boolean).join(' ')}
      >
        <span className="truncate text-left">{selectedOption?.label ?? ''}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={['h-4 w-4 shrink-0 transition-transform duration-150', isOpen ? 'rotate-180' : ''].join(' ')}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <AppPortal>
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            className="app-select-menu"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            <div className="max-h-72 overflow-y-auto p-1.5">
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isActive = index === activeIndex

                return (
                  <button
                    key={String(option.value)}
                    id={`${listboxId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-option-index={index}
                    disabled={option.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      if (option.disabled) {
                        return
                      }

                      onChange(option.value)
                      closeMenu()
                      triggerRef.current?.focus()
                    }}
                    className={[
                      'app-select-option',
                      isSelected ? 'app-select-option-selected' : '',
                      isActive ? 'app-select-option-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.description ? (
                        <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300"
                      >
                        <path
                          d="M5 10.5L8.5 14L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </AppPortal>
      ) : null}
    </>
  )
}

export type { AppSelectProps, SelectOption }
