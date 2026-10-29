'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from './auth-provider'

const passwordRules = [
  ['Minimum 6 characters', /^.{6,}$/],
  ['At least one uppercase letter', /[A-Z]/],
  ['At least one special character', /[^A-Za-z0-9]/],
  ['At least one lowercase letter or number', /[a-z0-9]/],
] as const

function missingPasswordRules(password: string) {
  return passwordRules.filter(([, rule]) => !rule.test(password)).map(([label]) => label.toLowerCase())
}

function errorMessage(error: unknown) {
  const code = (error as { code?: string })?.code ?? ''
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(code)) return 'Incorrect email or password.'
  if (code === 'auth/email-already-in-use') return 'An account with this email already exists. Try logging in.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.'
  if (code === 'auth/network-request-failed') return 'Network error. Check your connection.'
  return 'Something went wrong. Please try again.'
}

export function PasswordRules({ password }: { password: string }) {
  const missing = missingPasswordRules(password)
  return (
    <div className="rules" aria-live="polite">
      {passwordRules.map(([label, rule]) => (
        <div key={label} style={{ color: rule.test(password) ? '#2e7d32' : '#bd071e' }}>
          ● {label}
        </div>
      ))}
      {password && missing.length > 0 && <small>Password is missing: {missing.join(', ')}.</small>}
    </div>
  )
}

export function AuthCard({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  const { user, isAdmin, loading, signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && user && (mode === 'login' || mode === 'signup')) {
      router.replace(isAdmin ? '/admin' : '/dashboard')
    }
  }, [isAdmin, loading, mode, router, user])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage('Please enter a valid email address.')
      return
    }
    if (mode === 'signup' && form.password !== form.confirm) {
      setMessage('Passwords do not match.')
      return
    }
    if (mode !== 'forgot' && missingPasswordRules(form.password).length > 0) {
      setMessage(`Password is missing: ${missingPasswordRules(form.password).join(', ')}.`)
      return
    }
    setBusy(true)
    try {
      if (mode === 'login') await signIn(form.email, form.password)
      else if (mode === 'signup') await signUp(form.name, form.email, form.password)
      else {
        await resetPassword(form.email)
        setMessage('If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.')
      }
    } catch (error) {
      console.error('Authentication request failed:', error)
      setMessage(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  if (loading || (user && (mode === 'login' || mode === 'signup'))) {
    return <section className="section auth-section"><div className="form-card auth-card"><span className="eyebrow">NQ KAZI INVESTMENTS</span><h1>Loading your account…</h1></div></section>
  }

  return (
    <section className="section auth-section">
      <form className="form-card auth-card" onSubmit={submit}>
        <span className="eyebrow">NQ KAZI INVESTMENTS</span>
        <h1>{mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}</h1>
        {mode === 'signup' && <label className="field">FULL NAME<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
        <label className="field">EMAIL<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        {mode !== 'forgot' && <>
          <label className="field">PASSWORD<div className="password"><input required type={show ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff /> : <Eye />}</button></div></label>
          <PasswordRules password={form.password} />
        </>}
        {mode === 'signup' && <label className="field">CONFIRM PASSWORD<input required type="password" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} /></label>}
        {message && <p className="form-error" role="alert">{message}</p>}
        <button className="button red" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Login' : mode === 'signup' ? 'Create account' : 'Send reset link'} <ArrowRight /></button>
        <div className="auth-links">{mode === 'login' ? <><Link href="/signup">Create an account</Link><Link href="/forgot-password">Forgot password?</Link></> : <Link href="/login">Back to login</Link>}</div>
      </form>
    </section>
  )
}
