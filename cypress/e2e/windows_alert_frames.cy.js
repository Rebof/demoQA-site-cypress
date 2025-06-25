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
  
  it('alerts', () => {
    
  });
});
