import { step1Header, step2Header, step3Header } from "./headerTemplates.js";

jQuery(document).ready(function ($) {
  // Default currency and initial step
  let currency = "USD";
  let currentStep = 1;
  const summarySection = $(".summary-section");

  // Event handlers for navigation buttons
  $(".next-step").click(function () {
    showStep(currentStep + 1);
    updateHeader();
  });

  $(".previous-step").click(function (event) {
    event.preventDefault();
    if (currentStep > 1) {
      showPreviousStep();
      updateHeader();
    }
  });

  $(".calculate-container-button").click(function (event) {
    event.preventDefault();
    let numberOfPages = parseInt($("#number-of-pages").val(), 10);

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

  //Exchange rates for different currencies
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

  //convert currency
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

  //update prices based on selected currency
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

  //update summary section
  function updateSummary() {
    try {
      const { total, summaryItems } = calculateTotal();
      const summary = $("#summary-content");
      const totalPrice = $("#total-price");

      summary.empty();
      summaryItems.forEach(({ feature }) => {
        summary.append(`<tr><td>${feature}</td></tr>`);
      });
      totalPrice.text(`${total.toFixed(2)} ${currency}`);

      summarySection.removeClass("hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error);
    }
  }

  //calculate total price
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

  //show the next step
  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > Object.keys(steps).length) return;

    gsap.to(steps[currentStep], {
      x: "0%",
      opacity: 0,
      duration: 0.5,
      scale: 0.3,
      ease: "back.in(1.7)",
      onComplete: function () {
        steps[currentStep].hide().css({ position: "relative" });

        steps[stepNumber].show().css({
          x: "100%",
          opacity: 0,
          display: "block",
          transformOrigin: "0% 100%",
        });
        gsap.fromTo(
          steps[stepNumber],
          { x: "100%", opacity: 0, scale: 0.3 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.5,
            scale: 1,
            ease: "back.out(1.7)",
            onComplete: function () {
              steps[currentStep].css({ position: "" });
            },
          }
        );
      },
    });

    $(".step-1").toggleClass("active", stepNumber === 1);
    currentStep = stepNumber;
  }

  //show the previous step
  function showPreviousStep() {
    const previousStepNumber = currentStep - 1;
    if (previousStepNumber < 1) return;

    gsap.to(steps[currentStep], {
      x: "0%",
      opacity: 0,
      duration: 0.5,
      scale: 0.3,
      ease: "back.in(1.7)",
      onComplete: function () {
        steps[currentStep].hide().css({ position: "relative" });

        steps[previousStepNumber].show().css({
          x: "-100%",
          opacity: 0,
          display: "block",
          transformOrigin: "100% 100%",
        });
        gsap.fromTo(
          steps[previousStepNumber],
          { x: "-100%", opacity: 0, scale: 0.3 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.5,
            scale: 1,
            ease: "back.out(1.7)",
            onComplete: function () {
              steps[currentStep].css({ position: "" });
            },
          }
        );
      },
    });

    currentStep = previousStepNumber;
  }

  //update header based on current step
  function updateHeader() {
    const header = $("header");

    switch (currentStep) {
      case 1:
        header.html(step1Header);
        $(".progress-bar")
          .removeClass("bg-yellowTheme", "animate-slide-right")
          .addClass("bg-white");
        break;
      case 2:
        header.html(step2Header);
        $(".progress-bar")
          .addClass("bg-yellowTheme", "animate-slide-right")
          .removeClass("bg-white");
        break;
      case 3:
        header.html(step3Header);
        $(".progress-bar")
          .addClass("bg-yellowTheme", "animate-slide-right")
          .removeClass("bg-white");
        break;
    }
  }
});
