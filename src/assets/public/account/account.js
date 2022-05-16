import { convertDate } from '../../components/convertDate/convertDate.js'
import { showMessage } from '../../components/showMessage/showMessage.js'
import { getFilteredAmountByDate } from '../../components/getFilteredAmountByDate.js'
import { getMonthsFromTransactions } from '../../components/getMonthsFromTransactions.js'
import { getAmountsFromTransactions } from '../../components/getAmountsFromTransactions.js'
import '../../../dist/scripts/chart.js'
import '../_config/header/header.js'
import '../account/_account.scss'

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bearerToken') && document.location.search) {
    refreshAccount(document.location.search.substring(1))
  } else {
    document.location.href = 'index.html'
  }
})

document.addEventListener('click', async (e) => {
  if (e.target.className === 'main__panel-button button') {
    document.location.href = 'cabinet.html'
  }

  if (e.target.className === 'chart') {
    document.location.href = `history.html?${document.location.search.substring(
      1
    )}`
  }
})

async function refreshAccount(account) {
  const accountsUrl = new URL(`http://localhost:3000/account/${account}`)
  return await fetch(accountsUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('bearerToken')}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      // const allAccounts = [];
      // res.payload.transactions.forEach((transaction) => {
      //   if (!allAccounts.find((element) => element === transaction.to)) {
      //     allAccounts.push(transaction.to);
      //   }
      // });
      const reverseTransactions = res.payload.transactions.slice().reverse()
      refreshChart(reverseTransactions)
      refreshTable(reverseTransactions, res.payload)
      refreshFormTransfer()
    })
}
function refreshChart(data) {
  const dateNow = new Date().getFullYear()
  const filteredData = getFilteredAmountByDate(data)
  const chartElement = document.querySelector('.main__info-chart')
  chartElement.classList.remove('skeleton')
  const chartBody = `
    <h3 class="main__info-chart-title title">
      Динамика баланса
    </h3>
    <ul class="main__info-chart-year-list">
    </ul>
    <canvas class="chart" id="chart" width="510" height="165"></canvas>
  `
  chartElement.insertAdjacentHTML('beforeend', chartBody)
  const yearListElement = document.querySelector('.main__info-chart-year-list')
  let chart = new Chart(document.getElementById('chart'), {
    type: 'bar',
    data: {
      labels: getMonthsFromTransactions(filteredData, dateNow),
      datasets: [
        {
          label: 'Сумма в рублях',
          backgroundColor: ['#116AAC'],
          data: getAmountsFromTransactions(filteredData, dateNow),
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  })
  Object.keys(filteredData).forEach((date) => {
    const yearLiElement = document.createElement('li')
    yearLiElement.classList.add(
      'main__info-chart-year',
      `${date == dateNow ? 'active' : 'none'}`
    )
    yearLiElement.textContent = date
    yearLiElement.addEventListener('click', (e) => {
      document
        .querySelectorAll('.main__info-chart-year')
        .forEach((el) => el.classList.remove('active'))
      e.currentTarget.classList.add('active')
      chart.destroy()
      chart = new Chart(document.getElementById('chart'), {
        type: 'bar',
        data: {
          labels: getMonthsFromTransactions(filteredData, date),
          datasets: [
            {
              label: 'Сумма в рублях',
              backgroundColor: ['#116AAC'],
              data: getAmountsFromTransactions(filteredData, date),
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      })
    })
    yearListElement.append(yearLiElement)
  })
}
function refreshTable(transactions, account) {
  const transactionsSection = document.querySelector('.main__history')
  if (transactionsSection.classList.contains('skeleton')) {
    transactionsSection.classList.remove('skeleton')
    const transactionBody = `
      <h3 class="main__history-title title">
        История переводов
      </h3>
      <ul class="main__history-list">
        <li class="main__history-item list-titles">
          <p class="main__history-item-title">
            Счёт отправителя
          </p>
          <p class="main__history-item-title">
            Счёт получателя
          </p>
          <p class="main__history-item-title">
            Сумма
          </p>
          <p class="main__history-item-title">
            Дата
          </p>
        </li>
      </ul>
    `
    transactionsSection.insertAdjacentHTML('beforeend', transactionBody)
  }
  const transactionsList = document.querySelector('.main__history-list')
  const transactionsItems = document.querySelectorAll('.main__history-item')
  transactionsItems.forEach((el, i) => (i !== 0 ? el.remove() : []))
  transactions.forEach((el, i) => {
    if (i < 10) {
      const item = `
        <li class="main__history-item">
          <p class="main__history-item-text">
          <span>Счёт отправителя</span>
            ${el.from}
          </p>
          <p class="main__history-item-text">
          <span>Счёт получателя</span>
            ${el.to}
          </p>
          <p class="main__history-item-text ${
            el.to === document.location.search.substring(1)
              ? 'adding'
              : 'decrease'
          }">
          <span>Сумма</span>
            ${el.amount} ₽
          </p>
          <p class="main__history-item-text">
          <span>Дата</span>
            ${convertDate(el.date)}
          </p>
        </li>
      `
      transactionsList.insertAdjacentHTML('beforeend', item)
      document
        .querySelectorAll('.main__history-item')
        [++i].addEventListener('click', () => {
          document.location.href = `history.html?${document.location.search.substring(
            1
          )}`
        })
    }
  })
  const accountNumberElement = document.getElementById('account-number')
  const balanceElement = document.getElementById('balance')
  accountNumberElement.classList.remove('skeleton', 'skeleton-title')
  accountNumberElement.textContent = `№ ${account.account}`
  balanceElement.innerHTML = ''
  balanceElement.classList.remove('skeleton', 'skeleton-text')
  balanceElement.insertAdjacentHTML(
    'beforeend',
    `Баланс: <span>${account.balance} ₽</span>`
  )
}
function refreshFormTransfer() {
  const formTransferElement = document.querySelector('.main__info-form')
  formTransferElement.classList.remove('skeleton')
  const bodyFormTransfer = `
    <h3 class="main__info-form-title title">
      Новый перевод
    </h3>
    <label class="main__info-form-label">
      Номер счёта получателя
      <input id="account-to" type="number" class="main__info-form-input" placeholder="Номер счёта">
    </label>
    <label class="main__info-form-label">
      Сумма перевода
      <input id="amount" type="number" class="main__info-form-input" placeholder="Сумма">
    </label>
    <button disabled class="main__info-form-button">
      Отправить
    </button>
  `
  formTransferElement.insertAdjacentHTML('beforeend', bodyFormTransfer)
  const accountTo = document.getElementById('account-to')
  const amount = document.getElementById('amount')
  const transferButtonElement = document.querySelector(
    '.main__info-form-button'
  )
  transferButtonElement.addEventListener('click', async (e) => {
    e.preventDefault()
    e.target.classList.add('loading')
    const transferUrl = new URL(`http://localhost:3000/transfer-funds`)
    return await fetch(transferUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${localStorage.getItem('bearerToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: document.location.search.substring(1),
        to: accountTo.value,
        amount: amount.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        e.target.classList.remove('loading')
        if (res.payload) {
          accountTo.value = ''
          amount.value = ''
          transferButtonElement.disabled = true
          showMessage('Перевод прошёл успешно!', 'success')
          const reverseTransactions = res.payload.transactions.slice().reverse()
          refreshTable(reverseTransactions, res.payload)
        }
        if (res.error) {
          switch (res.error) {
            case 'Invalid account from':
              showMessage(
                'Не указан адрес счёта списания, или этот счёт не принадлежит нам',
                'error'
              )
              break
            case 'Invalid account to':
              showMessage(
                'Не указан счёт зачисления, или этого счёта не существует',
                'error'
              )
              break
            case 'Invalid amount':
              showMessage(
                'Не указана сумма перевода, или она отрицательная',
                'error'
              )
              break
            case 'Overdraft prevented':
              showMessage('На счёте не хватает средств', 'error')
              break
          }
        }
      })
  })
  document.querySelectorAll('.main__info-form-input').forEach((input) => {
    input.addEventListener('input', () => {
      if (accountTo.value.length && amount.value.length) {
        transferButtonElement.disabled = false
      } else {
        transferButtonElement.disabled = true
      }
    })
  })
}
