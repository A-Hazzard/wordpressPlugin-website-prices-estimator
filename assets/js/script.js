import { getStepHeader } from "./headerTemplates.js";

jQuery(document).ready(function ($) {
  let currentStep = 1;
  let prevStep = 1; 

  let currency = "USD";
  const summarySection = $(".summary-section");
  const $pagesInput = $("#pages-input");
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
    USD: 1, JMD: 150.85, CAD: 1.37, EUR: 0.93, 
    GBP: 0.77, DOP: 55.35, HTG: 137.58,
    BBD: 2, BZD: 2.01, GYD: 211.55, TTD: 6.79, 
    AWG: 1.8, BMD: 1, KYD: 0.82, ANG: 1.79, 
    XCD: 2.7, BSD: 1, CUP: 24.0, CUC: 1
  }
    // Sanitize pages input
  $pagesInput.on("input", () => {
    $(this).val(function (_, value) {
      return value.replace(/\D/g, "");
    });
  });

  // Modal button handlers
  $detailsButton.on("click", () => {
    $modal.css({display: "flex"});
    $('html, body').css('overflow', 'hidden');
    updateSummary();
  });
  $closeModal.on("click", () => {
    $modal.css({display: "none"});
    $('html, body').css('overflow', '');
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

  $(".calculate-container-button").click((event) => {
    event.preventDefault();
    let numberOfPages = parseInt($("#pages-input").val(), 10);

    if (isNaN(numberOfPages) || numberOfPages <= 0) {
      alert("Please enter a valid number of pages.");
      return;
    }

    updateSummary();
    showSummary();
  });

  $('select[name="currency"]').change(() => {
    try {
      currency = $(this).val();
      updatePrices();
    } catch (error) {
      console.error("Error in currency change handler:", error.message);
    }
  });

  

  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > Object.keys(steps).length) return;
    gsap.to(steps[currentStep], {
      opacity: 0,
      height: 'auto',
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

  function showSummary() { summarySection.removeClass("hidden"); }

  function convertCurrency(amount, toCurrency) {
    try {
      if (!exchangeRates[toCurrency]) {
        throw new Error(`Invalid currency: ${toCurrency}`);
      }
      return (amount * exchangeRates[toCurrency]).toFixed(2);
    } catch (error) {
      console.error("Error in convertCurrency:", error.message);
      return amount.toFixed(2);
    }
  }

  function updatePrices() {
    try {
      $(".feature:checked, .package-input:checked").each(() => {
        const usdPrice = $(this).data("usd");
        const convertedPrice = convertCurrency(usdPrice, currency);
        $(this)
          .closest(".feature-item, .plan-item")
          .find("label")
          .text(`${convertedPrice} ${currency}`);
      });

      updateSummary();
    } catch (error) {
      console.error("Error in updatePrices:", error.message);
    }
  }

  function updateSummary() {
    try {
      const { total, summaryItems } = calculateTotal();
      const summaryContent = $(".modal .text-left");
      const totalPrice = $(".total");

      // Clear existing summary items
      summaryContent.empty();
      console.log(summaryItems)
      // Add summary items dynamically
      summaryItems.forEach(({ feature, price }, index) => {
        const bgClass =
          index % 2 === 0
            ? "bg-[#0061FF] bg-opacity-[29%]"
            : "bg-blueTheme bg-opacity-[11%]";
        summaryContent.append(
          `<p class="flex justify-between items-center ${bgClass} text-black px-4 py-2">
                <span>${feature}</span>
                <span>${price.toFixed(2)} ${currency}</span>
            </p>`
        );
      });

      // Update total price
      totalPrice.text(`Total: ${total.toFixed(2)} ${currency}`);

      // Show the modal
      $(".modal").css({ display: "flex" });
      $("html, body").css("overflow", "hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error.message);
    }
  }


  function calculateTotal() {
    try {
      let total = 0;
      let summaryItems = [];
      let numberOfPages = parseInt($("#pages-input").val(), 10) || 1;

      summaryItems.push({
        feature: `Number of Pages: ${numberOfPages}`,
        price: 0,
      });

      $(".feature:checked, .package-input:checked").each(function () {
        const feature = $(this).data("feature");
        let price = parseFloat($(this).data("usd"));

        if ($(this).attr("id") === "additional-pages") {
          price *= numberOfPages - 1;
        }

        price = currency === "USD" ? price : convertCurrency(price, currency);
        total += parseFloat(price);
        summaryItems.push({ feature, price });
      });

      return { total, summaryItems };
    } catch (error) {
      console.error("Error in calculateTotal:", error.message);
      return { total: 0, summaryItems: [] };
    }
  }

  // Update header based on current step
  function updateHeader() {
    const header = $(".header");

    // Update the header content
    header.html(getStepHeader(currentStep));

    // Add GSAP animation to the header content, excluding the number 1 and 2
    const headerContent = header.find("*:not(.w-8, .h-8)");
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
    console.log(`Current step: ${currentStep}, Previous step: ${prevStep}`);
    if (currentStep === 2 && prevStep == 1) {
      progressBar.css("width", "0%");
    } else if (currentStep === 3 && prevStep == 2) {
      progressBar.css("width", "0%");
      gsap.to(progressBar, {
        width: "100%",
        duration: 3,
        ease: "power2.out",
        onStart: () => {
          progressBar.removeClass("bg-white").addClass("bg-yellowTheme");
        },
      });
    } else if (currentStep === 2 && prevStep === 3) {
      progressBar.css("width", "100%");

      console.log('let me see', progressBar.width());
      gsap.to(progressBar, {
        width: "0%",
        duration: 3,
        ease: "power2.out",
        onStart: () => {
          progressBar.removeClass("animate-slide-left");

        },
        onComplete: () => {
          progressBar.removeClass("bg-yellowTheme").addClass("bg-white");
        },
      });
    }
  }
});
