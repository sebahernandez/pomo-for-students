import { TimerCard } from './components/TimerCard'
import { KanbanBoard } from './components/KanbanBoard'

function App() {
  return (
    <div className="container mx-auto max-w-7xl px-2 lg:px-0 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
        <div className="order-2 lg:order-1 lg:flex-1">
          <div className="h-full">
            <KanbanBoard />
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:w-[420px] lg:flex-[0_0_420px]">
          <TimerCard />
        </div>
      </div>
    </div>
  )
}

export default App
