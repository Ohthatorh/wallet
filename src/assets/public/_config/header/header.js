import 'regenerator-runtime/runtime'
import './_header.scss'
import '../hamburgers/hamburgers.scss'
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout') {
    localStorage.clear()
    document.location.href = 'index.html'
  }
  if (e.target.id === 'atms') document.location.href = 'atms.html'
  if (e.target.id === 'currency') document.location.href = 'currency.html'
  if (e.target.id === 'accounts' || e.target.id === 'logo')
    document.location.href = 'cabinet.html'
})

const hamburger = document.querySelector('.hamburger')
if (hamburger) {
  const headerListElement = document.querySelector('.header__wrap-list')
  hamburger.addEventListener('click', () => {
    headerListElement.classList.toggle('is-active')
    hamburger.classList.toggle('is-active')
  })
}
