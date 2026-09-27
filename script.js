/* =========================
   TYPING ANIMATION
========================= */

const name = "Full-Stack Developer";

const nameElement = document.getElementById("user-name");

const colors = ["#FF6B00", "#38bdf8", "#a855f7", "#22c55e"];

let index = 0;
let deleting = false;
let colorIndex = 0;

function typeName() {
  if (!nameElement) {
    return;
  }

  if (!deleting) {
    nameElement.textContent = name.substring(0, index + 1);

    index++;

    if (index === name.length) {
      deleting = true;

      setTimeout(typeName, 1500);

      return;
    }
  } else {
    nameElement.textContent = name.substring(0, index - 1);

    index--;

    if (index === 0) {
      deleting = false;

      colorIndex++;

      if (colorIndex >= colors.length) {
        colorIndex = 0;
      }

      nameElement.style.color = colors[colorIndex];
    }
  }

  setTimeout(typeName, deleting ? 70 : 120);
}

/* Start Typing */

typeName();

/* =========================
   SCROLL REVEAL
   REPLAYS EVERY TIME
========================= */

const revealElements = document.querySelectorAll("[data-reveal]");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;

    const elementBottom = element.getBoundingClientRect().bottom;

    /*
            Element enters viewport
        */

    if (elementTop < windowHeight - 100 && elementBottom > 100) {
      element.classList.add("reveal-show");
    } else {

    /*
            Element leaves viewport

            Remove class so animation
            can happen again.
        */
      element.classList.remove("reveal-show");
    }
  });
}

/* Run when page loads */

window.addEventListener("load", revealOnScroll);

/* Run while scrolling */

window.addEventListener("scroll", revealOnScroll);

/* Run when window size changes */

window.addEventListener("resize", revealOnScroll);

/* =========================
   SKILLS CARD DELAYS
========================= */

const skillCards = document.querySelectorAll("#skills [data-reveal]");

skillCards.forEach(function (card, index) {
  card.classList.add("delay-" + ((index % 6) + 1));
});

/* =========================
   SERVICES CARD DELAYS
========================= */

const serviceCards = document.querySelectorAll("#services [data-reveal]");

serviceCards.forEach(function (card, index) {
  card.classList.add("delay-" + ((index % 6) + 1));
});

/* =========================
   ACTIVE NAVBAR LINK
========================= */

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

function updateActiveNav() {
  let currentSection = "";

  const scrollPosition = window.scrollY + 150;

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;

    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === "#" + currentSection) {
      link.classList.add("active");
    }
  });
}

/* Update active link while scrolling */

window.addEventListener("scroll", updateActiveNav);

/* Update when page loads */

window.addEventListener("load", updateActiveNav);

/* =========================
   MOBILE NAVBAR
========================= */

const navbar = document.getElementById("navbarNav");

const navbarLinks = document.querySelectorAll(".navbar-nav .nav-link");

navbarLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbar);

      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const sendButton = contactForm.querySelector(".send-btn");

    const originalButtonText = sendButton.innerHTML;

    /* Disable button */

    sendButton.disabled = true;

    sendButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Message sent successfully!");

        contactForm.reset();
      } else {
        alert(result.detail || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      alert("Failed to connect to the backend.");
    }

    /* Restore button */

    sendButton.disabled = false;

    sendButton.innerHTML = originalButtonText;
  });
}
