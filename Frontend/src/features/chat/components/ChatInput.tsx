import ChatIcon from './ChatIcon'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
}

function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const message = value.trim()

  const sendMessage = () => {
    if (message) onSend(message)
  }

  return (
    <div className="mx-auto w-full max-w-[820px] px-4 pb-3 pt-3 sm:px-6 sm:pb-5">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
        className="rounded-2xl border border-white/[0.1] bg-[#111114] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.28)] transition focus-within:border-white/[0.17]"
      >
        <label htmlFor="chat-prompt" className="sr-only">
          Your prompt
        </label>
        <textarea
          id="chat-prompt"
          rows={2}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Ask anything worth thinking about..."
          className="max-h-40 min-h-[52px] w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600"
        />

        <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-1">
          <p className="min-w-0 text-[10px] leading-4 text-zinc-600 sm:text-[11px]">
            Two AI models will compete to answer.
          </p>
          <button
            type="submit"
            disabled={!message}
            aria-label="Send prompt"
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 ${message ? 'bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95' : 'cursor-not-allowed bg-white/[0.06] text-zinc-600'}`}
          >
            <ChatIcon name="send" className="size-[17px]" />
          </button>
        </div>
      </form>
      <p className="mt-2.5 text-center text-[10px] text-zinc-600">
        Shift + Enter for a new line
      </p>
    </div>
  )
}

export default ChatInput
