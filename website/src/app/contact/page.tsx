'use client'

import { useState } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import { useTransitionPhase } from '@/contexts/TransitionContext'

type FormData = {
  name: string
  phone: string
  email: string
  projectType: 'residential' | 'commercial' | ''
  message: string
}

export default function ContactPage() {
  const transitionPhase = useTransitionPhase()
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire up to a form provider (e.g. Formspree, Resend, or a Server Action)
    setSubmitted(true)
  }

  const isRevealed = transitionPhase === 'revealing' || transitionPhase === 'idle'

  return (
    <>
      <Nav theme="contact" />
      <main
        className="flex flex-col min-h-dvh pt-16 pb-0 bg-[#6B8CA3]"
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="flex-1 flex flex-col min-h-0 px-[10px] py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-[10px] gap-y-[120px] items-start flex-1">
            {/* Left — intro (cols 1–5, 1 col inset before form) */}
            <div className="md:col-span-5">
              <p className="font-body-medium text-[24px] text-[var(--charcoal)] leading-[24px] mb-4">
                We're a Fiji-based building company delivering New Zealand
                standards and a solutions-driven approach to every project.
              </p>
              <p className="font-body-medium text-[24px] text-[var(--charcoal)] leading-[24px] mt-10 mb-10">
                Have a project for us?
                <br />
                Get in touch.
              </p>
              {!submitted && (
                <button
                  type="submit"
                  form="contact-form"
                  className="text-[16px] md:text-[24px] font-normal tracking-normal text-[var(--charcoal)] hover:opacity-50 transition-opacity max-md:py-3 max-md:min-h-[48px] max-md:flex max-md:items-center max-md:self-start"
                >
                  Email
                </button>
              )}
            </div>

            {/* Right — form (cols 7–12, 1 col inset from left) */}
            {submitted ? (
              <div className="md:col-start-7 md:col-span-6 py-8">
                <p className="text-2xl text-[var(--charcoal)] mb-3">
                  Thank you.
                </p>
                <p className="text-[var(--charcoal)]">
                  We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <div className="md:col-start-7 md:col-span-6">
              <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-6 max-md:gap-8">
                {/* Name */}
                <div>
                  <label className="block font-sans font-normal text-[16px] md:text-[20px] text-[var(--charcoal)] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[20px] border-b border-[var(--charcoal)] bg-transparent py-2 text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/50 focus:outline-none focus:border-[var(--charcoal)] transition-colors"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans font-normal text-[16px] md:text-[20px] text-[var(--charcoal)] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full h-[20px] border-b border-[var(--charcoal)] bg-transparent py-2 text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/50 focus:outline-none focus:border-[var(--charcoal)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans font-normal text-[16px] md:text-[20px] text-[var(--charcoal)] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full h-[20px] border-b border-[var(--charcoal)] bg-transparent py-2 text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/50 focus:outline-none focus:border-[var(--charcoal)] transition-colors"
                    />
                  </div>
                </div>

                {/* Project type — 2-col grid aligned with Phone/Email, options stacked vertically */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans font-normal text-[16px] md:text-[20px] text-[var(--charcoal)] mb-2">
                      Project Type
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(['residential', 'commercial'] as const).map((type) => (
                      <label key={type} className="flex items-center justify-between cursor-pointer font-normal text-[16px] md:text-[20px] text-[var(--charcoal)]">
                        <span className="capitalize">{type}</span>
                        <input
                          type="radio"
                          name="projectType"
                          value={type}
                          checked={form.projectType === type}
                          onChange={handleChange}
                          className="appearance-none w-5 h-5 rounded-full border border-[var(--charcoal)] bg-transparent checked:bg-[var(--charcoal)] shrink-0 cursor-pointer transition-colors"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-b border-[var(--charcoal)]" />

                {/* Message */}
                <div>
                  <label className="block font-sans font-normal text-[16px] md:text-[20px] text-[var(--charcoal)] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border-b border-[var(--charcoal)] bg-transparent py-2 text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/50 focus:outline-none focus:border-[var(--charcoal)] transition-colors resize-none"
                  />
                </div>
              </form>
              </div>
            )}
          </div>
        </div>
        {/* Footer logo at bottom — full width, responds to viewport like FooterWarm */}
        <div className="mt-auto px-[10px] pt-20 pb-[10px] shrink-0">
          <Image
            src="/logo-black.svg"
            alt="Eden Construction"
            width={1420}
            height={82}
            className="w-full h-auto"
          />
        </div>
      </main>
    </>
  )
}
