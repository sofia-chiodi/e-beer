const quantityInput = document.getElementById('cartQuantity');
const quantityLabel = document.getElementById('qtyValue');
const minusButton = document.getElementById('qtyMinus');
const plusButton = document.getElementById('qtyPlus');

function setQuantity(nextValue) {
  const quantity = Math.max(1, nextValue);
  quantityInput.value = quantity;
  quantityLabel.textContent = quantity;
}

if (quantityInput && minusButton && plusButton) {
  minusButton.addEventListener('click', () => {
    setQuantity(Number(quantityInput.value) - 1);
  });
  plusButton.addEventListener('click', () => {
    setQuantity(Number(quantityInput.value) + 1);
  });
}
