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
  return;
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