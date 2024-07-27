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
    return (amount * exchangeRates[toCurrency]).toFixed(2);
  }

  function updatePrices() {
    $(".feature-table tbody tr").each(function () {
      const usdPrice = $(this).find("input.feature").data("usd");
      const convertedPrice = convertCurrency(usdPrice, currency);
      $(this).find(".price-col").text(`${convertedPrice}`);
    });
  }

  function calculateTotal() {
    let total = 0;
    let summaryItems = [];

    $(".feature:checked").each(function () {
      const feature = $(this).data("feature");
      let price = $(this).data("usd");
      
      if (feature === "Global Implementation") {
        const pages = parseInt($(this).closest('tr').find('.pages-input').val()) || 9;
        price = 400 + ((pages - 8) * 50);
      }
      
      price = currency === "USD" ? price : convertCurrency(price, currency);
      total += parseFloat(price);
      summaryItems.push({ feature, price });
    });

    return { total, summaryItems };
  }

  function updateSummary() {
    const { total, summaryItems } = calculateTotal();
    const summary = $("#summary");
    const totalPrice = $("#total-price");

    summary.empty();
    summaryItems.forEach(({ feature, price }) => {
      summary.append(`
      <tr>
        <td>${feature}</td>
        <td>${price} ${currency}</td>
      </tr>`);
    });
    totalPrice.text(`${total.toFixed(2)} ${currency}`);
    $(".summary-section").removeClass("hidden");
  }

  function calculateAndHide() {
    updateSummary();
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

  // Toggle between label and input for Global Implementation
  $('.pages-label').on('click', function() {
    $(this).addClass('hidden');
    $(this).closest('tr').find('.pages-input').removeClass('hidden').focus();
  });

  // Update price when pages change for Global Implementation
  $('.pages-input').on('input', function() {
    let pages = parseInt($(this).val()) || 9;
    let price = 400 + ((pages - 8) * 50);
    let checkbox = $(this).closest('tr').find('.feature');
    
    checkbox.data('usd', price);
    
    if (checkbox.is(':checked')) {
      updateSummary();
    }
  });

  $(".pages-input").on("blur", function () {
    let pages = parseInt($(this).val());
    if (isNaN(pages) || pages < 9) {
      $(this).val(9);
    }
    updateGlobalImplementationPrice($(this));
  });

  function updateGlobalImplementationPrice($input) {
    let pages = parseInt($input.val());
    let price = 400 + (pages - 8) * 50;
    let $checkbox = $input.closest("tr").find(".feature");
    $checkbox.data("usd", price);
    if ($checkbox.is(":checked")) {
      updateSummary();
    }
  }


  $(".summary-section").addClass("hidden");
});
