import { getStepHeader } from "./headerTemplates.js";

jQuery(document).ready(function ($) {
  // Default currency and initial step
  let currency = "USD";
  let currentStep = 1; // Initial step
  const summarySection = $(".summary-section");
  const $pagesInput = $("#pages-input");
  const $modal = $(".modal");
  const $closeModal = $(".close-modal");
  const $detailsButton = $(".details");

  // Sanitize pages input
  $pagesInput.on("input", function () {
    $(this).val(function (_, value) {
      return value.replace(/\D/g, "");
    });
  });

  // Modal button handlers
  $detailsButton.on("click", function () {
    $modal.removeClass("hidden");
  });
  $closeModal.on("click", function () {
    $modal.addClass("hidden");
  });

  // Event handlers for navigation buttons
  $(".first-next-step").click(function () {
    showStep(2);
  });

  $(".next-step").click(function () {
    if (currentStep < 3) {
      // Assuming 3 is the maximum step
      showStep(currentStep + 1);
    }
  });

  $(".previous-step").click(function (event) {
    event.preventDefault();
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

  $(".calculate-container-button").click(function (event) {
    event.preventDefault();
    let numberOfPages = parseInt($("#pages-input").val(), 10);

    if (isNaN(numberOfPages) || numberOfPages <= 0) {
      alert("Please enter a valid number of pages.");
      return;
    }

    updateSummary();
    showSummary();
  });

  // Event handler for currency selection change
  $('select[name="currency"]').change(function () {
    try {
      currency = $(this).val();
      updatePrices();
    } catch (error) {
      console.error("Error in currency change handler:", error);
    }
  });

  const steps = {
    1: $(".step-1"),
    2: $(".step-2"),
    3: $(".step-3"),
  };

  // Exchange rates for different currencies
  const exchangeRates = {
    USD: 1,
    JMD: 150.85,
    CAD: 1.37,
    EUR: 0.93,
    GBP: 0.77,
    DOP: 55.35,
    HTG: 137.58,
    BBD: 2,
    BZD: 2.01,
    GYD: 211.55,
    TTD: 6.79,
    AWG: 1.8,
    BMD: 1,
    KYD: 0.82,
    ANG: 1.79,
    XCD: 2.7,
    BSD: 1,
    CUP: 24.0,
    CUC: 1,
  };

  // Show the step
  // Show the step
  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > Object.keys(steps).length) return;

    gsap.to(steps[currentStep], {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: function () {
        steps[currentStep].hide();

        steps[stepNumber].show().css({
          opacity: 0,
          display: "block",
          scale: 1,
          rotation: 0,
          position: "relative",
        });

        const elements = steps[stepNumber].find("*");

        gsap.set(elements, { y: 10, opacity: 0 });

        gsap.to(steps[stepNumber], {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          onComplete: function () {
            currentStep = stepNumber;
            updateHeader(); // Call the updateHeader function
          },
        });

        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.1,
        });
      },
    });

    $(".step").removeClass("active");
    $(`.step-${stepNumber}`).addClass("active");
  }

  // Show the summary section
  function showSummary() {
    summarySection.removeClass("hidden");
  }

  // Convert currency
  function convertCurrency(amount, toCurrency) {
    try {
      if (!exchangeRates[toCurrency]) {
        throw new Error(`Invalid currency: ${toCurrency}`);
      }
      return (amount * exchangeRates[toCurrency]).toFixed(2);
    } catch (error) {
      console.error("Error in convertCurrency:", error);
      return amount.toFixed(2);
    }
  }

  // Update prices based on selected currency
  function updatePrices() {
    try {
      $(".feature:checked, .package-input:checked").each(function () {
        const usdPrice = $(this).data("usd");
        const convertedPrice = convertCurrency(usdPrice, currency);
        $(this)
          .closest(".feature-item, .plan-item")
          .find("label")
          .text(`${convertedPrice} ${currency}`);
      });

      updateSummary();
    } catch (error) {
      console.error("Error in updatePrices:", error);
    }
  }

  // Update summary section
  function updateSummary() {
    try {
      const { total, summaryItems } = calculateTotal();
      const summary = $("#summary-content");
      const totalPrice = $("#total-price");

      summary.empty();
      summaryItems.forEach(({ feature, price }) => {
        summary.append(
          `<tr><td>${feature}</td><td>${price.toFixed(2)} ${currency}</td></tr>`
        );
      });
      totalPrice.text(`${total.toFixed(2)} ${currency}`);

      summarySection.removeClass("hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error);
    }
  }

  // Calculate total price
  function calculateTotal() {
    try {
      let total = 0;
      let summaryItems = [];
      let numberOfPages = parseInt($("#number-of-pages").val(), 10);

      $(".feature:checked, .package-input:checked").each(function () {
        const feature = $(this).data("feature");
        let price = parseFloat($(this).data("usd"));

        if (numberOfPages > 8) {
          price += (numberOfPages - 8) * 50;
        }

        price = currency === "USD" ? price : convertCurrency(price, currency);
        total += parseFloat(price);
        summaryItems.push({ feature, price });
      });

      return { total, summaryItems };
    } catch (error) {
      console.error("Error in calculateTotal:", error);
      return { total: 0, summaryItems: [] };
    }
  }

  // Update header based on current step
  function updateHeader() {
    const header = $(".header");

    // Update the header content
    header.html(getStepHeader(currentStep));

    // Add GSAP animation to the header content, excluding the progress bar
    const headerContent = header.find("*:not(.h-1, .bg-yellowTheme)");
    gsap.fromTo(
      headerContent,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      }
    );

    // Update the progress bar
    const progressBar = header.find(".bg-yellowTheme:not(.w-8)");
    if (currentStep === 1) {
      progressBar.css("width", "0%");
    } else if (currentStep === 2) {
      progressBar.css("width", "0%");
    } else if (currentStep === 3) {
      progressBar.css("width", "100%");
    }
  }
});
