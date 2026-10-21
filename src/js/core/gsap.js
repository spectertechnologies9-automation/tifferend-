import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// One easing family for the whole site (see docs/MOTION_REFERENCE.md)
gsap.defaults({ ease: 'expo.out', duration: 0.9 });
ScrollTrigger.config({ ignoreMobileResize: true });

export const EASE = { out: 'expo.out', inOut: 'expo.inOut', soft: 'power3.out' };
export const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export { gsap, ScrollTrigger, SplitText };
