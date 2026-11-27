import ChatIcon, { type ChatIconName } from './ChatIcon'

interface PromptSuggestion {
  title: string
  description: string
  prompt: string
  icon: ChatIconName
}

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void
}

const suggestions: PromptSuggestion[] = [
  {
    title: 'Unpack a complex idea',
    description: 'Make a difficult concept feel clear',
    prompt: 'Explain a complex idea in a clear, intuitive way.',
    icon: 'spark',
  },
  {
    title: 'Explore a creative direction',
    description: 'Find a fresh angle on a blank page',
    prompt: 'Give me three unexpected creative directions for a new project.',
    icon: 'idea',
  },
  {
    title: 'Compare approaches',
    description: 'Weigh different ways to solve a problem',
    prompt: 'Compare two different approaches to solving a difficult problem.',
    icon: 'compare',
  },
  {
    title: 'Work through some code',
    description: 'Reason about an implementation',
    prompt: 'Help me reason through a clean implementation for a small feature.',
    icon: 'code',
  },
]

function ChatWelcome({ onSelectPrompt }: ChatWelcomeProps) {
  return (
    <section className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center px-5 pb-5 pt-10 sm:px-8 sm:pt-4">
      <div className="mb-8 sm:mb-10">
        <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.045] text-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.035)]">
          <ChatIcon name="spark" className="size-[21px]" />
        </div>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          A better answer starts with a question
        </p>
        <h1 className="max-w-[600px] text-3xl font-medium leading-tight tracking-[-0.05em] text-white sm:text-[2.65rem]">
          Bring a question
          <br className="hidden sm:block" /> to the arena.
        </h1>
        <p className="mt-4 max-w-[540px] text-sm leading-6 text-zinc-400 sm:text-[15px] sm:leading-7">
          Two AI models will take on your prompt. Compare their perspectives
          and see what emerges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            type="button"
            onClick={() => onSelectPrompt(suggestion.prompt)}
            className="group flex min-h-[82px] items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60 sm:p-4"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-zinc-400 transition group-hover:text-zinc-200">
              <ChatIcon name={suggestion.icon} className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-zinc-200">
                {suggestion.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                {suggestion.description}
              </span>
            </span>
            <ChatIcon
              name="arrow"
              className="mt-1 size-4 shrink-0 text-zinc-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default ChatWelcome
