import { useState } from 'react'
import { IconPlus, IconClipboardList, IconCircle, IconCircleHalf, IconCircleCheck } from '@tabler/icons-react'
import { useAppStore, type TaskStatus } from '../context/AppContext'
import { Card } from './Card'
import { useTranslations } from '../i18n/translations'

export function KanbanBoard() {
  const { tasks, addTask, language } = useAppStore()
  const [newTask, setNewTask] = useState('')

  const t = useTranslations(language)

  const columns = [
    { key: 'todo' as TaskStatus, label: t.toDo, icon: <IconCircle size={14} />, accent: 'border-neutral-400 dark:border-neutral-600' },
    { key: 'doing' as TaskStatus, label: t.inProgress, icon: <IconCircleHalf size={14} />, accent: 'border-neutral-600 dark:border-neutral-400' },
    { key: 'done' as TaskStatus, label: t.done, icon: <IconCircleCheck size={14} />, accent: 'border-neutral-800 dark:border-neutral-200' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTask(trimmed)
    setNewTask('')
  }

  return (
    <div className="glass glow animate-fade-in">
      <div className="p-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key)
            return (
              <div key={col.key} className={`bg-black/[0.02] dark:bg-white/[0.02] rounded-xl p-4 border-t-2 ${col.accent}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-neutral-400 dark:text-neutral-500">{col.icon}</span>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {col.label}
                  </h3>
                  <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500 bg-black/[0.04] dark:bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[60px]">
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center py-6">
                      <span className="text-xs text-neutral-300 dark:text-neutral-600">{t.empty}</span>
                    </div>
                  )}
                  {columnTasks.map((task) => (
                    <Card key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
