import AOS from 'aos'
import 'aos/dist/aos.css'

export default ({ app }) => {
  AOS.init({
    duration: 600,
    easing: 'ease-out-cubic',
    once: true,
    offset: 30
  })

  // Refresh AOS on every route change so new page elements animate in
  app.router.afterEach(function () {
    setTimeout(function () {
      AOS.refresh()
    }, 200)
  })
}
