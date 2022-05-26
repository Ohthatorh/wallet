/// <reference types="cypress" />

describe("Приложение Coin - Вход", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5050/");
  });

  it("Кнопка Войти неактивна, пока поля с логином и паролем пустые или их длина меньше 6 символов", () => {
    cy.get("#login").type('qwert');
    cy.get("#password").type('qwert');
    cy.get(".main__form-link").should("have.class", "disabled");
  });
  it("Кнопка Войти активна, когда поля с логином и паролем не пустые и их длина составляет больше 6 символов", () => {
    cy.get("#login").type('developer');
    cy.get("#password").type('skillbox');
    cy.get(".main__form-link").should("not.have.class", "disabled");
  });
  it("В поля ввода нельзя вводить пробелы", () => {
    cy.get("#login")
      .type(' ')
      .should("have.value", '');
    cy.get("#password")
      .type(' ')
      .should("have.value", '');
  });
  it("При вводе неверного логина и пароля, не происходит редирект и вылезает ошибка", () => {
    cy.get("#login")
      .type('qwerty')
    cy.get("#password")
      .type('qwerty')
    cy.get(".main__form-link").click()
    cy.get(".message").should("have.class", "error")
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
  });
  it("При вводе правильного логина и пароля происходит редирект на страницу со счетами", () => {
    cy.get("#login")
      .type('developer')
    cy.get("#password")
      .type('skillbox')
    cy.get(".main__form-link").click()
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/cabinet.html')
    })
  })
});

describe("Приложение Coin - Кабинет", () => {
  beforeEach(()=> {
    cy.visit("http://localhost:5050/cabinet.html");
  })
  it("Кнопка Счета неактивна", () => {
    cy.get("#accounts")
      .should("be.disabled", true)
  })
})
