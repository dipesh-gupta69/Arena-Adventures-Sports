const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

menuToggle.addEventListener("click", function (){
    navigation.classList.toggle("menu-open")
});

// =================================
// SCROLL REVEAL
// =================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});

// =================================
// ACTIVE NAVIGATION
// =================================

const currentPage = window.location.pathname.split("/").pop();

const navigationLinks = document.querySelectorAll(
    ".main-navigation a:not(.book-button)"
);

navigationLinks.forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")
    ) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }

});

// =================================
// BOOKING ACTIVITY SELECTION
// =================================

const bookingActivityCards = document.querySelectorAll(
    ".booking-activity-card"
);

const bookingSummaryEmpty = document.querySelector(
    "#bookingSummaryEmpty"
);

const bookingSummarySelected = document.querySelector(
    "#bookingSummarySelected"
);

let selectedActivities = [];

bookingActivityCards.forEach(function (card) {

    const selectButton = card.querySelector(
        ".booking-select-button"
    );

    selectButton.addEventListener("click", function () {

        const activityName = card.dataset.activity;

        if (selectedActivities.includes(activityName)) {

            selectedActivities = selectedActivities.filter(
                function (activity) {
                    return activity !== activityName;
                }
            );

            card.classList.remove("selected");

        } else {

            selectedActivities.push(activityName);

            card.classList.add("selected");
        }

        updateBookingSummary();

    });

});


function updateBookingSummary() {

    if (selectedActivities.length === 0) {

        bookingSummaryEmpty.style.display = "block";

        bookingSummarySelected.innerHTML = "";

        return;
    }

    bookingSummaryEmpty.style.display = "none";

    bookingSummarySelected.innerHTML = "";

    selectedActivities.forEach(function (activity) {

        const selectedItem = document.createElement("div");

        selectedItem.className =
            "booking-selected-item";

        selectedItem.innerHTML = `
            <span class="booking-selected-check">✓</span>
            <span>${activity}</span>
        `;

        bookingSummarySelected.appendChild(
            selectedItem
        );

    });

}

// =================================
// BOOKING FORM VALIDATION
// =================================

const bookingForm = document.querySelector("#bookingForm");
const bookingDate = document.querySelector("#bookingDate");
const bookingPhone = document.querySelector("#bookingPhone");


// Prevent past dates
if (bookingDate) {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const minimumDate =
        `${year}-${month}-${day}`;

    bookingDate.min = minimumDate;
}


// Allow only numbers in phone field
if (bookingPhone) {

    bookingPhone.addEventListener(
        "input",
        function () {

            this.value = this.value.replace(
                /[^0-9]/g,
                ""
            );

        }
    );
}


// Validate booking form
if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            if (!bookingForm.checkValidity()) {

                bookingForm.reportValidity();

                return;
            }

            if (bookingPhone.value.length !== 10) {

                alert(
                    "Please enter a valid 10-digit phone number."
                );

                bookingPhone.focus();

                return;
            }

            if (selectedActivities.length === 0) {

                alert(
                    "Please select at least one activity before requesting a booking."
                );

                document
                    .querySelector("#bookingActivities")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                return;
            }

            const bookingConfirmation =
         document.querySelector("#bookingConfirmation");

         const bookingReference =
          document.querySelector("#bookingReference");

         const referenceNumber =
             Math.floor(100000 + Math.random() * 900000);

            bookingReference.textContent =
            `ARENA-${referenceNumber}`;

           bookingForm.style.display = "none";

          bookingConfirmation.classList.add("show");

          bookingConfirmation.scrollIntoView({
           behavior: "smooth",
          block: "start"
         });


        }
    );
}