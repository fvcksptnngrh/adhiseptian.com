let gsapBundlePromise

export default function (_, inject) {
  inject('loadGsap', function () {
    if (!gsapBundlePromise) {
      gsapBundlePromise = Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]).then(function (modules) {
        var gsap = modules[0].gsap || modules[0].default || modules[0]
        var ScrollTrigger = modules[1].ScrollTrigger || modules[1].default
        gsap.registerPlugin(ScrollTrigger)
        return { gsap: gsap, ScrollTrigger: ScrollTrigger }
      })
    }

    return gsapBundlePromise
  })
}
