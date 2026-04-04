import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { type TaskStatus } from '../context/AppContext'
import { SortableCard } from './SortableCard'
import { type Task } from '../context/AppContext'

interface DroppableColumnProps {
  col: {
    key: TaskStatus
    label: string
    icon: React.ReactNode
    accent: string
    text: string
    dropBg: string
  }
  tasks: Task[]
  isOver: boolean
  emptyLabel: string
  children?: React.ReactNode
}

export function DroppableColumn({ col, tasks, isOver, emptyLabel, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: col.key,
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-4 border-t-2 transition-colors duration-200 ${col.accent} ${isOver ? col.dropBg : 'bg-black/[0.02] dark:bg-white/[0.02]'}`}
      style={{minWidth: 0}}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={col.text}>{col.icon}</span>
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${col.text}`}>
          {col.label}
        </h3>
        <span className={`ml-auto text-xs font-semibold ${col.text}`}>
          {tasks.length}
        </span>
      </div>
      <div
        className={`space-y-2 min-h-[60px] transition-all duration-200 rounded-lg overflow-y-auto pr-1 ${isOver ? 'p-2 -m-2 ring-2 ring-dashed ring-neutral-300 dark:ring-neutral-600' : ''}`}
        style={{maxHeight: 'calc(5 * 88px + 4 * 8px)'}}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && !isOver && (
            <div className="flex items-center justify-center py-6">
              <span className="text-xs text-neutral-300 dark:text-neutral-600">{emptyLabel}</span>
            </div>
          )}
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      {children}
    </div>
  )
}
