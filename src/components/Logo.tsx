export function Logo() {
  return (
    <div className="flex flex-col leading-none select-none min-w-0">
      <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-900 dark:text-neutral-100 truncate">
        POMO FOR STUDY
      </span>
      <span className="hidden min-[420px]:block text-[10px] text-theme-muted mt-1 font-medium italic truncate">
        (Drag and drop kanban pomo)
      </span>
    </div>
  )
}
