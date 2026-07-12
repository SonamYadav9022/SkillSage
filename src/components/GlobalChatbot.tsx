'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Send } from 'lucide-react'

interface Message {
  text: string
  type: 'user' | 'bot'
}

export default function GlobalChatbot() {
  const [open, setOpen] = useState(false)

  const [loading, setLoading] =
    useState(false)

  const [input, setInput] =
    useState('')

  const [isListening, setIsListening] =
    useState(false)

  const [mediaRecorder, setMediaRecorder] =
    useState<any>(null)

  const [messages, setMessages] =
    useState<Message[]>([
      {
        text: '👋 Hi! I am your SkillSage AI Mentor. Ask me anything about career, roadmap, coding, projects, placement, or learning.',
        type: 'bot',
      },
    ])

  const historyRef =
    useRef<
      {
        role: string
        content: string
      }[]
    >([])

  const bottomRef =
    useRef<HTMLDivElement>(null)

  /* ───────────────────────────── */
  /* AUTO SCROLL */
  /* ───────────────────────────── */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  /* ───────────────────────────── */
  /* SPEAK AI RESPONSE */
  /* ───────────────────────────── */

  const speakText = (
    text: string
  ) => {
    if (
      typeof window ===
      'undefined'
    )
      return

    const speech =
      new SpeechSynthesisUtterance(
        text
      )

    speech.lang = 'en-US'
    speech.rate = 1

    window.speechSynthesis.cancel()

    //window.speechSynthesis.speak(
      speech
    
  }

  /* ───────────────────────────── */
  /* GROQ WHISPER MIC */
  /* ───────────────────────────── */

  const handleMic = async () => {
    try {
      /* STOP RECORDING */

      if (
        isListening &&
        mediaRecorder
      ) {
        mediaRecorder.stop()

        setIsListening(false)

        return
      }

      /* START RECORDING */

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        )

      const recorder =
        new MediaRecorder(stream)

      const chunks: Blob[] = []

      recorder.ondataavailable = (
        event
      ) => {
        chunks.push(event.data)
      }

      recorder.onstop =
        async () => {
          try {
            const audioBlob =
              new Blob(chunks, {
                type: 'audio/webm',
              })

            const formData =
              new FormData()

            formData.append(
              'audio',
              audioBlob,
              'recording.webm'
            )

            const res =
              await fetch(
                '/api/voice',
                {
                  method: 'POST',
                  body: formData,
                }
              )

            const data =
              await res.json()

            if (data.text) {
              setInput((prev) =>
                prev
                  ? prev +
                    ' ' +
                    data.text
                  : data.text
              )
            }
          } catch (err) {
            console.log(err)
          }
        }

      recorder.start()

      setMediaRecorder(recorder)

      setIsListening(true)
    } catch (error) {
      console.log(error)
    }
  }

  /* ───────────────────────────── */
  /* SEND MESSAGE */
  /* ───────────────────────────── */

  const sendMessage =
    async () => {
      if (
        !input.trim() ||
        loading
      )
        return

      const userMessage =
        input.trim()

      setMessages((prev) => [
        ...prev,
        {
          text: userMessage,
          type: 'user',
        },
      ])

      setInput('')
      setLoading(true)

      historyRef.current = [
        ...historyRef.current,
        {
          role: 'user',
          content: userMessage,
        },
      ]

      try {
        const response =
          await fetch(
            '/api/ai/chat',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                message:
                  userMessage,

                conversationHistory:
                  historyRef.current.slice(
                    -10
                  ),
              }),
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.error ||
              'Request failed'
          )
        }

        const botReply =
          data.message ||
          'AI could not respond.'

        setMessages((prev) => [
          ...prev,
          {
            text: botReply,
            type: 'bot',
          },
        ])

        historyRef.current = [
          ...historyRef.current,
          {
            role: 'assistant',
            content: botReply,
          },
        ]

        /* SPEAK RESPONSE */

        speakText(botReply)
      } catch (error: any) {
        console.error(error)

        setMessages((prev) => [
          ...prev,
          {
            text: `⚠️ ${
              error.message ||
              'Something went wrong'
            }`,
            type: 'bot',
          },
        ])
      }

      setLoading(false)
    }

  return (
    <>
      {/* FLOATING BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors"
      >
        AI Guide
      </button>

      {/* CHAT WINDOW */}

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[380px] h-[600px] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700 flex flex-col overflow-hidden">

          {/* HEADER */}

          <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center bg-white dark:bg-neutral-900">
            <h2 className="font-bold text-blue-600 dark:text-blue-400 text-lg">
              SkillSage AI
            </h2>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="text-2xl text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200"
            >
              ×
            </button>
          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-950">

            {messages.map(
              (msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type ===
                    'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.type ===
                      'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-4 py-3 rounded-2xl text-sm text-gray-500 dark:text-neutral-400">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}

          <div className="p-3 border-t border-gray-200 dark:border-neutral-700 flex items-center gap-2 bg-white dark:bg-neutral-900">

            {/* INPUT + MIC */}

            <div className="relative flex-1">

              <input
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    'Enter'
                  )
                    sendMessage()
                }}
                className="w-full border border-gray-300 dark:border-neutral-600 rounded-xl px-4 py-2 pr-12 outline-none text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                disabled={loading}
              />

              {/* MIC */}

              <button
                type="button"
                onClick={handleMic}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${
                  isListening
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-neutral-400'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* SEND */}

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}