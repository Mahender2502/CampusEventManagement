import { Moon, Sun } from 'lucide-react'
import useDarkMode from '../hooks/useDarkMode.js'

export default function ThemeToggle() {
  const [dark, setDark] = useDarkMode()

  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
