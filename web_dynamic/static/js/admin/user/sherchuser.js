document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("simple-search");
  const rows = document.querySelectorAll("tbody tr");

  searchInput.addEventListener("input", function(event) {
    const searchTerm = event.target.value.trim().toLowerCase();

    rows.forEach(row => {
      const id = row.querySelector(".id").innerText.trim().toLowerCase();
      const firstName = row.querySelector(".first-name").innerText.trim().toLowerCase();
      const lastName = row.querySelector(".last-name").innerText.trim().toLowerCase();
      const email = row.querySelector(".email").innerText.trim().toLowerCase();
      const tel = row.querySelector(".tel").innerText.trim().toLowerCase();
      const createdDate = row.querySelector(".created-date").innerText.trim().toLowerCase();

      if (
        id.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        tel.includes(searchTerm) ||
        createdDate.includes(searchTerm)
      ) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });
});