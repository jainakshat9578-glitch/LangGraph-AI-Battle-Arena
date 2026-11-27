import { useState } from 'react'
import type { ConversationSummary } from '../types'
import ChatIcon from './ChatIcon'
import ConversationItem from './ConversationItem'

interface ChatSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  activeConversationId: string | null
  localConversation: ConversationSummary | null
  onNewBattle: () => void
  onSelectConversation: (conversation: ConversationSummary) => void
  onCloseMobile: () => void
}

const conversationGroups = [
  {
    label: 'Today',
    conversations: [
      { id: 'sample-today-1', title: 'Untangling a hard problem' },
      { id: 'sample-today-2', title: 'The shape of language' },
      { id: 'sample-today-3', title: 'Ideas for a better morning' },
    ],
  },
  {
    label: 'Yesterday',
    conversations: [
      { id: 'sample-yesterday-1', title: 'A more thoughtful itinerary' },
      { id: 'sample-yesterday-2', title: 'Could time have a beginning?' },
    ],
  },
  {
    label: 'Previous 7 Days',
    conversations: [
      { id: 'sample-week-1', title: 'When models disagree' },
      { id: 'sample-week-2', title: 'The language of small spaces' },
      { id: 'sample-week-3', title: 'A question about emergence' },
    ],
  },
]

interface SidebarContentsProps {
  collapsed: boolean
  mobile: boolean
  activeConversationId: string | null
  localConversation: ConversationSummary | null
  onNewBattle: () => void
  onSelectConversation: (conversation: ConversationSummary) => void
  onCloseMobile: () => void
}

function SidebarContents({
  collapsed,
  mobile,
  activeConversationId,
  localConversation,
  onNewBattle,
  onSelectConversation,
  onCloseMobile,
}: SidebarContentsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const showLocalConversation =
    localConversation?.title.toLowerCase().includes(normalizedQuery) ?? false
  const filteredGroups = conversationGroups.map((group) => ({
    ...group,
    conversations: [
      ...(group.label === 'Today' && localConversation && showLocalConversation
        ? [localConversation]
        : []),
      ...group.conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(normalizedQuery),
      ),
    ],
  }))
  const hasVisibleConversations =
    filteredGroups.some((group) => group.conversations.length > 0)

  const handleNewBattle = () => {
    onNewBattle()
    if (mobile) onCloseMobile()
  }

  const handleSelect = (conversation: ConversationSummary) => {
    onSelectConversation(conversation)
    if (mobile) onCloseMobile()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={`flex h-[68px] shrink-0 items-center border-b border-white/[0.07] ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-zinc-100">
            <ChatIcon name="brand" className="size-[18px]" />
          </div>
          {!collapsed ? (
            <span className="truncate text-[11px] font-semibold tracking-[0.12em] text-zinc-200">
              AI BATTLE ARENA
            </span>
          ) : null}
        </div>
        {mobile ? (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onCloseMobile}
            className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
          >
            <ChatIcon name="close" />
          </button>
        ) : null}
      </div>

      <div className={`shrink-0 space-y-2 px-3 pb-4 pt-4 ${collapsed ? 'px-2' : ''}`}>
        <button
          type="button"
          title={collapsed ? 'New Battle' : undefined}
          onClick={handleNewBattle}
          className={`flex h-10 w-full items-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.055] px-3 text-sm font-medium text-zinc-100 transition hover:border-white/[0.15] hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <ChatIcon name="plus" className="size-[17px] shrink-0" />
          {!collapsed ? <span>New Battle</span> : null}
        </button>

        {collapsed ? (
          <button
            type="button"
            title="Search conversations"
            aria-label="Search conversations"
            className="flex h-10 w-full items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
          >
            <ChatIcon name="search" />
          </button>
        ) : (
          <label className="flex h-10 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 px-3 text-zinc-500 transition focus-within:border-white/15 focus-within:text-zinc-300">
            <ChatIcon name="search" className="size-4 shrink-0" />
            <input
              type="search"
              aria-label="Search conversations"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search conversations"
              className="min-w-0 flex-1 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
            />
            <span className="hidden rounded border border-white/[0.08] px-1 py-0.5 text-[9px] text-zinc-600 xl:inline">
              ⌘ K
            </span>
          </label>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {!collapsed ? (
          <p className="mb-3 px-2 text-[10px] font-medium uppercase tracking-[0.17em] text-zinc-600">
            Recent conversations
          </p>
        ) : null}

        <div className="space-y-4">
          {filteredGroups.map((group) =>
            group.conversations.length > 0 ? (
              <section key={group.label}>
                {!collapsed ? (
                  <h2 className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    {group.label}
                  </h2>
                ) : null}
                <div className="space-y-0.5">
                  {group.conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      title={conversation.title}
                      active={activeConversationId === conversation.id}
                      collapsed={collapsed}
                      onClick={() => handleSelect(conversation)}
                    />
                  ))}
                </div>
              </section>
            ) : null,
          )}

          {!hasVisibleConversations && !collapsed ? (
            <p className="px-2 py-3 text-xs leading-5 text-zinc-600">
              No conversations match that search.
            </p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <button
          type="button"
          title={collapsed ? 'Settings' : undefined}
          className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] text-zinc-400 transition hover:bg-white/[0.055] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <ChatIcon name="settings" className="size-4 shrink-0" />
          {!collapsed ? <span>Settings</span> : null}
        </button>
        <div className={`mt-2 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2 ${collapsed ? 'justify-center border-transparent bg-transparent px-0' : ''}`}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#242428] text-[10px] font-semibold text-zinc-300">
            AM
          </div>
          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-300">
                  Arena Member
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-600">Preview mode</p>
              </div>
              <button
                type="button"
                aria-label="Log out (visual only)"
                title="Log out"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
              >
                <ChatIcon name="logout" className="size-[17px]" />
              </button>
            </>
          ) : null}
        </div>
        {collapsed ? (
          <button
            type="button"
            aria-label="Log out (visual only)"
            title="Log out"
            className="mt-1 flex h-9 w-full items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
          >
            <ChatIcon name="logout" className="size-[17px]" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

function ChatSidebar({
  collapsed,
  mobileOpen,
  activeConversationId,
  localConversation,
  onNewBattle,
  onSelectConversation,
  onCloseMobile,
}: ChatSidebarProps) {
  return (
    <>
      <aside
        aria-label="Conversation sidebar"
        className={`hidden h-dvh shrink-0 flex-col border-r border-white/[0.07] bg-[#0c0c0f] transition-[width] duration-300 ease-out md:flex ${collapsed ? 'w-[76px]' : 'w-[232px] xl:w-[276px]'}`}
      >
        <SidebarContents
          collapsed={collapsed}
          mobile={false}
          activeConversationId={activeConversationId}
          localConversation={localConversation}
          onNewBattle={onNewBattle}
          onSelectConversation={onSelectConversation}
          onCloseMobile={onCloseMobile}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Conversation sidebar"
            className="absolute inset-y-0 left-0 w-[min(288px,calc(100%-2rem))] border-r border-white/10 bg-[#0c0c0f] shadow-[24px_0_80px_rgba(0,0,0,0.5)] animate-[slide-in_180ms_ease-out]"
          >
            <SidebarContents
              collapsed={false}
              mobile
              activeConversationId={activeConversationId}
              localConversation={localConversation}
              onNewBattle={onNewBattle}
              onSelectConversation={onSelectConversation}
              onCloseMobile={onCloseMobile}
            />
          </aside>
        </div>
      ) : null}
    </>
  )
}

export default ChatSidebar
