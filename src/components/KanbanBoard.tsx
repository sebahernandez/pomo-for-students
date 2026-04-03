import { useState } from 'react'
import { DndContext, type DragEndEvent, type DragOverEvent, useSensor, useSensors, PointerSensor, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IconPlus, IconClipboardList, IconCircle, IconCircleHalf, IconCircleCheck } from '@tabler/icons-react'
import { useAppStore, type TaskStatus } from '../context/AppContext'
import { SortableCard } from './SortableCard'
import { useTranslations } from '../i18n/translations'

export function KanbanBoard() {
  const { tasks, addTask, moveTask, language } = useAppStore()
  const [newTask, setNewTask] = useState('')
  const [overId, setOverId] = useState<TaskStatus | null>(null)

  const t = useTranslations(language)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = [
    { key: 'todo' as TaskStatus, label: t.toDo, icon: <IconCircle size={14} />, accent: 'border-blue-500 dark:border-blue-400', text: 'text-blue-500 dark:text-blue-400', dropBg: 'bg-blue-500/5 dark:bg-blue-400/5' },
    { key: 'doing' as TaskStatus, label: t.inProgress, icon: <IconCircleHalf size={14} />, accent: 'border-amber-500 dark:border-amber-400', text: 'text-amber-500 dark:text-amber-400', dropBg: 'bg-amber-500/5 dark:bg-amber-400/5' },
    { key: 'done' as TaskStatus, label: t.done, icon: <IconCircleCheck size={14} />, accent: 'border-emerald-500 dark:border-emerald-400', text: 'text-emerald-500 dark:text-emerald-400', dropBg: 'bg-emerald-500/5 dark:bg-emerald-400/5' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTask(trimmed)
    setNewTask('')
  }

  const handleDragStart = () => {}

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (over && ['todo', 'doing', 'done'].includes(over.id as string)) {
      setOverId(over.id as TaskStatus)
    } else {
      setOverId(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setOverId(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    if (['todo', 'doing', 'done'].includes(newStatus)) {
      moveTask(taskId, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="glass glow animate-fade-in h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <IconClipboardList size={20} className="text-neutral-500 dark:text-neutral-400" />
              {t.taskBoard}
            </h2>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {t.tasks(tasks.length)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={t.whatWorkingOn}
              className="input-glass flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap inline-flex items-center gap-1.5">
              <IconPlus size={16} /> {t.add}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 content-start">
            {columns.map((col) => {
              const columnTasks = tasks.filter((t) => t.status === col.key)
              const taskIds = columnTasks.map((t) => t.id)
              const isOver = overId === col.key

              return (
                <SortableContext key={col.key} items={taskIds} strategy={verticalListSortingStrategy}>
                  <div className={`rounded-xl p-4 border-t-2 transition-colors duration-200 ${col.accent} ${isOver ? col.dropBg : 'bg-black/[0.02] dark:bg-white/[0.02]'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={col.text}>{col.icon}</span>
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${col.text}`}>
                        {col.label}
                      </h3>
                      <span className={`ml-auto text-xs font-semibold ${col.text}`}>
                        {columnTasks.length}
                      </span>
                    </div>
                    <div
                      className={`space-y-2 min-h-[60px] transition-all duration-200 rounded-lg ${isOver ? 'p-2 -m-2 ring-2 ring-dashed ring-neutral-300 dark:ring-neutral-600' : ''}`}
                    >
                      {columnTasks.length === 0 && !isOver && (
                        <div className="flex items-center justify-center py-6">
                          <span className="text-xs text-neutral-300 dark:text-neutral-600">{t.empty}</span>
                        </div>
                      )}
                      {columnTasks.map((task) => (
                        <SortableCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                </SortableContext>
              )
            })}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
