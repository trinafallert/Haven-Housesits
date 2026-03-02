'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EDU_DOMAINS = ['.edu', '.ac.uk', '.edu.au', '.ac.nz', '.edu.ca', '.ac.za', '.edu.in']

function isStudentEmail(email: string): boolean {
  return EDU_DOMAINS.some((d) => email.toLowerCase().endsWith(d))
}

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName:  z.string().min(2, 'Last name must be at least 2 characters'),
  email:     z.string().email('Please enter a valid email address'),
  password:  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum(['BOTH', 'SITTER', 'OWNER']),
})
type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const router = useRouter()
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [isStudent, setIsStudent] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'BOTH' },
  })

  const emailValue = watch('email')
  const roleValue  = watch('role')

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setIsStudent(isStudentEmail(val))
  }

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, isStudent: isStudentEmail(data.email) }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast({ title: 'Registration failed', description: json.error || 'Please try again.', variant: 'error' })
        setLoading(false)
        return
      }
      // Auto sign in after registration
      await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      router.push('/onboarding')
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'error' })
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/onboarding' })
  }

  const roles = [
    { value: 'BOTH',   label: 'Both',         desc: 'I want to sit & list my home' },
    { value: 'SITTER', label: 'Sitter',        desc: 'I want to find sits' },
    { value: 'OWNER',  label: 'Home owner',    desc: 'I want to list my home' },
  ] as const

  return (
    <div className="space-y-5">
      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-haven-sand font-medium text-haven-navy hover:border-haven-teal hover:bg-haven-teal-pale/30 transition-all"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-haven-sand" />
        <span className="text-xs text-haven-gray-light font-medium">or sign up with email</span>
        <div className="flex-1 h-px bg-haven-sand" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role picker */}
        <div>
          <p className="label">I'm joining as a...</p>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setValue('role', r.value)}
                className={cn(
                  'px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all text-center',
                  roleValue === r.value
                    ? 'border-haven-teal bg-haven-teal-pale text-haven-teal-dark'
                    : 'border-haven-sand text-haven-navy hover:border-haven-teal/50'
                )}
              >
                <div className="font-semibold">{r.label}</div>
                <div className="text-xs font-normal text-haven-gray mt-0.5 hidden sm:block">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            placeholder="Jane"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Smith"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div>
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email', { onChange: onEmailChange })}
          />
          {isStudent && (
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <GraduationCap className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                Student email detected! You'll get <strong>30% off</strong> any paid plan. 🎓
              </p>
            </div>
          )}
        </div>

        <Input
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="At least 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPw(!showPw)} className="hover:text-haven-navy transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          hint="Min 8 characters, one uppercase letter and one number"
          {...register('password')}
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create my free account
        </Button>
      </form>
    </div>
  )
}
