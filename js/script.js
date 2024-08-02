jQuery(document).ready(function ($) {
  let currency = "USD"; // Default currency
  let currentStep = 1;
  const summarySection = $(".summary-section");
  const form = $("form.nextui-form");

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
        console.log(numberOfPages, 'is number of pages')
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

    // Animate current step out
    gsap.to(steps[currentStep], {
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide();
        // Animate new step in
        steps[stepNumber].show().css({ x: "100%", opacity: 0 });
        gsap.fromTo(
          steps[stepNumber],
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.5 }
        );
        // Update form height
        switch (currentStep) {
          case 1:
            if ($(window).width() >= 768) {
              form.css({ height: "22rem" });
            } else {
              form.css({ height: "25rem" });
            }
            break;
          case 2:
            if ($(window).width() >= 768) {
              form.css({ height: "62rem" });
            } else {
              form.css({ height: "65rem" });
            }
            break;
          case 3:
            if ($(window).width() >= 768) {
              form.css({ height: "30rem" });
            } else {
              form.css({ height: "30rem" });
            }
            break;
        }
        // Update border and box-shadow for the form
        form.css({
          border: stepNumber === 4 ? "none" : "1px solid #ddd",
          boxShadow:
            stepNumber === 4 ? "none" : "0 0 0.5rem rgba(0, 0, 0, 0.1)",
        });
      },
    });

    currentStep = stepNumber;
  }

  function showPreviousStep() {
    // Animate the current step out
    gsap.to(steps[currentStep], {
      x: "100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide();
        // Animate the previous step in
        const previousStepNumber = currentStep - 1;
        if (previousStepNumber >= 1) {
          steps[previousStepNumber].show().css({ x: "-100%", opacity: 0 });
          gsap.fromTo(
            steps[previousStepNumber],
            { x: "-100%", opacity: 0 },
            { x: "0%", opacity: 1, duration: 0.5 }
          );
          currentStep = previousStepNumber;
          // Update form height
          switch (currentStep) {
            case 1:
              if ($(window).width() >= 768) {
                form.css({ height: "22rem" });
              } else {
                form.css({ height: "25rem" });
              }
              break;
            case 2:
               if ($(window).width() >= 768) {
                 form.css({ height: "62rem" });
               } else {
                 form.css({ height: "65rem" });
               }
              break;
            case 3:
              if ($(window).width() >= 768) {
                form.css({ height: "30rem" });
              } else {
                form.css({ height: "30rem" });
              }
              break;
          }
          // Update border and box-shadow for the form
          form.css({
            border: currentStep === 4 ? "none" : "1px solid #ddd",
            boxShadow:
              currentStep === 4 ? "none" : "0 0 0.5rem rgba(0, 0, 0, 0.1)",
          });
        }
      },
    });
  }

  function showSummary() {
    // Hide the current step
    gsap.to(steps[currentStep], {
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        steps[currentStep].hide();

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
        summarySection.show().css({ x: "100%", opacity: 0 });
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
        summarySection.hide();
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
      console.log('clicked')
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
