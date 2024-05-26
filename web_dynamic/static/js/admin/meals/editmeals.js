document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('drawer-update-product');
  const id = form.querySelector('#updatemealid');
  const mealNameInput = form.querySelector('#newmealname');
  const carbsInput = form.querySelector('#newcarbs');
  const fatInput = form.querySelector('#newfat');
  const caloriesInput = form.querySelector('#newCalories');
  const proteinInput = form.querySelector('#newProteain');

  function updateFormWithData(mealData) {
    id.innerHTML = mealData.id
    mealNameInput.value = mealData.name;
    carbsInput.value = mealData.carbs;
    fatInput.value = mealData.fat;
    caloriesInput.value = mealData.calories;
    proteinInput.value = mealData.protein;
  }

  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', function () {
      const mealRow = button.closest('tr');
      const mealData = {
        id: mealRow.getAttribute('id').trim(),
        name: mealRow.querySelector('.mealname').textContent.trim(),
        carbs: mealRow.querySelector('.carbs').textContent.trim(),
        fat: mealRow.querySelector('.Fat').textContent.trim(),
        calories: mealRow.querySelector('.calories').textContent.trim(),
        protein: mealRow.querySelector('.protein').textContent.trim()
      };
      updateFormWithData(mealData);
    });
  });

  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function () {
      const mealRow = button.closest('tr');
      const mealid = mealRow.getAttribute('id').trim();

      const Mealid_in_delete = document.querySelector('.deletemealid')
      Mealid_in_delete.innerHTML = mealid
    })
  })
});
