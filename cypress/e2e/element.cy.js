/// <reference types="cypress" />

// Prevent Cypress from failing due to uncaught exceptions from the page
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

beforeEach(() => {
  cy.clearAllCookies();
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
  cy.visit("/");
});

describe("Testing the web elements", () => {
  it("Checking the textbox", () => {
    cy.fixture("userINFO.json").then((user) => {
      //site render check
      cy.PageCheck("text-box", "Text Box");

      // input fields data filling
      cy.get("#userName").type(user.name);
      cy.get("#userEmail").type(user.email);
      cy.get("#currentAddress").type(user.current_address);
      cy.get("#permanentAddress").type(user.permanent_address);
      cy.get("#submit").click();

      // verifying the fields after submission
      cy.get("#name").should("contain.text", user.name);
      cy.get("#email").should("contain.text", user.email);
      cy.get(".border > #currentAddress").should(
        "contain.text",
        user.current_address
      );
      cy.get(".border > #permanentAddress").should(
        "contain.text",
        user.permanent_address
      );
    });
  });

  it("Checkboxes", () => {
    //site render check
    cy.PageCheck("checkbox", "Check Box");

    //checking the expansion btn
    cy.get(".rct-icon.rct-icon-expand-all").click();
    cy.get("label[for='tree-node-desktop'] span[class='rct-title']").should(
      "contain.text",
      "Desktop"
    );
    cy.get("label[for='tree-node-desktop'] span[class='rct-title']").should(
      "be.visible"
    );
    cy.get("label[for='tree-node-downloads'] span[class='rct-title']").should(
      "contain.text",
      "Downloads"
    );

    //checking minimization
    cy.get(".rct-icon.rct-icon-collapse-all").click();
    cy.get("label[for='tree-node-desktop'] span[class='rct-title']").should(
      "not.exist"
    );

    //ticking the home checkbox
    cy.get("#tree-node-home").check({ force: true });
    cy.get("#result").should("be.visible");
    cy.get("#result > :nth-child(2)").should("have.text", "home");

    //unchecking the desktop under home
    cy.get("button[title='Toggle']").click(); //opening the drop downs
    cy.get("label[for='tree-node-desktop']").find(".rct-checkbox").click();
    cy.get("#result > :nth-child(2)").should("not.have.text", "desktop");
  });

  it.only("Radio btn", () => {
    //site render check
    cy.PageCheck("radio-button", "Radio Button");

    const expectedTexts = ["Yes", "Impressive"];

    cy.get('input[type="radio"]:not(:disabled)').each(($radio, index) => {
      cy.wrap($radio).check({ force: true });
      cy.get(".text-success").should("have.text", expectedTexts[index]);
    });

    //check third option
    cy.get("#noRadio").should("be.disabled");
  });
});
