/* =========================
   TYPING ANIMATION
========================= */

const userName = document.getElementById("user-name");

const typingTexts = [
    {
        text: "Full-Stack Developer",
        color: "#FF6B00"
    },
    {
        text: "Python Developer",
        color: "#3776AB"
    },
    {
        text: "Backend Developer",
        color: "#22C55E"
    },
    {
        text: "Software Engineering Student",
        color: "#A855F7"
    }
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 100;
const deletingSpeed = 60;
const pauseTime = 1500;


function typeEffect() {

    if (!userName) return;

    const currentText = typingTexts[textIndex];

    // Apply different color to each text
    userName.style.color = currentText.color;

    if (!isDeleting) {

        // Typing
        userName.textContent =
            currentText.text.substring(0, charIndex + 1);

        charIndex++;

        // When complete, wait before deleting
        if (charIndex === currentText.text.length) {

            isDeleting = true;

            setTimeout(typeEffect, pauseTime);

            return;
        }

    } else {

        // Deleting
        userName.textContent =
            currentText.text.substring(0, charIndex - 1);

        charIndex--;

        // When deleted completely
        if (charIndex === 0) {

            isDeleting = false;

            textIndex++;

            // Restart from first text
            if (textIndex >= typingTexts.length) {
                textIndex = 0;
            }
        }
    }

    setTimeout(
        typeEffect,
        isDeleting ? deletingSpeed : typingSpeed
    );
}


// Start typing animation
if (userName) {
    typeEffect();
}



/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll("[data-reveal]");


function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 80) {

            element.classList.add("show");

        }

    });
}


window.addEventListener("scroll", revealOnScroll);

window.addEventListener("load", revealOnScroll);



/* =========================
   ACTIVE NAVBAR
========================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener("scroll", updateActiveNav);

window.addEventListener("load", updateActiveNav);



/* =========================
   MOBILE NAVBAR
========================= */

const mobileNavLinks =
    document.querySelectorAll(".navbar-nav .nav-link");

const navbarCollapse =
    document.querySelector(".navbar-collapse");


mobileNavLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (
            navbarCollapse &&
            navbarCollapse.classList.contains("show")
        ) {

            const bsCollapse =
                bootstrap.Collapse.getInstance(navbarCollapse);

            if (bsCollapse) {

                bsCollapse.hide();

            }

        }

    });

});




/* =========================
   CONTACT FORM
========================= */

const CONTACT_API_URL =
    "https://portfolio-backend-r4r2-pmspbb5sq-gbcodes.vercel.app/contact";

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector(".submit-btn");
        const originalHTML = submitButton
            ? submitButton.innerHTML
            : "Send Message";

        const formData = {
            name: contactForm.elements["name"]?.value.trim() || "",
            email: contactForm.elements["email"]?.value.trim() || "",
            subject: contactForm.elements["subject"]?.value.trim() || "",
            message: contactForm.elements["message"]?.value.trim() || ""
        };

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(CONTACT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();
            let result = {};

            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                // Handle non-JSON error responses.
            }

            if (!response.ok) {
                throw new Error(
                    result.detail ||
                    `Server error (${response.status}). Please try again.`
                );
            }

            alert(
                result.message ||
                "Message sent successfully!"
            );

            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            if (error instanceof TypeError) {
                alert(
                    "Could not connect to the server. Please try again later."
                );
            } else {
                alert(error.message || "Something went wrong.");
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalHTML;
            }
        }
    });
}