import { getStepHeader, getMobileStepHeader } from "./headerTemplates.js";

jQuery(document).ready(function ($) {
  let currentStep = 1;
  let prevStep = 1;

  let currency = "USD";
  const summarySection = $(".summary-section");
  const $pagesInput = $(".pages-input");
  const $modal = $(".modal");
  const $closeModal = $(".close-modal");
  const $detailsButton = $(".details");

  const steps = {
    1: $(".step-1"),
    2: $(".step-2"),
    3: $(".step-3"),
  };

  // Exchange rates for different currencies
  const exchangeRates = {
    USD: 1,
    JMD: 153.82,
    CAD: 1.34,
    EUR: 0.91,
    GBP: 0.79,
    DOP: 56.5,
    HTG: 133.33,
    BBD: 2.0,
    BZD: 2.0,
    GYD: 208.33,
    TTD: 6.76,
    AWG: 1.79,
    BMD: 1.0,
    KYD: 0.83,
    ANG: 1.79,
    XCD: 2.7,
    BSD: 1.0,
    CUP: 24.0,
    CUC: 1.0,
  };
  // Sanitize pages input
  $pagesInput.on("input", () => {
    $(this).val(function (_, value) {
      return value.replace(/\D/g, "");
    });
  });

  // Modal button handlers
  $detailsButton.on("click", () => {
    $modal.css({ display: "flex" });
    $("html, body").css("overflow", "hidden");
    updateSummary();
  });
  $closeModal.on("click", () => {
    $modal.css({ display: "none" });
    $("html, body").css("overflow", "");
  });

  // Event handlers for navigation buttons
  $(".first-next-step").click(() => {
    showStep(2);
  });

  $(".next-step").click(() => {
    if (currentStep < 3) {
      showStep(currentStep + 1);
    }
  });

  $(".previous-step").click((event) => {
    event.preventDefault();
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

  

  $("select.currency-select").change(function () {
    try {
      currency = $(this).val();
      updatePrices(); // Update prices based on new currency
    } catch (error) {
      console.error("Error in currency change handler:", error.message);
    }
  });

  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > Object.keys(steps).length) return;
    gsap.to(steps[currentStep], {
      opacity: 0,
      height: "auto",
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        steps[currentStep].hide();

        steps[stepNumber].show().css({
          opacity: 0,
          display: "flex",
          flexDirection: "column",
          scale: 1,
          rotation: 0,
          height: "auto",
          position: "relative",
        });

        const elements = steps[stepNumber].find("*");
        const inputsAndLabels = steps[stepNumber].find("input, label");
        const otherElements = elements.not("input, label");

        gsap.set(otherElements, { y: 5, opacity: 0 });
        gsap.set(inputsAndLabels, { y: 0, opacity: 0 });

        gsap.to(steps[stepNumber], {
          opacity: 1,
          duration: 0.5,
          height: "auto",
          ease: "power2.out",
          onComplete: () => {
            prevStep = currentStep;
            currentStep = stepNumber;
            updateHeader(); // Call the updateHeader function
          },
        });

        gsap.to(otherElements, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.02,
          height: "auto",
          ease: "power2.out",
          delay: 0.05,
        });

        gsap.to(inputsAndLabels, {
          opacity: 1,
          height: "auto",
          duration: 1,
          stagger: 0.02,
          ease: "power2.out",
        });
      },
    });

    $(".step").removeClass("active");
    $(`.step-${stepNumber}`).addClass("active");
  }

  function showSummary() {
    summarySection.removeClass("hidden");
  }

  function convertCurrency(amount, toCurrency) {
    try {
      if (!exchangeRates[toCurrency]) {
        throw new Error(`Invalid currency: ${toCurrency}`);
      }

      // Perform the calculation with higher precision
      const result = amount * exchangeRates[toCurrency];

      // Define appropriate decimal places for each currency
      const decimalPlaces = {
        USD: 2,
        JMD: 2,
        CAD: 2,
        EUR: 2,
        GBP: 2,
        DOP: 2,
        HTG: 2,
        BBD: 2,
        BZD: 2,
        GYD: 2,
        TTD: 2,
        AWG: 2,
        BMD: 2,
        KYD: 2,
        ANG: 2,
        XCD: 2,
        BSD: 2,
        CUP: 2,
        CUC: 2,
      };

      // Round to the appropriate number of decimal places
      return result.toFixed(decimalPlaces[toCurrency] || 2);
    } catch (error) {
      console.error("Error in convertCurrency:", error.message);
      return amount.toFixed(2); // Return the amount as is if conversion fails
    }
  }


  // Function to update the total price in the modal
  function updateTotalPrice() {
    try {
      const { total } = calculateTotal();
      console.log(total)
      const totalPrice = $(".total");
      totalPrice.text(`Total: ${total} ${currency}`);
    } catch (error) {
      console.error("Error in updateTotalPrice:", error.message);
    }
  }


  // Function to update the prices in the modal based on the selected currency
  function updatePrices() {
    try {
      // Only update the total price
      updateTotalPrice();
    } catch (error) {
      console.error("Error in updatePrices:", error.message);
    }
  }

  function updateSummary() {
    try {
      const { summaryItems, total } = calculateTotal();
      const summaryContent = $(".modal .text-left");

      // Clear existing summary items
      summaryContent.empty();

      // Add summary items dynamically (with prices)
      summaryItems.forEach(({ feature, price }, index) => {
        const bgClass =
          index % 2 === 0
            ? "bg-[#0061FF] bg-opacity-[29%]"
            : "bg-blueTheme bg-opacity-[11%]";
        const convertedPrice = convertCurrency(price, currency);
        summaryContent.append(
          `<p class="flex justify-between items-center ${bgClass} text-black px-4 py-2">
          <span>${feature}</span>
        </p>`
        );
      });

      // Update total price
      updateTotalPrice();

      // Show the modal
      $(".modal").css({ display: "flex" });
      $("html, body").css("overflow", "hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error.message);
    }
  }

  function calculateTotal() {
    try {
      let basePagesCost = 0;
      let featuresCost = 0;
      let summaryItems = [];

      // Get number of pages
      let numberOfPagesInput =
        window.innerWidth < 768
          ? $(".pages-input").eq(0).val()
          : $(".pages-input").eq(1).val();
      let numberOfPages = parseInt(numberOfPagesInput, 10) || 1;

      // Calculate base pages cost
      if (numberOfPages >= 1 && numberOfPages <= 3) {
        basePagesCost = 250;
      } else if (numberOfPages <= 6) {
        basePagesCost = 350;
      } else if (numberOfPages <= 8) {
        basePagesCost = 400;
      } else {
        basePagesCost = 450 + (numberOfPages - 9) * 50;
      }

      // Calculate features cost
      $(".feature:checked, .package-input:checked").each(function () {
        const feature = $(this).data("feature");
        let price = parseFloat($(this).data("usd"));
        featuresCost += price;
        summaryItems.push({ feature, price });
      });

      // Total cost is the sum of base pages cost and features cost
      let total = basePagesCost + featuresCost;

      // Convert to selected currency if not USD
      if (currency !== "USD") {
        total = convertCurrency(total, currency);
        summaryItems = summaryItems.map((item) => ({
          ...item,
          price: convertCurrency(item.price, currency),
        }));
      }

      return { total, summaryItems, numberOfPages };
    } catch (error) {
      console.error("Error in calculateTotal:", error.message);
      return { total: 0, summaryItems: [], numberOfPages: 1 };
    }
  }


  // Update header based on current step
  function updateHeader() {
    const header = $(".header");

    // Update the header content
      if (window.innerWidth < 768) {
          header.html(getStepHeader(currentStep));
      } else {
          header.html(getMobileStepHeader(currentStep));
      }
    // Add GSAP animation to the header content, excluding the number 1 and 2
    const headerContent = header.find("*:not(.w-8, .h-8)");
    gsap.fromTo(
      headerContent,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 }
    );

    // Update the progress bar
    const progressBar = header.find(".bg-yellowTheme:not(.w-8)");
    
    if (currentStep === 2 && prevStep == 1)progressBar.css("width", "0%");
    
    else if (currentStep === 3 && prevStep == 2) {
        progressBar.css("width", "0%");
        gsap.to(progressBar, {
          width: "100%",
          duration: 3,
          ease: "power2.out",
          onStart: () => progressBar.removeClass("bg-white").addClass("bg-yellowTheme"),
      });
    } else if (currentStep === 2 && prevStep === 3) {
      progressBar.css("width", "100%");

      gsap.to(progressBar, {
        width: "0%",
        duration: 3,
        ease: "power2.out",
        onStart: () => progressBar.removeClass("animate-slide-left"),
        onComplete: () => progressBar.removeClass("bg-yellowTheme").addClass("bg-white"),
      });
    }
  }



});
