/// <reference types="cypress" />
import { faker } from "@faker-js/faker";
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

  it("Radio btn", () => {
    //site render check
    cy.PageCheck("radio-button", "Radio Button");

    // first two radio btns
    const expectedTexts = ["Yes", "Impressive"];
    cy.get('input[type="radio"]:not(:disabled)').each(($radio, index) => {
      cy.wrap($radio).check({ force: true });
      cy.get(".text-success").should("have.text", expectedTexts[index]);
    });

    //check third option
    cy.get("#noRadio").should("be.disabled");
  });

  it("web tables", () => {
    const user = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 65 }),
      salary: faker.number.int({ min: 30000, max: 150000 }),
      department: faker.commerce.department(),
    };

    cy.PageCheck("webtables", "Web Tables");

    // add the people
    cy.get("#addNewRecordButton").click();
    cy.get("#firstName").type(user.firstname);
    cy.get("#lastName").type(user.lastname);
    cy.get("#userEmail").type(user.email);
    cy.get("#age").type(user.age);
    cy.get("#salary").type(user.salary);
    cy.get("#department").type(user.department);
    cy.get("#submit").click();

    cy.get(".rt-tr-group").first().should("contain.text", "Cierra"); // checking if the first element is coorect o rnot
    cy.get(".rt-tr-group").should("contain.text", user.firstname); // checking if the first element is coorect o rnot

    //search for the people
    cy.get("#searchBox").type(user.firstname);
    cy.get("#basic-addon2").click();
    cy.get(".rt-tr-group").first().should("have.length.greaterThan", 0);
    cy.get("#searchBox").clear();

    cy.get("#edit-record-1").click();

    const new_age = 40;
    let originalAge;

    cy.get("#age")
      .invoke("val")
      .then((val) => {
        originalAge = Number(val); // Save original value
        cy.log(`Original Age: ${originalAge}`);
      })
      .then(() => {
        // Type the new value
        cy.get("#age").clear().type(new_age.toString());
      })
      .then(() => {
        // Get the new value and assert it's different
        cy.get("#age")
          .invoke("val")
          .then((updatedVal) => {
            const updatedAge = Number(updatedVal);
            cy.log(`Updated Age: ${updatedAge}`);

            expect(updatedAge).to.not.equal(originalAge);
          });
      });
    cy.get("#submit").click();

    cy.get(".rt-tr-group")
      .first()
      .within(() => {
        cy.get(".rt-td").eq(2).should("have.text", new_age);
      });

    // checking the deletion now
    cy.get("#delete-record-1").click();
    cy.get("#edit-record-1").should("not.exist");

    //checking the row drop down
    cy.get(".rt-tr-group").should("have.length.lessThan", 11);
    cy.get('select[aria-label="rows per page"]').select("20");
    cy.get(".rt-tr-group").should("have.length.greaterThan", 11);
  });

  it("special buttons ", () => {
    cy.PageCheck("buttons", "Buttons");

    cy.get("#doubleClickBtn").dblclick();
    cy.get("#doubleClickMessage").should("be.visible");

    cy.get("#rightClickBtn").rightclick();
    cy.get("#rightClickMessage").should("be.visible");

    cy.contains("button", /^Click Me$/).click(); // using regex here
    cy.get("#dynamicClickMessage").should("be.visible");
  });

  it.only("Links check", () => {
    cy.PageCheck("links", "Links");

    cy.get("#simpleLink").invoke("removeAttr", "target").click();

    // DYNMIC LINK
    cy.PageCheck("links", "Links");
    cy.get("#dynamicLink")
      .should("have.attr", "href")
      .and("include", "/")
    cy.url().should("include", "/");
  });
});
