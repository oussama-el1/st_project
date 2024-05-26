document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("simple-search");
  const rows = document.querySelectorAll("tbody tr");

  searchInput.addEventListener("input", function(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    filterRows(searchTerm);
  });

  function filterRows(searchTerm) {
    rows.forEach(row => {
      const mealId = row.querySelector(".mealid").innerText.trim().toLowerCase();
      const mealName = row.querySelector(".mealname").innerText.trim().toLowerCase();
      const carbs = row.querySelector(".carbs").innerText.trim().toLowerCase();
      const fat = row.querySelector(".Fat").innerText.trim().toLowerCase();
      const calories = row.querySelector(".calories").innerText.trim().toLowerCase();
      const protein = row.querySelector(".protein").innerText.trim().toLowerCase();
      const ingredients = row.querySelector(".ingredients").innerText.trim().toLowerCase();

      if (
        mealId.includes(searchTerm) ||
        mealName.includes(searchTerm) ||
        carbs.includes(searchTerm) ||
        fat.includes(searchTerm) ||
        calories.includes(searchTerm) ||
        protein.includes(searchTerm) ||
        ingredients.includes(searchTerm)
      ) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  }
});
