$(document).on("click",".add-to-cart",function() {
  setTimeout(function() { 
      const checkShippingProtection = setInterval(function () {
        if ($('#shipping-protection').length > 0) {
          if (!$('#shipping-protection').is(':checked')) {
            $('#shipping-protection').click();
          }
          clearInterval(checkShippingProtection); // Stop checking once done
        }
      }, 500);
  }, 2000);
});

function updateDiscountProgress() {
  fetch(window.location.pathname + '?sections=header')
    .then(res => res.json())
    .then(data => {
      const headerHTML = data['header'];
      const tempDOM = new DOMParser().parseFromString(headerHTML, 'text/html');
      const newProgress = tempDOM.querySelector('.discount-progress');
      const currentProgress = document.querySelector('.discount-progress');

      if (newProgress && currentProgress) {
        currentProgress.innerHTML = newProgress.innerHTML;
      }
    });
}



['cart:updated', 'cartdrawer:opened', 'ajaxProduct:added', 'ajaxProduct:error'].forEach(event => document.addEventListener(event, e => {
 updateDiscountProgress();
  console.log('Done');
}));
