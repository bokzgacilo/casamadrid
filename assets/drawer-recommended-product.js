
// Update selected variant when options change
window.updateVariantSelection = function(select) {
  const productContainer = select.closest('.product_itemm');
  const productId = productContainer.dataset.productId;
  const form = select.closest('.customForm');
  const allSelects = form.querySelectorAll('.variant-option-selector');
  const variantIdInput = form.querySelector('.selected-variant-id');
  
  // Get all selected options
  const selectedOptions = {};
  allSelects.forEach(select => {
    const optionName = select.dataset.optionName;
    selectedOptions[optionName] = select.value;
  });

  // Get product variants data
  const productData = JSON.parse(document.querySelector(`[data-product-variants="${productId}"]`).textContent);
  const variants = productData.variants;
  const optionNames = productData.options.map(opt => opt.toLowerCase().replace(' ', '-'));

  // Find matching variant
  const matchedVariant = variants.find(variant => {
    return variant.options.every((optionValue, index) => {
      const currentOptionName = optionNames[index];
      return selectedOptions[currentOptionName] === optionValue;
    });
  });

  // Update hidden variant ID field
  if (matchedVariant) {
    variantIdInput.value = matchedVariant.id;
    console.log('Selected variant:', matchedVariant.id);
  } else {
    variantIdInput.value = '';
  }
};

// Handle Add to Cart
window.handleAddToCart = function(button) {
  const form = button.closest('.customForm');
  const variantId = form.querySelector('.selected-variant-id').value;
  
  if (!variantId) {
    alert('Please select all available options');
    return;
  }

  // Store original button text
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Adding';

  // Add to cart
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        id: variantId,
        quantity: 1
      }]
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Added to cart:', data);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to add to cart. Please try again.');
  })
  .finally(() => {
    document.dispatchEvent(new CustomEvent('cart:build'));
    button.disabled = false;
    button.textContent = originalText;
  });
};