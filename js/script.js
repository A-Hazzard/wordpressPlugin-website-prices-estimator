jQuery(document).ready(function ($) {
  let currency = "USD"; // Default currency
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

  function initializePackageSelection() {
    const packageMenuItems = $(".package .dropdown-content .menu-item");
    const packageCheckboxes = $(".package-input-wrapper input.feature");

    packageMenuItems.each((index, item) => {
      $(item).on("click", () => {
        $(packageCheckboxes[index]).data("usd", $(item).data("price"));
        $(packageCheckboxes[index]).prop("disabled", false);
        $(packageCheckboxes[index]).prop("checked", true);
      });
    });
  }

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
      $(".feature-table tbody tr").each(function () {
        const usdPrice = $(this).find("input.feature").data("usd");
        if (typeof usdPrice === "undefined") {
          throw new Error("USD price not found");
        }
        const convertedPrice = convertCurrency(usdPrice, currency);
        const priceCol = $(this).find(".price-col");
        if (priceCol.length === 0) {
          throw new Error("Price column not found");
        }
        priceCol.text(`${convertedPrice}`);
      });
    } catch (error) {
      console.error("Error in updatePrices:", error);
    }
  }

  function calculateTotal() {
    try {
      let total = 0;
      let summaryItems = [];

      $(".feature:checked").each(function () {
        const feature = $(this).data("feature");
        let price = $(this).data("usd");

        if (typeof feature === "undefined" || typeof price === "undefined") {
          throw new Error("Feature or price data not found");
        }

        if (feature === "Global Implementation") {
          const pagesInput = $(this).closest("tr").find(".pages-input");
          if (pagesInput.length === 0) {
            throw new Error("Pages input not found");
          }
          const pages = parseInt(pagesInput.val()) || 9;
          price = 400 + (pages - 8) * 50;
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

  function updateSummary() {
    try {
      const { total, summaryItems } = calculateTotal();
      const summary = $("#summary");
      const totalPrice = $("#total-price");

      if (summary.length === 0 || totalPrice.length === 0) {
        throw new Error("Summary or total price element not found");
      }

      summary.empty();
      summaryItems.forEach(({ feature, price }) => {
        summary.append(`
          <tr>
            <td>${feature}</td>
            <!-- <td>${price} ${currency}</td> Added Incase User wants to see the individual price-->
          </tr>`);
      });
      totalPrice.text(`${total.toFixed(2)} ${currency}`);
      $(".summary-section").removeClass("hidden");
    } catch (error) {
      console.error("Error in updateSummary:", error);
    }
  }

  function updateGlobalImplementationPrice($input) {
    try {
      let pages = parseInt($input.val());
      let price = 400 + (pages - 8) * 50;
      let $checkbox = $input.closest("tr").find(".feature");

      if ($checkbox.length === 0) {
        throw new Error("Feature checkbox not found");
      }

      $checkbox.data("usd", price);

      if ($checkbox.is(":checked")) {
        updateSummary();
      }
    } catch (error) {
      console.error("Error in updateGlobalImplementationPrice:", error);
    }
  }

  function attachEventHandlers() {
    // Event handler for calculate button click
    $(".calculate").click(function () {
      try {
        updateSummary();
      } catch (error) {
        console.error("Error in calculate click handler:", error);
      }
    });

    // Event handler for currency selection change
    $('select[name="currency"]').change(function () {
      try {
        currency = $(this).val();
        updatePrices();
        updateSummary();
      } catch (error) {
        console.error("Error in currency change handler:", error);
      }
    });

    // Event handler for next step button click
    $(".next-step").click(function () {
      try {
        $(this)
          .closest(".step")
          .addClass("hidden")
          .next(".step")
          .removeClass("hidden");
      } catch (error) {
        console.error("Error in next-step click handler:", error);
      }
    });

    // Event handler for previous step button click
    $(".previous-step").click(function () {
      try {
        $(this)
          .closest(".step")
          .addClass("hidden")
          .prev(".step")
          .removeClass("hidden");
      } catch (error) {
        console.error("Error in previous-step click handler:", error);
      }
    });

    // Event handler for pages label click
    $(".pages-label").on("click", function () {
      try {
        $(this).addClass("hidden");
        const pagesInput = $(this).closest("tr").find(".pages-input");
        if (pagesInput.length === 0) {
          throw new Error("Pages input not found");
        }
        pagesInput.removeClass("hidden").focus();
      } catch (error) {
        console.error("Error in pages-label click handler:", error);
      }
    });

    // Event handler for pages input change
    $(".pages-input").on("input", function () {
      try {
        let pages = parseInt($(this).val()) || 9;
        let price = 400 + (pages - 8) * 50;
        let checkbox = $(this).closest("tr").find(".feature");

        if (checkbox.length === 0) {
          throw new Error("Feature checkbox not found");
        }

        checkbox.data("usd", price);

        if (checkbox.is(":checked")) {
          updateSummary();
        }
      } catch (error) {
        console.error("Error in pages-input input handler:", error);
      }
    });

    // Event handler for pages input blur
    $(".pages-input").on("blur", function () {
      try {
        let pages = parseInt($(this).val());
        if (isNaN(pages) || pages < 9) {
          $(this).val(9);
        }
        updateGlobalImplementationPrice($(this));
      } catch (error) {
        console.error("Error in pages-input blur handler:", error);
      }
    });

    // Event handler for package menu item click
    $(".package .dropdown-content .menu-item").click(function () {
      try {
        const price = $(this).data("price");
        const feature = $(this).text();

        if (typeof price === "undefined" || typeof feature === "undefined") {
          throw new Error("Price or feature data not found");
        }

        $(".package .dropdown-content").css("display", "none !important");
        $(".package .menu-item").removeClass("selected");
        $(this).addClass("selected");

        const packageInput = $(".package-input-wrapper input.feature");
        if (packageInput.length === 0) {
          throw new Error("Package input not found");
        }

        packageInput.data("usd", price);
        packageInput.data("feature", feature);
        console.log("USD price set:", packageInput.data("usd"));
        console.log("Feature set:", packageInput.data("feature"));

        const convertedPrice = convertCurrency(price, currency);
        const priceCol = $(".package .price-col");
        if (priceCol.length === 0) {
          throw new Error("Price column not found");
        }
        priceCol.text(`${convertedPrice} ${currency}`);

        updateSummary();
      } catch (error) {
        console.error("Error in package menu-item click handler:", error);
      }
    });

    // Event handler for package section click
    $(".package").click(function (e) {
      try {
        e.stopPropagation();
        $(".package .dropdown-content").toggle();
      } catch (error) {
        console.error("Error in package click handler:", error);
      }
    });

    // Event handler for document click to hide package dropdown
    $(document).click(function () {
      try {
        $(".package .dropdown-content").hide();
      } catch (error) {
        console.error("Error in document click handler:", error);
      }
    });

     // Event handler for feature checkbox change
    $(".feature").change(function () {
      try {
        const checkedFeatures = $(".feature:checked");
        $(".calculate").prop("disabled", checkedFeatures.length === 0);
      } catch (error) {
        console.error("Error in feature checkbox change handler:", error);
      }
    })
  }
 

  // Initialize package selection
  initializePackageSelection();

  // Attach event handlers
  attachEventHandlers();
});
