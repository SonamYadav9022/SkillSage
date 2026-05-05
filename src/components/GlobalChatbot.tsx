'use client'

import { useState } from 'react'

export default function GlobalChatbot() {
  const [open, setOpen] =
    useState(false)

  const [messages, setMessages] =
    useState([
      {
        text: 'Hi 👋 How can I help you?',
        type: 'bot',
        options: [
          'Resume Help',
          'Roadmap Help',
          'Courses',
          'Stress Help',
          'Other',
        ],
      },
    ])

  const reply = (
    option: string
  ) => {
    setMessages((prev: any) => [
      ...prev,
      {
        text: option,
        type: 'user',
      },
    ])

    let bot = 'Please contact counselor.'

    if (
      option ===
      'Resume Help'
    )
      bot =
        'Upload resume from Dashboard → Upload Resume.'

    if (
      option ===
      'Roadmap Help'
    )
      bot =
        'Generate roadmap after setting goal.'

    if (
      option ===
      'Courses'
    )
      bot =
        'Recommended: Web Dev, Data Science, AI.'

    if (
      option ===
      'Stress Help'
    )
      bot =
        'Take breaks, stay consistent, talk to counselor.'

    setMessages((prev: any) => [
      ...prev,
      {
        text: bot,
        type: 'bot',
        options: [
          'Resume Help',
          'Roadmap Help',
          'Courses',
          'Stress Help',
          'Other',
        ],
      },
    ])
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-full bg-blue-600 text-white shadow-xl"
      >
        AI Guide
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[370px] h-[520px] bg-white rounded-3xl shadow-2xl border flex flex-col">

          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-blue-600 text-lg">
              AI Guide
            </h2>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map(
              (
                msg: any,
                i
              ) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl ${
                    msg.type ===
                    'bot'
                      ? 'bg-gray-100'
                      : 'bg-blue-100 ml-10'
                  }`}
                >
                  <p>
                    {msg.text}
                  </p>

                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.options.map(
                        (
                          item: string
                        ) => (
                          <button
                            key={
                              item
                            }
                            onClick={() =>
                              reply(
                                item
                              )
                            }
                            className="px-3 py-1 rounded-xl border text-sm hover:bg-blue-50"
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  )
}