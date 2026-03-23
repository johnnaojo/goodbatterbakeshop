const page = document.body.dataset.page;
document.querySelectorAll(".site-nav a, .mobile-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  const matches = (page === "home" && href === "index.html") || href === `${page}.html`;
  if (matches) {
    link.setAttribute("aria-current", "page");
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-nav");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const orderForm = document.querySelector("#order-form");

if (orderForm) {
  const formStatus = document.querySelector("#form-status");

  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(orderForm);
    const submitButton = orderForm.querySelector('button[type="submit"]');

    if (formStatus) {
      formStatus.textContent = "Sending your request...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(orderForm.action, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Form submission failed.");
      }

      orderForm.reset();
      if (formStatus) {
        formStatus.textContent = "Your order request was sent successfully.";
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "There was a problem sending your request. Please try again.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
