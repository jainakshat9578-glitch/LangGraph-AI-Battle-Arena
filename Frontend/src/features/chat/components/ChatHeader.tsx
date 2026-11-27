import ChatIcon from './ChatIcon'

interface ChatHeaderProps {
  title: string
  onToggleSidebar: () => void
  onNewBattle: () => void
}

function ChatHeader({
  title,
  onToggleSidebar,
  onNewBattle,
}: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
        >
          <ChatIcon name="menu" className="size-[18px]" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-zinc-200">
            {title}
          </p>
          <p className="mt-0.5 hidden text-[10px] tracking-wide text-zinc-600 sm:block">
            AI BATTLE ARENA
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewBattle}
        className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
      >
        <ChatIcon name="plus" className="size-4" />
        <span className="hidden sm:inline">New Battle</span>
      </button>
    </header>
  )
}

export default ChatHeader
