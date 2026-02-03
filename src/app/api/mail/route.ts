import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (req: Request) => {
  try {
    const { title, nameforyou, message } = await req.json()

    if (!title || !nameforyou || !message) {
      return NextResponse.json(
        { message: 'Missing fields' },
        { status: 400 }
      )
    }

    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL!],
      subject: `New message from ${nameforyou}`,
      html: `
        <h4><b/>${title}</h4>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('MAIL ERROR:', error)
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
