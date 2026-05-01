import { useState } from 'react'
import { CustomCursor, ScrollBar } from './components/Effects'
import {
  FrameCollapseHero,
  StatsMarquee,
  StickyTextSection,
  RevealImageSection,
  PinnedWordSection,
  FeaturesSection,
  AppShowcase,
  CTASection,
} from './components/Landing'
import { SettingsPanel, loadSettings, Settings } from './components/SettingsPanel'
import { ScreenId } from './components/Shell'

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [requestedScreen, setRequestedScreen] = useState<ScreenId | null>(null)
  const [jumpToken, setJumpToken] = useState(0)

  const openScreen = (id: ScreenId) => {
    setRequestedScreen(id)
    setJumpToken((t) => t + 1)
    const el = document.getElementById('app')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <CustomCursor />
      <ScrollBar />
      <FrameCollapseHero
        intensity={settings.scrollIntensity}
        onOpenScreen={openScreen}
      />
      <StatsMarquee />
      <StickyTextSection />
      <RevealImageSection />
      <PinnedWordSection />
      <FeaturesSection />
      <AppShowcase initialScreen={requestedScreen} jumpToken={jumpToken} />
      <CTASection />
      <SettingsPanel settings={settings} onChange={setSettings} />
    </>
  )
}
