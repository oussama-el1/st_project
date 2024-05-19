document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("simple-search");
  const rows = document.querySelectorAll("tbody tr");

  searchInput.addEventListener("input", function(event) {
    const searchTerm = event.target.value.trim().toLowerCase();

    rows.forEach(row => {
      const order_id = row.querySelector(".order_id").innerText.trim().toLowerCase();
      const user_id = row.querySelector(".user_id").innerText.trim().toLowerCase();
      const order_status = row.querySelector(".order_status").innerText.trim().toLowerCase();
      const order_date = row.querySelector(".order_date").innerText.trim().toLowerCase();
      const tel = row.querySelector(".tel").innerText.trim().toLowerCase();
      const email = row.querySelector(".email").innerText.trim().toLowerCase();


      if (
        order_id.includes(searchTerm) ||
        user_id.includes(searchTerm) ||
        order_status.includes(searchTerm) ||
        email.includes(searchTerm) ||
        tel.includes(searchTerm) ||
        order_date.includes(searchTerm)
      ) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });
});