/*
 * Initializes the price estimator functionality on the website.
 * - Handles currency conversion and updating of prices based on the selected currency.
 * - Calculates the total price based on the selected features and updates the summary.
 * - Provides functionality for navigating between steps in the price estimator.
 */
jQuery(document).ready(function ($) {
  let currency = "USD";
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
    AWG: 1.8, // Aruban Florin
    BMD: 1, // Bermudian Dollar
    KYD: 0.82, // Cayman Islands Dollar
    ANG: 1.79, // Netherlands Antillean Guilder
    XCD: 2.7, // Eastern Caribbean Dollar (used by multiple countries)
    BSD: 1, // Bahamian Dollar
    CUP: 24.0, // Cuban Peso (CUP)
    CUC: 1, // Convertible Peso (CUC, being phased out)
  };

  function convertCurrency(amount, toCurrency) {
    return (amount * exchangeRates[toCurrency]).toFixed(2);
  }

  function updatePrices() {
    $(".feature-table tbody tr").each(function () {
      const usdPrice = $(this).find("input.feature").data("usd");
      const convertedPrice = convertCurrency(usdPrice, currency);
      $(this).find(".price-col").text(`$${convertedPrice}`);
    });
  }

  function calculateTotal() {
    let total = 0;
    let summaryItems = [];

    $(".feature:checked").each(function () {
      const feature = $(this).data("feature");
      const price =
        currency === "USD"
          ? $(this).data("usd")
          : convertCurrency($(this).data("usd"), currency);
      total += parseFloat(price);
      summaryItems.push({ feature }); // Only push the feature name
    });

    return { total, summaryItems };
  }

  function updateSummary() {
    const { total, summaryItems } = calculateTotal();
    const summary = $("#summary");
    const totalPrice = $("#total-price");

    summary.empty();
    summaryItems.forEach(({ feature }) => {
      summary.append(`
      <tr>
        <td>${feature}</td>
      </tr>`);
    });
    totalPrice.text(`${total.toFixed(2)} (${currency})`);
    $(".summary-section").removeClass("hidden");
  }

  function calculateAndHide() {
    updateSummary(); // Calculate and update DOM
  }

  $(".calculate").click(function () {
    calculateAndHide();
  });

  $('select[name="currency"]').change(function () {
    currency = $(this).val();
    updatePrices();
    calculateAndHide();
  });

  $(".next-step").click(function () {
    $(this)
      .closest(".step")
      .addClass("hidden")
      .next(".step")
      .removeClass("hidden");
  });

  $(".previous-step").click(function () {
    $(this)
      .closest(".step")
      .addClass("hidden")
      .prev(".step")
      .removeClass("hidden");
  });

  $(".summary-section").addClass("hidden"); // Ensure the summary is hidden initially

  // Initialize with default currency
  // updatePrices();
  // calculateAndHide();
});
