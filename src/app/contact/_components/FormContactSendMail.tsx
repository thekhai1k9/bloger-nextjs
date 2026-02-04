import React from 'react'
import Layout from '@/components/Layouts/Layout'


interface FormContactSendMailIProps {
  loading: boolean,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormContactSendMail:React.FC<FormContactSendMailIProps> = ({ loading, handleSubmit}) => {
  return (
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16">
          <div className="bg-light/80 rounded-2xl shadow-2xl flex justify-center text-center">
            <main className="min-h-screen max-w-4xl mx-auto px-6 py-20">
              <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
              <p className="text-gray-600 mb-12">Feel free to reach out if you want to work together or just say hi 👋</p>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                <input
                  name="title"
                  placeholder="Your title"
                  className="w-full border px-4 py-3 rounded-md"
                  required
                />
                <input
                  name="nameforyou"
                  type="email"
                  placeholder="Your email"
                  className="w-full border px-4 py-3 rounded-md"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  className="w-full border px-4 py-3 rounded-md"
                  required
                />
                <button
                  disabled={loading}
                  className="bg-black text-white px-6 py-3 rounded-md"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </main>
          </div>
        </Layout>
      </main>
  )
}

export default FormContactSendMail