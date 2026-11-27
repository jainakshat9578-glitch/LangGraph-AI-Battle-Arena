import ChatIcon from './ChatIcon'

interface ConversationItemProps {
  title: string
  active: boolean
  collapsed: boolean
  onClick: () => void
}

function ConversationItem({
  title,
  active,
  collapsed,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      title={collapsed ? title : undefined}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-9 w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60 ${active ? 'bg-white/[0.09] text-zinc-100' : 'text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-200'} ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <ChatIcon name="message" className="size-4 shrink-0" />
      {!collapsed ? <span className="truncate">{title}</span> : null}
    </button>
  )
}

export default ConversationItem
