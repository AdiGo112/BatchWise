import { useEffect, useMemo, useRef, useState } from "react"
import { useApp } from "../context/AppContext"
import { timeAgo } from "../utils"
import "../styles/ChatDefault.css"

// Seed threads, keyed by the other participant's user id.
const SEED = {
  2: [
    { from: "them", text: "Hey, did you apply for the Infosys drive?", at: 5 },
    { from: "me", text: "Registering tonight. Deadline is Feb 5.", at: 4 },
    { from: "them", text: "Same. Want to prep aptitude together?", at: 3 }
  ],
  4: [
    { from: "them", text: "Saw your post on the Google process — happy to do a mock round.", at: 26 },
    { from: "me", text: "That would help a lot, thank you!", at: 25 }
  ],
  9: [
    { from: "them", text: "Sending you the DL notes from last sem.", at: 50 }
  ]
}

const KEY = "batchwise:chats"

export default function ChatDefault() {
  const { users, currentUser } = useApp()

  // Chat with everyone except yourself, seeded threads first.
  const contacts = useMemo(
    () => users
      .filter(u => u.id !== currentUser.id)
      .sort((a, b) => (SEED[b.id] ? 1 : 0) - (SEED[a.id] ? 1 : 0)),
    [users, currentUser.id]
  )

  const [threads, setThreads] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) return JSON.parse(stored)
    } catch { /* fall through to seed */ }
    // Convert the "hours ago" seed offsets into real timestamps once.
    return Object.fromEntries(
      Object.entries(SEED).map(([id, msgs]) => [
        id,
        msgs.map(m => ({ from: m.from, text: m.text, at: new Date(Date.now() - m.at * 36e5).toISOString() }))
      ])
    )
  })

  const [selectedId, setSelectedId] = useState(contacts[0]?.id)
  const [draft, setDraft] = useState("")
  const [query, setQuery] = useState("")
  const endRef = useRef(null)

  const selected = contacts.find(c => c.id === selectedId)
  const messages = threads[selectedId] ?? []

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(threads)) } catch { /* quota */ }
  }, [threads])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length, selectedId])

  // The input used to be disabled, so this page was a screenshot.
  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setThreads(t => ({
      ...t,
      [selectedId]: [...(t[selectedId] ?? []), { from: "me", text, at: new Date().toISOString() }]
    }))
    setDraft("")
  }

  const visible = contacts.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()))

  if (!selected) return null

  return (
    <div className="chatdefault-page">
      <div className="chatdefault-sidebar">
        <h3>Chats</h3>
        <input
          className="chat-search"
          placeholder="Search people…"
          aria-label="Search people"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="chat-contacts">
          {visible.map(contact => {
            const last = (threads[contact.id] ?? []).at(-1)
            return (
              <button
                key={contact.id}
                className={`chatdefault-user ${selectedId === contact.id ? "active" : ""}`}
                onClick={() => setSelectedId(contact.id)}
              >
                <img className="chatdefault-avatar" src={contact.avatar} alt="" />
                <div className="chat-contact-text">
                  <span className="chat-contact-name">{contact.name}</span>
                  <span className="chat-contact-preview">
                    {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : contact.role}
                  </span>
                </div>
              </button>
            )
          })}
          {visible.length === 0 && <p className="muted chat-empty">No one matches “{query}”.</p>}
        </div>
      </div>

      <div className="chatdefault-chat">
        <div className="chatdefault-header">
          <img className="chatdefault-avatar small" src={selected.avatar} alt="" />
          <div>
            <h4>{selected.name}</h4>
            <span className="muted">
              {selected.role}{selected.batch ? ` · Batch ${selected.batch}` : ""}
            </span>
          </div>
        </div>

        <div className="chatdefault-messages">
          {messages.length === 0 && (
            <p className="muted chat-empty">No messages yet. Say hello 👋</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chatdefault-bubble ${msg.from}`}>
              {msg.text}
              <time>{timeAgo(msg.at)}</time>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form className="chatdefault-input" onSubmit={send}>
          <input
            placeholder={`Message ${selected.name.split(" ")[0]}…`}
            aria-label={`Message ${selected.name}`}
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <button type="submit" disabled={!draft.trim()}>Send</button>
        </form>
      </div>
    </div>
  )
}
