'use client';

import { useScroll, useTransform, motion, MotionValue } from 'motion/react';
import React, { useRef, forwardRef } from 'react';
interface SectionProps {
  scrollYProgress: MotionValue<number>;
}
const Section1: React.FC<SectionProps> = ({
  scrollYProgress
}) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  return;
};
const Section2: React.FC<SectionProps> = ({
  scrollYProgress
}) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  return <motion.section style={{
    scale,
    rotate
  }} className='relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white'>
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
      <article className='container mx-auto relative z-10'>
        
        <div className='grid grid-cols-4 gap-4'>
          <img src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&auto=format&fit=crop' alt='Abstract painting' className='object-cover w-full rounded-md h-full' />
          <img src='https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&auto=format&fit=crop' alt='Oil painting' className='object-cover w-full rounded-md' />
          <img src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&auto=format&fit=crop' alt='Watercolor artwork' className='object-cover w-full rounded-md h-full' />
          <img src='https://images.unsplash.com/photo-1578322450569-1fe7e0b8b91f?w=500&auto=format&fit=crop' alt='Digital art' className='object-cover w-full rounded-md h-full' />
        </div>
      </article>
    </motion.section>;
};
const HeroScrollAnimation = forwardRef<HTMLElement>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });
  return <>
      
    </>;
});
HeroScrollAnimation.displayName = 'HeroScrollAnimation';
export default HeroScrollAnimation;