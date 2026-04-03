import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from './Card'
import { type Task } from '../context/AppContext'

interface SortableCardProps {
  task: Task
}

export function SortableCard({ task }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    scale: isDragging ? 0.95 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div {...attributes} {...listeners}>
        <Card task={task} />
      </div>
    </div>
  )
}
