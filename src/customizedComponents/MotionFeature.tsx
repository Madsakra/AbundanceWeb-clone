import { motion } from "motion/react"

type MotionFeatureProps = {
 imgSrc:string;
 title:string;
 content:string;   
}




export default function MotionFeature({imgSrc,title,content}:MotionFeatureProps) {
  return (
    <motion.div className='h-[90vh] lg:h-[50vh]  w-full flex flex-col lg:flex-row items-center justify-center gap-5 my-10'
    initial={{opacity:0, }}
    whileInView={{opacity:1,  transition:{delay: 0.2 ,duration: 0.5}}}
    viewport={{once:false,amount:0.3}}>
    <img src={imgSrc} className='w-96 rounded-xl min-h-96 '></img>

    <div className='flex flex-col leading-loose tracking-wide gap-5 px-12 md:w-1/2 mt-10'>
    <h1 className="text-5xl">{title}</h1>
    <h2 className='font-light'>{content}</h2>
    </div>

</motion.div>
  )
}
