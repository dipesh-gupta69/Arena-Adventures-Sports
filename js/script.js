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