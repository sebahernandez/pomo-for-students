import { IconX, IconFlame, IconTarget, IconCircleDashed, IconCircleCheck } from '@tabler/icons-react'
import { useAppStore, type Task, type TaskStatus } from '../context/AppContext'
import { useTranslations } from '../i18n/translations'

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
}

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  todo: <IconCircleDashed size={12} />,
  doing: <IconFlame size={12} />,
  done: <IconCircleCheck size={12} />,
}

interface CardProps {
  task: Task
}

export function Card({ task }: CardProps) {
  const { moveTask, removeTask, activeTaskId, setActiveTask, language } = useAppStore()
  const t = useTranslations(language)
  const nextStatus = NEXT_STATUS[task.status]
  const isActive = task.id === activeTaskId

  const statusLabels: Record<TaskStatus, string> = {
    todo: t.startAction,
    doing: t.doneAction,
    done: t.resetAction,
  }

  return (
    <div className={`group rounded-lg p-3 transition-all duration-200 ${isActive ? 'bg-neutral-900/[0.06] dark:bg-white/[0.08] border border-neutral-900/20 dark:border-white/20' : 'bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.05] dark:hover:bg-white/[0.05]'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-0.5">{STATUS_ICONS[task.status]}</span>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex-1 leading-snug truncate">{task.title}</p>
        </div>
        <button
          onClick={() => removeTask(task.id)}
          className="text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Remove task"
        >
          <IconX size={14} />
        </button>
      </div>
      {task.pomodorosCompleted > 0 && (
        <div className="flex items-center gap-1 mt-2 ml-5">
          <IconFlame size={12} className="text-neutral-400/60 dark:text-neutral-500/60" />
          <span className="text-xs text-neutral-400/60 dark:text-neutral-500/60">{task.pomodorosCompleted}</span>
        </div>
      )}
      <div className="flex gap-1.5 mt-2.5">
        <button
          onClick={() => moveTask(task.id, nextStatus)}
          className="text-xs bg-black/[0.04] dark:bg-white/[0.05] text-neutral-500 dark:text-neutral-400 px-2.5 py-1 rounded-md hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-colors inline-flex items-center gap-1"
        >
          {STATUS_ICONS[task.status]} {statusLabels[task.status]}
        </button>
        {task.status !== 'done' && (
          <button
            onClick={() => setActiveTask(isActive ? null : task.id)}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 ${isActive ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-700 dark:text-neutral-300' : 'bg-black/[0.04] dark:bg-white/[0.05] text-neutral-400 dark:text-neutral-500 hover:bg-black/[0.08] dark:hover:bg-white/[0.1]'}`}
          >
            <IconTarget size={12} /> {isActive ? t.active : t.focusAction}
          </button>
        )}
      </div>
    </div>
  )
}
