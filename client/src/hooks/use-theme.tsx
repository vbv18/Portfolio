import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider(children: ReactNode) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'system'
        return (localStorage.getItem('theme') as Theme) || 'system'
    })

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
        theme === 'system' ? getSystemTheme() : theme,
    )

    useEffect(() => {
        const root = document.documentElement
        const applied = theme === 'system' ? getSystemTheme() : theme
        root.classList.toggle('dark', applied === 'dark')
        setResolvedTheme(applied)
    }, [theme])

    useEffect(() => {
        if (theme !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const listener = () => {
            const applied = getSystemTheme()
            document.documentElement.classList.toggle('dark', applied === 'dark')
            setResolvedTheme(applied)
        }
        mq.addEventListener('change', listener)
        return () => mq.removeEventListener('change', listener)
    }, [theme])

    const setTheme = (nextTheme: Theme) => {
        localStorage.setItem('theme', nextTheme)
        setThemeState(nextTheme)
    }

    const value = useMemo(() => (
        {
            theme,
            resolvedTheme,
            setTheme
        }
    ), [theme, resolvedTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
