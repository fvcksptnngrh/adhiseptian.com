import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default (_, inject) => {
  inject('gsap', gsap)
  inject('ScrollTrigger', ScrollTrigger)
}
