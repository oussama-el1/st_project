// This is a simplified example, you may need to adapt it based on your actual implementation
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve data from the Select Plan page or any other source
    const servings = 6;
    const boxPrice = 59.94;
    const shipping = 10.99;
    const discount = 30.01;
    const total = boxPrice + shipping - discount;
    const additionalDiscount = 69.94;

    // Update placeholders with the retrieved data
    document.getElementById("servings").textContent = servings;
    document.getElementById("box-price").textContent = boxPrice.toFixed(2);
    document.getElementById("shipping").textContent = shipping.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("additional-discount").textContent = additionalDiscount.toFixed(2);
});
