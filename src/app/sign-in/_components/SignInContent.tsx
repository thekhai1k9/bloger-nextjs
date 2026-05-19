'use client'

import React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import toast from 'react-hot-toast'

import {
  EmailIcon,
  FaceBookIcon,
  GithubIcon,
  GoogleICon,
  PasswordIcon,
} from '@/components/ui/Icon'
import Layout from '@/components/Layouts/Layout'
import TransitionEffect from '@/components/animations/TransitionEffect'
import AnimationText from '@/components/animations/AnimationText'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import {createClient} from '@/lib/supabase/client'

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập Email')
    .email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
})

type SignInInput = z.infer<typeof signInSchema>

const SignInContent = () => {
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignInInput) => {
    // 1. Gọi Supabase Auth để xác thực tài khoản
    const {data, error} = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (data?.user) {
      const {data: dbUser} = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      const role = dbUser?.role || 'user'

      if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/articles')
      }
      router.refresh()
    }
  }

  return (
    <React.Fragment>
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <div className="bg-light/80 rounded-2xl shadow-2xl flex justify-center text-center">
            <div className="w-3/5 p-5">
              <div className="text-left font-bold dark:text-dark">
                <span className="text-primary">KP</span>BLOG
              </div>
              <div className="py-10">
                <AnimationText
                  className="!text-3xl font-bold text-primary mb-2 dark:!text-dark"
                  text="Sign in to Account"
                />
                <div className="border-2 w-10 border-primary inline-block mb-2" />

                <div className="flex justify-center my-2">
                  <motion.a
                    href={'#'}
                    target={'_blank'}
                    whileHover={{y: -2}}
                    className="border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0"
                  >
                    <GoogleICon className="w-8 h-8" />
                  </motion.a>
                  <motion.a
                    href={'#'}
                    target={'_blank'}
                    whileHover={{y: -2}}
                    className="border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0"
                  >
                    <FaceBookIcon className="w-8 h-8" />
                  </motion.a>
                  <motion.a
                    href={'#'}
                    target={'_blank'}
                    whileHover={{y: -2}}
                    className="border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0 dark:rounded-full dark:bg-dark"
                  >
                    <GithubIcon className="!w-[32px]" />
                  </motion.a>
                </div>
                <p className="text-dark/60 my-3 text-sm dark:!text-dark">
                  or use your email account
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col items-center w-full"
                >
                  {/* Ô Nhập Email */}
                  <div className="w-64 mb-3 text-left">
                    <Input
                      variant="auth"
                      type="text"
                      placeholder="Email"
                      {...register('email')}
                      icon={
                        <EmailIcon className="w-4 h-4 mr-3 sm:mx-1 dark:rounded-full" />
                      }
                      error={errors.email?.message}
                    />
                  </div>

                  {/* Ô Nhập Password */}
                  <div className="w-64 mb-3 text-left">
                    <Input
                      variant="auth"
                      type="password"
                      placeholder="Password"
                      {...register('password')} 
                      icon={
                        <PasswordIcon className="w-4 h-4 mr-3 sm:mx-1 dark:rounded-full" />
                      }
                      error={errors.password?.message}
                    />
                  </div>

                  <div className="flex justify-center w-64 mb-5">
                    <span className="flex items-center text-xs dark:text-dark">
                      Dont not have an account?
                      <Link
                        href={'/sign-up'}
                        className="text-xs text-blueLink ml-2 hover:text-blueLink/80 font-bold"
                      >
                        Sign up
                      </Link>
                    </span>
                  </div>

                  <Button variant="auth-submit" loading={isSubmitting}>
                    Sign In
                  </Button>
                </form>
              </div>
            </div>

            <div className="w-2/5 bg-primary text-light rounded-tr-2xl rounded-br-2xl py-36 px-12 xs:hidden">
              <h2 className="text-3xl font-bold mb-2">Hello, friend!</h2>
              <div className="border-2 w-10 border-light inline-block mb-2" />
              <p className="mb-10 text-sm">
                Fill up personal information and start journey with us.
              </p>
              <Link
                href="/sign-up"
                className="border-2 border-light rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-primary lg:text-sm md:text-[10px] md:!px-10 sm:!px-5"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default SignInContent
