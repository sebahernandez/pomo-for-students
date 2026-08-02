import type { ReactNode } from 'react'
import { IconMenu2 } from '@tabler/icons-react'
import { useAppStore } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'
import { Drawer } from './Drawer'

export interface ToolItem {
  key: string
  icon: ReactNode
  label: string
  /** Opens the tool's own panel. The menu closes itself before calling this. */
  onOpen: () => void
}

interface ToolsMenuProps {
  items: ToolItem[]
  onClose: () => void
}

export function ToolsMenu({ items, onClose }: ToolsMenuProps) {
  const { language } = useAppStore()
  const t = useTranslations(language)

  return (
    <Drawer
      onClose={onClose}
      title={t.tools}
      icon={<IconMenu2 size={20} className="text-theme-muted" />}
      maxWidthClass="max-w-xs"
    >
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              onClose()
              item.onOpen()
            }}
            className="menu-item"
            aria-label={item.label}
            title={item.label}
          >
            <span className="menu-item__icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </Drawer>
  )
}
