jQuery(document).ready(function ($) {
  let currency = "USD"; // Default currency
  let currentStep = 1;
  const summarySection = $(".summary-section");
  const form = $("form.nextui-form");
  // Check for "active" class globally and set form height to 20rem
  if ($(".step.active").length > 0) {
    $(".nextui-form").height(320); // 20rem = 320px
  }
  const steps = {
    1: $(".step-1"),
    2: $(".step-2"),
    3: $(".step-3"),
  };

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

  function updatePrices() {
    try {
      $(".feature:checked").each(function () {
        const usdPrice = $(this).data("usd");
        const convertedPrice = convertCurrency(usdPrice, currency);
        $(this)
          .closest(".feature-item")
          .find("label")
          .text(`${convertedPrice} ${currency}`);
      });

      $(".package-input:checked").each(function () {
        const usdPrice = $(this).data("usd");
        const convertedPrice = convertCurrency(usdPrice, currency);
        $(this)
          .closest(".plan-item")
          .find("label")
          .text(`${convertedPrice} ${currency}`);
      });

      updateSummary();
    } catch (error) {
      console.error("Error in updatePrices:", error);
    }
  }

  function updateSummary() {
    try {
      const { total, summaryItems } = calculateTotal();
      const summary = $("#summary-content");
      const totalPrice = $("#total-price");

      summary.empty();
      summaryItems.forEach(({ feature }) => {
        summary.append(`
                <tr>
                    <td>${feature}</td>
                </tr>`);
      });
      totalPrice.text(`${total.toFixed(2)} ${currency}`);

      summarySection.removeClass("hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error);
    }
  }

  function calculateTotal() {
    try {
      let total = 0;
      let summaryItems = [];
      let numberOfPages = parseInt($("#number-of-pages").val(), 10);

      $(".feature:checked").each(function () {
        const feature = $(this).data("feature");
        let price = parseFloat($(this).data("usd"));

        // Calculate the price based on the number of pages
        console.log(numberOfPages, "is number of pages");
        if (numberOfPages > 8) {
          price += (numberOfPages - 8) * 50;
        }

        price = currency === "USD" ? price : convertCurrency(price, currency);
        total += parseFloat(price);
        summaryItems.push({ feature, price });
      });

      $(".package-input:checked").each(function () {
        const feature = $(this).data("feature");
        let price = parseFloat($(this).data("usd"));

        // Calculate the price based on the number of pages
        if (numberOfPages > 8) {
          price += (numberOfPages - 8) * 50;
        }
        console.log(numberOfPages, "is number of pages");

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

  function showStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > Object.keys(steps).length) return;
    // Remove active class from step-1 when hiding the containers
    if (currentStep === 1) {
      $(".step-1").removeClass("active");
    }
    // Animate current step out
    gsap.to(steps[currentStep], {
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide(); // Hide the current step
        steps[currentStep].css({ position: "relative" });
        // Animate new step in
        steps[stepNumber]
          .show()
          .css({ x: "100%", opacity: 0, display: "block" });
        gsap.fromTo(
          steps[stepNumber],
          { x: "100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.5,
            onComplete: function () {
              steps[currentStep].css({ position: "" }); // Remove position relative from the previous step
              updateContainerHeight();
            },
          }
        );
      },
    });
    // Restore active class to step-1 if user goes back to step-1
    if (stepNumber === 1) {
      $(".step-1").addClass("active");
    }
    currentStep = stepNumber;
  }

  function showPreviousStep() {
    const previousStepNumber = currentStep - 1;
    if (previousStepNumber < 1) return;

    // Animate current step out
    gsap.to(steps[currentStep], {
      x: "100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide(); // Hide the current step
        steps[currentStep].css({ position: "relative" });
        // Animate previous step in
        steps[previousStepNumber]
          .show()
          .css({ x: "-100%", opacity: 0, display: "block" });
        gsap.fromTo(
          steps[previousStepNumber],
          { x: "-100%", opacity: 0 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.5,
            onComplete: function () {
              steps[currentStep].css({ position: "" }); // Remove position relative from the current step
              updateContainerHeight();
            },
          }
        );
      },
    });

    currentStep = previousStepNumber;
  }

  function updateContainerHeight() {
    var currentStepHeight = steps[currentStep].outerHeight(true) + 120;
    var currentFormHeight = $(".nextui-form").height();

    // Animate the height change along with the sliding animation
    $(".nextui-form").animate(
      { height: currentStepHeight },
      {
        duration: 500, // Adjust the duration as needed
        step: function () {
          // Trigger layout reflow to ensure smooth animation
          $(".nextui-form").css("display", "block");
        },
      }
    );
  }




  function showSummary() {
    // Hide the current step
    gsap.to(steps[currentStep], {
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide().css("display", "none");

        // Calculate the total price and update the summary
        const { total, summaryItems } = calculateTotal();
        const summary = $("#summary-content");
        const totalPrice = $("#total-price");

        summary.empty();
        summaryItems.forEach(({ feature, price }) => {
          summary.append(`
          <tr>
            <td>${feature}</td>
          </tr>`);
        });
        totalPrice.text(`${total.toFixed(2)} ${currency}`);

        // Show the summary section and animate it in

        summarySection.show().css({ x: "100%", opacity: 0, display: "block" });
        gsap.fromTo(
          summarySection,
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.5 }
        );

        // Remove border and box-shadow for the form
        form.css({
          border: "none",
          boxShadow: "none",
        });
      },
    });
  }

  function showPreviousSummary() {
    // Hide summary and show previous step
    gsap.to(summarySection, {
      x: "100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        summarySection.hide().css("display", "none");
        showStep(3); // Show step 3 directly
      },
    });
  }

  $(".next-step").click(function (event) {
    event.preventDefault();
    if (currentStep < Object.keys(steps).length) {
      showStep(currentStep + 1);
    }
  });

  $(".previous-step").click(function (event) {
    event.preventDefault();
    if (currentStep > 1) {
      showPreviousStep();
    }
  });

  $(".calculate-container-button").click(function (event) {
    event.preventDefault();
    console.log("clicked");
    let numberOfPages = parseInt($("#number-of-pages").val(), 10);
    let featuresPrice = 0;
    let packagesPrice = 0;
    let totalPrice = 0;

    if (isNaN(numberOfPages) || numberOfPages <= 0) {
      alert("Please enter a valid number of pages.");
      return;
    }

    // Calculate the total price based on selected features
    $(".feature:checked").each(function () {
      featuresPrice += parseFloat($(this).data("usd"));
    });

    // Calculate the total price based on selected packages
    $(".package-input:checked").each(function () {
      packagesPrice += parseFloat($(this).data("usd"));
    });

    // Calculate total based on number of pages and selected features
    totalPrice = featuresPrice + packagesPrice;
    let summaryContent = "";

    // Add features to the summary
    $(".feature:checked").each(function () {
      let featureName = $(this).data("feature");
      let featurePrice = $(this).data("usd");
      summaryContent += `
        <tr>
          <td>${featureName}</td>
         <!-- <td>${featurePrice.toFixed(2)}</td> -->
        </tr>`;
    });

    // Add packages to the summary
    $(".package-input:checked").each(function () {
      let packageName = $(this).data("feature");
      let packagePrice = $(this).data("usd");
      summaryContent += `
        <tr>
          <td>${packageName}</td>
         <!-- <td>${packagePrice.toFixed(2)}</td> -->
        </tr>`;
    });

    // Display total price and summary
    $("#summary-content").html(summaryContent);
    $("#total-price").text(`${totalPrice.toFixed(2)}`);

    showSummary();
  });

  $(".previous-step-summary").click(function (event) {
    event.preventDefault();
    showPreviousSummary();
  });

  // Event handler for currency selection change
  $('select[name="currency"]').change(function () {
    try {
      currency = $(this).val();
      updatePrices();
      updateSummary(); // Ensure this function recalculates and updates the summary
    } catch (error) {
      console.error("Error in currency change handler:", error);
    }
  });
});