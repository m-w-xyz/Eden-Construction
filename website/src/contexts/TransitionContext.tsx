'use client'

import { createContext, useContext, type ReactNode } from 'react'

type TransitionPhase = 'idle' | 'covering' | 'covered' | 'revealing'

const TransitionContext = createContext<TransitionPhase>('idle')

export function TransitionProvider({
  phase,
  children,
}: {
  phase: TransitionPhase
  children: ReactNode
}) {
  return (
    <TransitionContext.Provider value={phase}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransitionPhase() {
  return useContext(TransitionContext)
}
