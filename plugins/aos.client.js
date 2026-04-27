import 'aos/dist/aos.css'

let aosPromise

function loadAos() {
  if (!aosPromise) {
    aosPromise = import('aos').then(function (module) {
      var AOS = module.default || module
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 30
      })
      return AOS
    })
  }

  return aosPromise
}

function scheduleLoad() {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () { loadAos() })
  } else {
    setTimeout(function () { loadAos() }, 1)
  }
}

export default function ({ app }, inject) {
  inject('refreshAos', function () {
    return loadAos().then(function (AOS) {
      AOS.refresh()
      return AOS
    })
  })

  scheduleLoad()

  app.router.afterEach(function () {
    setTimeout(function () {
      loadAos().then(function (AOS) {
        AOS.refresh()
      })
    }, 200)
  })
}
