'use client'

import Layout from '@/components/Layouts/Layout'
import AnimationText from '@/components/animations/AnimationText'
import TransitionEffect from '@/components/animations/TransitionEffect'
import Button from '@/components/ui/Button'
import {
  EmailIcon,
  FaceBookIcon,
  GithubIcon,
  GoogleICon,
  PasswordIcon,
} from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import {createClient} from '@/lib/supabase/client'
import {motion} from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { MailCheck } from 'lucide-react'

const signUpSchema = z.object({
  name: z.string().min(5, 'Tên phải có ít nhất 5 ký tự'),
  email: z
    .string()
    .min(1, 'Vui lòng nhập Email')
    .email('Email không đúng định dạng'),
  password: z.string().min(8, 'Mật khẩu phải từ 8 ký tự trở lên'),
})

type SignUpInput = z.infer<typeof signUpSchema>

const SignUpContent = () => {
  const supabase = createClient()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    // mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignUpInput) => {
    const {data, error} = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          role: 'user',
          full_name: values.name,
        },
      },
    })

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(
      'Đăng ký thành công! Hãy kiểm tra hộp thư email để kích hoạt tài khoản.',
    )
    setIsSuccess(true)
  }

  return (
    <React.Fragment>
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <div className="bg-light/80 rounded-2xl shadow-2xl flex justify-center text-center">
            <div className="w-3/5 p-5">
              <div className="text-left font-bold">
                <span className="text-primary dark:text-dark">KP</span>BLOG
              </div>
              { !isSuccess ? (
                <div className="py-10">
                  <AnimationText
                    className="!text-3xl font-bold text-primary mb-2 dark:!text-dark"
                    text="Sign up for Account"
                  />
                  <div className="border-2 w-10 border-primary inline-block mb-2" />

                  {/* Mạng xã hội */}
                  <div className="flex justify-center my-2">
                    <motion.a
                      href={'#'}
                      whileHover={{y: -2}}
                      className="border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0"
                    >
                      <GoogleICon className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                      href={'#'}
                      whileHover={{y: -2}}
                      className="border-2 border-light/70 rounded-full mx-3 dark:border-transparent dark:p-0"
                    >
                      <FaceBookIcon className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                      href={'#'}
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
                    {/* Ô Nhập Tên */}
                    <div className="w-64 mb-3 text-left">
                      <Input
                        variant="auth"
                        icon={<GithubIcon className='w-5 h-5 dark:bg-dark dark:rounded-full'/>}
                        placeholder="User name"
                        {...register('name')}
                        error={errors.name?.message}
                      />
                    </div>

                    {/* Ô Nhập Email */}
                    <div className="w-64 mb-3 text-left">
                      <Input
                        variant="auth"
                        icon={<EmailIcon className='w-4 h-4'/>}
                        placeholder="Email"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>

                    {/* Ô Nhập Mật Khẩu */}
                    <div className="w-64 mb-3 text-left">
                      <Input
                        variant="auth"
                        type="password"
                        icon={<PasswordIcon className='w-4 h-4'/>}
                        placeholder="Password"
                        {...register('password')}
                        error={errors.password?.message}
                      />
                    </div>

                    <div className="flex justify-center w-64 mb-5">
                      <span className="flex items-center text-xs dark:text-dark">
                        Have an account?
                        <Link
                          href={'/sign-in'}
                          className="text-xs text-blueLink ml-2 hover:text-blueLink/80 font-bold"
                        >
                          Sign in
                        </Link>
                      </span>
                    </div>

                    <Button variant="auth-submit" loading={isSubmitting}>
                      Sign Up
                    </Button>
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='py-10 flex flex-col items-center text-center px-6'
                >
                  <div className="w-16 h-16 bg-[#f5f3ff] rounded-2xl flex items-center justify-center text-[#8b5cf6] mb-6 animate-bounce">
                    <MailCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Check your inbox!</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Một liên kết xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra và kích hoạt tài khoản để bắt đầu trải nghiệm.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <Link href="/sign-in" className="bg-[#8b5cf6] text-white text-xs px-6 py-3 rounded-xl font-semibold hover:bg-[#7c3aed] transition-all">
                      Go to Sign In
                    </Link>
                    <button className="border border-gray-200 text-gray-600 text-xs px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                      Resend Email
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            <div className="w-2/5 bg-primary text-light rounded-tr-2xl rounded-br-2xl py-36 px-12 xs:hidden">
              <h2 className="text-3xl font-bold mb-2">Hello, friend!</h2>
              <div className="border-2 w-10 border-light inline-block mb-2" />
              <p className="mb-10 text-sm">
                Fill up personal information and start journey with us.
              </p>
              <Link
                href="/sign-in"
                className="border-2 border-light rounded-full px-12 py-2 inline-block font-semibold hover:bg-white/80 hover:text-primary lg:text-sm md:text-[10px] md:!px-10 sm:!px-5"
              >
                Sign In
              </Link>
            </div>
          </div>
        </Layout>
      </main>
    </React.Fragment>
  )
}

export default SignUpContent
