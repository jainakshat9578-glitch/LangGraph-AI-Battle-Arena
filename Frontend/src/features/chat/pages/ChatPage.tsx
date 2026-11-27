import { useState } from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatInput from '../components/ChatInput'
import ChatSidebar from '../components/ChatSidebar'
import ChatWelcome from '../components/ChatWelcome'
import type { ConversationSummary } from '../types'

function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeConversation, setActiveConversation] =
    useState<ConversationSummary | null>(null)
  const [localConversation, setLocalConversation] =
    useState<ConversationSummary | null>(null)
  const [localPrompts, setLocalPrompts] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')

  const handleNewBattle = () => {
    setActiveConversation(null)
    setLocalConversation(null)
    setLocalPrompts([])
    setPrompt('')
  }

  const handleSendPrompt = (message: string) => {
    const isCurrentLocalConversation =
      activeConversation?.id.startsWith('local-') &&
      activeConversation.id === localConversation?.id

    const nextConversation = isCurrentLocalConversation
      ? activeConversation
      : {
          id: `local-${Date.now()}`,
          title: message.length > 38 ? `${message.slice(0, 38).trimEnd()}…` : message,
        }

    setLocalConversation(nextConversation)
    setActiveConversation(nextConversation)
    setLocalPrompts((messages) =>
      isCurrentLocalConversation ? [...messages, message] : [message],
    )
    setPrompt('')
  }

  const handleToggleSidebar = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setSidebarCollapsed((collapsed) => !collapsed)
      return
    }

    setMobileSidebarOpen(true)
  }

  return (
    <div className="flex h-dvh min-h-[560px] overflow-hidden bg-[#09090b] text-zinc-100">
      <ChatSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        activeConversationId={activeConversation?.id ?? null}
        localConversation={localConversation}
        onNewBattle={handleNewBattle}
        onSelectConversation={setActiveConversation}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#09090b]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_0%,rgba(106,89,75,0.12),transparent_42%),radial-gradient(ellipse_at_92%_42%,rgba(82,67,101,0.07),transparent_34%)]"
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <ChatHeader
            title={activeConversation?.title ?? 'New Battle'}
            onToggleSidebar={handleToggleSidebar}
            onNewBattle={handleNewBattle}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {activeConversation === null ? (
              <ChatWelcome onSelectPrompt={setPrompt} />
            ) : activeConversation.id.startsWith('local-') ? (
              <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-5 px-5 py-8 sm:px-8 sm:py-10">
                {localPrompts.map((message, index) => (
                  <div
                    key={`${activeConversation.id}-${index}`}
                    className="ml-auto max-w-[min(85%,620px)] rounded-2xl border border-white/[0.08] bg-white/[0.055] px-4 py-3.5 text-sm leading-6 text-zinc-200 sm:px-5"
                  >
                    {message}
                  </div>
                ))}
                <p className="mx-auto mt-4 max-w-[440px] text-center text-xs leading-5 text-zinc-600">
                  This is a local UI preview. No AI response was generated and
                  nothing was sent to a service.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-5 py-10">
                <div className="max-w-[390px] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                    Sample conversation
                  </p>
                  <h1 className="mt-3 text-lg font-medium tracking-[-0.02em] text-zinc-200">
                    {activeConversation.title}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Conversation history is sample-only in this UI preview.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 bg-gradient-to-t from-[#09090b] via-[#09090b] to-[#09090b]">
            <ChatInput
              value={prompt}
              onChange={setPrompt}
              onSend={handleSendPrompt}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
