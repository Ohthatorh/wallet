/// <reference types="cypress" />

describe("Приложение Coin - Вход", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5050/");
  });

  it("Кнопка Войти неактивна, пока поля с логином и паролем пустые или их длина меньше 6 символов", () => {
    cy.get("#login").type('qwert');
    cy.get("#password").type('qwert');
    cy.get(".main__form-button").should("be.disabled", true);
  });
  it("Кнопка Войти активна, когда поля с логином и паролем не пустые и их длина составляет больше 6 символов", () => {
    cy.get("#login").type('developer');
    cy.get("#password").type('skillbox');
    cy.get(".main__form-button").should("be.not.disabled", true);
  });
  it("В поля ввода нельзя вводить пробелы", () => {
    cy.get("#login")
      .type(' ')
      .should("have.value", '');
    cy.get("#password")
      .type(' ')
      .should("have.value", '');
  });
  it("При вводе неверного логина и пароля, появляется лоадер на кнопке, не происходит редирект и вылезает ошибка", () => {
    cy.get("#login")
      .type('qwerty')
    cy.get("#password")
      .type('qwerty')
    cy.get(".main__form-button").click().and('have.a.class', 'loading')
    cy.get(".message").should("have.class", "error")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
  });
  it("При вводе правильного логина и пароля, происходит редирект на страницу со счетами", () => {
    cy.get("#login")
      .type('developer')
    cy.get("#password")
      .type('skillbox')
    cy.get(".main__form-button").click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/cabinet.html')
    })
  })
});

describe("Приложение Coin - Кабинет", () => {
  beforeEach(()=> {
    cy.visit("http://localhost:5050/");
    cy.get("#login")
      .type('developer')
    cy.get("#password")
      .type('skillbox')
    cy.get(".main__form-link").click()
  })
  it("Кнопка Счета неактивна", () => {
    cy.get("#accounts")
      .should("be.disabled", true)
  })
  it("При нажатии на кнопку Создать новый счёт, пока идет загрузка появляется лоадер, после создания лоадер пропадает и создается новый счёт", () => {
    cy.get('.main__wrap-button').click().and("have.class", "loading")
    cy.get(".message").should("have.class", "success")
  })
  it("При нажатии на сортировку, элементы сортируются", () => {
    cy.wait(2000)
    cy.get(".main__wrap-sort")
      .click()
      .find('.main__wrap-sort-item').each(el=>{
        el.click()
      })
  })
  it("При нажатии на кнопку Выйти, выходит из личного кабинета", () => {
    cy.get("#logout").click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/index.html')
    })
  })
});

describe("Приложение Coin - Валюта", () => {
  beforeEach(()=> {
    cy.visit("http://localhost:5050/");
    cy.get("#login")
      .type('developer')
    cy.get("#password")
      .type('skillbox')
    cy.get(".main__form-link").click()
    cy.visit("http://localhost:5050/currency.html");
  })
  it("Кнопка Валюта неактивна", () => {
    cy.get("#currency")
      .should("be.disabled", true)
  })
  it ("После загрузки страницы поле Сумма пустое и кнопка Обменять неактивна", () => {
    cy.wait(2000)
    cy.get('#amount')
      .should("have.value", "")
    cy.get(".main__exchange-button")
      .and("be.disabled", true)
  })
  it("В поле Сумма можно вводить только цифры", () => {
    cy.get("#amount")
      .type('!')
      .should("have.value", '')
      .type('*')
      .should("have.value", '')
      .type(' ')
      .should("have.value", '')
       .type('D')
       .should("have.value", '')
       .type('Ф')
       .should("have.value", '')
  })
  it("После заполнения поля Сумма, кнопка Обменять становится активной, при обмене появляется лоадер и обмен валюты производится. После обмена валюты поле Сумма пустое и кнопка Обменять становится неактивной.", () => {
    cy.get('#amount').type("1")
    cy.get(".main__exchange-button")
      .should('be.not.disabled', true)
      .click()
      .and("have.class", "loading")
    cy.get(".message").should("have.class", "success")
    cy.get('#amount').should('have.value', "");
    cy.get(".main__exchange-button")
      .and("be.disabled", true)
  })
});

describe("Приложение Coin - Просмотр счёта", () => {
  beforeEach(()=> {
    cy.visit("http://localhost:5050/");
    cy.get("#login")
      .type('developer')
    cy.get("#password")
      .type('skillbox')
    cy.get(".main__form-link").click()
    cy.visit("http://localhost:5050/account.html?74213041477477406320783754");
  })
  it("При загрузке страницы поля Номера счёта и Суммы переводов - пустые, кнопка Отправить неактивна", () => {
    cy.get('#account-to').should('have.value', "");
    cy.get('#amount').should('have.value', "");
    cy.get(".main__info-form-button")
      .and("be.disabled", true)
  })
  it("При заполнении Номера счёта кнопка Отправить остаётся неактивной", () => {
    cy.get('#account-to').type("1")
    cy.get(".main__info-form-button")
      .and("be.disabled", true)
  })
  it("При заполнении Суммы кнопка Отправить остаётся неактивной", () => {
    cy.get('#amount').type("1")
    cy.get(".main__info-form-button")
      .and("be.disabled", true)
  })
  it("В поле Номер счёта и Сумма можно вводить только цифры", () => {
    cy.get("#account-to")
      .type('!')
      .should("have.value", '')
      .type('*')
      .should("have.value", '')
      .type(' ')
      .should("have.value", '')
      .type('D')
      .should("have.value", '')
      .type('Ф')
      .should("have.value", '')
    cy.get("#amount")
      .type('!')
      .should("have.value", '')
      .type('*')
      .should("have.value", '')
      .type(' ')
      .should("have.value", '')
      .type('D')
      .should("have.value", '')
      .type('Ф')
      .should("have.value", '')
  })
  it("При заполнении Суммы и Номера счёта кнопка Отправить становится активной, при нажатии на кнопку появляется лоадер, транзакция проходит, поля становятся пустыми, кнопка неактивной", () => {
    cy.get('#account-to').type("123")
    cy.get('#amount').type("1")
    cy.get(".main__info-form-button")
      .and("be.not.disabled", true)
      .click()
      .and("have.class", "loading")
    cy.get(".message").should("have.class", "success")
    cy.get('#account-to').should('have.value', "");
    cy.get('#amount').should('have.value', "");
    cy.get(".main__info-form-button")
      .and("be.disabled", true)
  })
  it("При нажатии на график происходит переход на страницу с историей баланса", () => {
    cy.get("#chart").click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/history.html')
    })
  })
  it("При нажатии на кнопку Назад возвращается на страницу назад", () => {
    cy.get(".main__panel-button").click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/cabinet.html')
    })
  })
});
