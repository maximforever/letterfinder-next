import Image from 'next/image'
import styles from './page.module.css'
import { WordPanel } from '@/components/WordPanel'
import { Analytics } from '@/components/Analytics'

export default function Home() {
  return (
    <main>
      Hello world!
      <WordPanel />
      <Analytics />
    </main>
  )
}
