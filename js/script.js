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

const bookingExperienceStatus =
    document.querySelector("#bookingExperienceStatus");

const bookingExperienceStatusText =
    document.querySelector("#bookingExperienceStatusText");

const bookingFormSelectedList =
    document.querySelector("#bookingFormSelectedList");

const bookingSummaryCount =
    document.querySelector("#bookingSummaryCount");


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

    if (
        bookingExperienceStatus &&
        bookingExperienceStatusText
    ) {

        if (selectedActivities.length === 0) {

            bookingExperienceStatus.classList.remove(
                "ready"
            );

            bookingExperienceStatusText.textContent =
                "SELECT AN EXPERIENCE TO CONTINUE";

        } else {

            const count =
                selectedActivities.length;

            bookingExperienceStatus.classList.add(
                "ready"
            );

            bookingExperienceStatusText.textContent =
                `${count} ${
                    count === 1
                        ? "EXPERIENCE"
                        : "EXPERIENCES"
                } READY FOR BOOKING`;

        }

    }

    if (selectedActivities.length === 0) {

        bookingSummaryEmpty.style.display = "block";

        bookingSummarySelected.innerHTML = "";

        bookingSummaryCount.classList.remove("show");


        return;
    }

    bookingSummaryEmpty.style.display = "none";

    bookingSummaryCount.classList.add("show");

    const count = selectedActivities.length;

    bookingSummaryCount.textContent =
        `${count} ${count === 1 ? "EXPERIENCE" : "EXPERIENCES"} SELECTED`;


    bookingSummarySelected.innerHTML = "";

    selectedActivities.forEach(function (activity) {

        const selectedItem = document.createElement("div");

        selectedItem.className =
            "booking-selected-item";

        selectedItem.innerHTML = `
        <div class="booking-selected-info">
            <span class="booking-selected-check">✓</span>
            <span>${activity}</span>
             </div>

             <button
            type="button"
            class="booking-remove-button"
            data-activity="${activity}"
             >
             REMOVE
            </button>
        `;

        bookingSummarySelected.appendChild(
            selectedItem
        );

    });

    const removeButtons =
    bookingSummarySelected.querySelectorAll(
        ".booking-remove-button"
    );

removeButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const activityToRemove =
                button.dataset.activity;

            selectedActivities =
                selectedActivities.filter(
                    function (activity) {
                        return activity !== activityToRemove;
                    }
                );

            bookingActivityCards.forEach(
                function (card) {

                    if (
                        card.dataset.activity ===
                        activityToRemove
                    ) {
                        card.classList.remove(
                            "selected"
                        );
                    }

                }
            );

            updateBookingSummary();

        }
    );

});

if (bookingFormSelectedList) {

    bookingFormSelectedList.innerHTML = "";

    if (selectedActivities.length === 0) {

        bookingFormSelectedList.innerHTML = `
            <p class="booking-form-no-selection">
                No experiences selected yet.
            </p>
        `;

    } else {

        selectedActivities.forEach(function (activity) {

            const selectedFormItem =
                document.createElement("div");

            selectedFormItem.className =
                "booking-form-selected-item";

            selectedFormItem.innerHTML = `
                <span class="booking-form-selected-check">✓</span>
                <span>${activity}</span>
            `;

            bookingFormSelectedList.appendChild(
                selectedFormItem
            );

        });

    }

}

updateBookingPrice();

}

// =================================
// BOOKING FORM VALIDATION
// =================================

const bookingForm = document.querySelector("#bookingForm");
const bookingDate = document.querySelector("#bookingDate");
const bookingPhone = document.querySelector("#bookingPhone");

// =================================
// LIVE BOOKING PRICE CALCULATOR
// =================================

const bookingVisitors = document.querySelector("#bookingVisitors");
const bookingDuration = document.querySelector("#bookingDuration");

const priceActivities = document.querySelector("#priceActivities");
const priceVisitors = document.querySelector("#priceVisitors");
const priceDuration = document.querySelector("#priceDuration");
const priceBaseTotal = document.querySelector("#priceBaseTotal");
const priceDiscount = document.querySelector("#priceDiscount");
const priceFinalTotal = document.querySelector("#priceFinalTotal");
const bookingDiscountRow = document.querySelector("#bookingDiscountRow");

const durationPrices = {
    10: 100,
    20: 180,
    30: 250,
    40: 330,
    50: 415,
    60: 499,
    70: 580,
    80: 660,
    90: 745,
    100: 830,
    110: 915,
    120: 998
};

function updateBookingPrice() {

    if (
        !priceActivities ||
        !priceVisitors ||
        !priceDuration ||
        !priceBaseTotal ||
        !priceDiscount ||
        !priceFinalTotal
    ) {
        return;
    }

    const activityCount = selectedActivities.length;
    const visitorValue = bookingVisitors ? bookingVisitors.value : "";
    const durationValue = bookingDuration ? bookingDuration.value : "";

    const visitors = parseInt(visitorValue, 10);
    const durationPrice = durationPrices[durationValue];

    priceActivities.textContent = activityCount;
    priceVisitors.textContent = Number.isNaN(visitors) ? "0" : visitors;

    if (durationValue && durationPrice) {
        const durationOption =
            bookingDuration.options[bookingDuration.selectedIndex];

        priceDuration.textContent =
            durationOption.textContent.split(" — ")[0];
    } else {
        priceDuration.textContent = "—";
    }

    if (
        activityCount === 0 ||
        Number.isNaN(visitors) ||
        !durationValue ||
        !durationPrice
    ) {
        priceBaseTotal.textContent = "₹0";
        priceDiscount.textContent = "- ₹0";
        priceFinalTotal.textContent = "₹0";

        if (bookingDiscountRow) {
            bookingDiscountRow.style.display = "flex";
        }

        return;
    }

    const baseTotal =
        activityCount * visitors * durationPrice;

    let discount = 0;

    if (visitors >= 4) {
        discount = baseTotal * 0.25;
    }

    const finalTotal = baseTotal - discount;

    priceBaseTotal.textContent =
        `₹${baseTotal.toLocaleString("en-IN")}`;

    priceDiscount.textContent =
        `- ₹${discount.toLocaleString("en-IN")}`;

    priceFinalTotal.textContent =
        `₹${finalTotal.toLocaleString("en-IN")}`;

    if (bookingDiscountRow) {
        if (visitors >= 4) {
            bookingDiscountRow.style.display = "flex";
        } else {
            bookingDiscountRow.style.display = "none";
        }
    }
}

if (bookingVisitors) {
    bookingVisitors.addEventListener(
        "change",
        updateBookingPrice
    );
}

if (bookingDuration) {
    bookingDuration.addEventListener(
        "change",
        updateBookingPrice
    );
}


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