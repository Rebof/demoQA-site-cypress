Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

beforeEach(() => {
  cy.clearAllCookies();
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
  cy.visit("/");
});

describe("new windows and alerts", () => {
  it("tests all window behaviors", () => {
    cy.PageCheck("browser-windows", "Browser Windows");

    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
  
    // Test tab button opens /sample
    cy.get("#tabButton").click();
    cy.get("@windowOpen").should("be.calledWith", "/sample");
  
    // Reset the stub's history before next use
    cy.get("@windowOpen").invoke('resetHistory');
  
    // Test window button opens /sample
    cy.get("#windowButton").click();
    cy.get("@windowOpen").should("be.calledWith", "/sample");
  
    cy.get("@windowOpen").invoke('resetHistory');
  
    // Test message window button calls window.open (URL unknown, so just check called)
    cy.get("#messageWindowButton").click();
    cy.get("@windowOpen").should("be.called");
  });
  
  it("handles alert, delayed alert, prompt, and confirmation boxes", () => {
    cy.PageCheck("alerts", "Alerts");

    // Listen for any alert during the test and assert conditionally
    cy.on("window:alert", (text) => {
      if (text === "You clicked a button") {
        expect(text).to.equal("You clicked a button"); // normal alert
      } else if (text.includes("This alert appeared after 5 seconds")) {
        expect(text).to.contain("This alert appeared after 5 seconds"); // delayed alert
      }
    });

    // 1. Normal alert
    cy.get("#alertButton").click();

    // 2. Delayed alert
    cy.get("#timerAlertButton").click();
    cy.wait(6000); // wait for delayed alert to appear

    // 3. Prompt box
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("My Input").as("promptStub");
    });
    cy.get("#promtButton").click();
    cy.get("@promptStub").should("be.called");
    cy.get("#promptResult").should("be.visible").and("contain", "My Input")

    // 4. Confirm box - OK
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true).as("confirmStub");
    });
    cy.get("#confirmButton").click();
    cy.get("@confirmStub").should("be.calledWith", "Do you confirm action?");
    cy.get("#confirmResult").should("contain", "Ok");

 
  });
  
  it('iframe body without the nests', () => {
    cy.PageCheck("frames", "Frames");

    cy.wait(5000)
    cy.getIframeBody("#frame1").find("#sampleHeading").should("contain", "This is a sample page");


    cy.getIframeBody("#frame2")
      .find("#sampleHeading")
      .should("contain", "This is a sample page");


  });

  it("iframe with nests", () => {
    cy.PageCheck("nestedframes", "Nested Frames");

    cy.wait(5000);
    cy.getIframeBody("#frame1")
      .within(()=>{
        cy.get("iframe") 
          .its("0.contentDocument")
          .should("exist")
          .its("body")
          .should("not.be.empty")
          .then(cy.wrap)
          .find("p") 
          .should("contain", "Child Iframe");
      });
  });

it.only('modal dialogs', () => {
  cy.PageCheck("modal-dialogs", "Modal Dialogs");

  cy.get("#showLargeModal").click();
  cy.get(".modal-body")
    .first()
    .should(
      "contain",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    );
  // there a p tag here
  cy.get("#closeLargeModal").click();

  cy.get("#showSmallModal").click();
  cy.get('#example-modal-sizes-title-sm')
    .should("contain", "Small Modal");
  cy.get("#closeSmallModal").click();
});   
});
