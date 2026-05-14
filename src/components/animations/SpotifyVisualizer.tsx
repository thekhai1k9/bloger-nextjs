import {motion} from 'framer-motion'

export default function SpotifyVisualizer() {
  return (
    <div className="flex items-center justify-center gap-[2px] w-5 h-5">
      {[1, 2, 3].map((bar) => (
        <motion.span
          key={bar}
          className="w-[3px] bg-green-500"
          initial={{height: '20%'}}
          animate={{
            height: ['20%', '100%', '40%', '80%', '20%'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: bar * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}
