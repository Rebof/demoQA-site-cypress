Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

beforeEach(() => {
  cy.clearAllCookies();
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
  cy.visit("/");
});

describe("form testing ", () => {
  it("passes", () => {
    cy.PageCheck("automation-practice-form", "Practice Form");
    cy.get("#firstName").type("Rebof");
    cy.get("#lastName").type("Katwal");
    cy.get("#userEmail").type("Rebof@gmail.com");
    //gender
    cy.get("#gender-radio-1").check({ force: true });
    cy.get("#userNumber").type("9803639387");
    //date
    // cy.get("#dateOfBirthInput").invoke("val", "10 Oct 2003").trigger("change");
    // Click to open the date picker
    cy.get("#dateOfBirthInput").click();

    // Select year
    cy.get(".react-datepicker__year-select").select("2003");

    // Select month
    cy.get(".react-datepicker__month-select").select("October");

    // Select day
    cy.get(
      ".react-datepicker__day--010:not(.react-datepicker__day--outside-month)"
    ).click();

    const subjects = ["Maths", "English", "Physics"];

    subjects.forEach((subject) => {
      // 1. Type into the React Select input
      cy.get(".subjects-auto-complete__control input").type(subject);

      // 2. Wait for dropdown and select the matching option
      cy.get(".subjects-auto-complete__menu") // dropdown container
        .contains(subject)
        .click();
    });

    // sports
    cy.get("#hobbiesWrapper").within(() => {
      cy.get("input[type=checkbox]").each(($checkbox) => {
        cy.wrap($checkbox).check({ force: true });
      });
    });
    // file uploads
    cy.get("#uploadPicture").attachFile("rebof.png");

    cy.get("#currentAddress").type("Bagdol, Lalitpur");
    // state and city

    cy.get("#state").click();
    cy.get("#react-select-3-option-3").click();

    cy.get("#city").click();
    cy.get("#react-select-4-option-1").click();

    cy.contains("Submit").click();

    // Expected values matching what i entered
    const expectedData = {
      "Student Name": "Rebof Katwal",
      "Student Email": "Rebof@gmail.com",
      Gender: "Male",
      Mobile: "9803639387",
      "Date of Birth": "10 October,2003",
      Subjects: "Maths, English, Physics",
      Hobbies: "Sports, Reading, Music",
      Picture: "rebof.png",
      Address: "Bagdol, Lalitpur",
      "State and City": "Rajasthan Jaiselmer",
    };

    // Wait for the modal table to appear (adjust selector if needed)
    cy.get("table.table.table-dark").should("be.visible");

    // Verify each row in the modal's table matches expected value
    Object.entries(expectedData).forEach(([label, value]) => {
      cy.get("table.table.table-dark tbody tr")
        .contains("td", label)
        .siblings("td")
        .should("have.text", value);
    });
  });
});
