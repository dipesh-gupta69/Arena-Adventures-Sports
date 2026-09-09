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