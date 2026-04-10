import { useState } from 'react'
import { DndContext, type DragEndEvent, type DragOverEvent, useSensor, useSensors, PointerSensor, closestCorners } from '@dnd-kit/core'
import { IconPlus, IconClipboardList, IconCircle, IconCircleHalf, IconCircleCheck } from '@tabler/icons-react'
import { useAppStore, type TaskStatus } from '../context/AppContext'
import { DroppableColumn } from './DroppableColumn'
import { useTranslations } from '../i18n/translations'
import { useThemeColors } from '../hooks/useThemeColors'

export function KanbanBoard() {
  const { tasks, addTask, moveTask, setActiveTask, resetTimer, language } = useAppStore()
  const themeColors = useThemeColors()
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
    { key: 'todo' as TaskStatus, label: t.toDo, icon: <IconCircle size={14} /> },
    { key: 'doing' as TaskStatus, label: t.inProgress, icon: <IconCircleHalf size={14} /> },
    { key: 'done' as TaskStatus, label: t.done, icon: <IconCircleCheck size={14} /> },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTask(trimmed)
    setNewTask('')
  }

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
    let newStatus: TaskStatus | null = null

    if (['todo', 'doing', 'done'].includes(over.id as string)) {
      newStatus = over.id as TaskStatus
    } else {
      const droppedTask = tasks.find((t) => t.id === over.id)
      if (droppedTask) {
        newStatus = droppedTask.status
      }
    }

    if (newStatus) {
      moveTask(taskId, newStatus)

      if (newStatus === 'done') {
        const currentActive = useAppStore.getState().activeTaskId
        if (currentActive === taskId) {
          setActiveTask(null)
          resetTimer()
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="glass glow animate-fade-in h-full"
        style={{
          background: themeColors.glassBg,
        }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold inline-flex items-center gap-2 text-white">
              <IconClipboardList size={20} className="text-white/70" />
              {t.taskBoard}
            </h2>
            <span className="text-xs text-white/50">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 content-start w-full">
            {columns.map((col, index) => {
              const columnTasks = tasks.filter((t) => t.status === col.key)
              const isOver = overId === col.key

              const colors = [
                { accent: themeColors.secondary, bg: `${themeColors.secondary}10` },
                { accent: themeColors.primary, bg: `${themeColors.primary}15` },
                { accent: themeColors.accent, bg: `${themeColors.accent}10` },
              ][index]

              return (
                <div key={col.key} className="min-w-0">
                  <DroppableColumn
                    col={col}
                    tasks={columnTasks}
                    isOver={isOver}
                    emptyLabel={t.empty}
                    accentColor={colors.accent}
                    dropBg={colors.bg}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
