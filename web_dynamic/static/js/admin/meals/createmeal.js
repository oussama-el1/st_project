$(document).ready(function () {
  const mealForm = document.getElementById('createMealForm');
  const closebutton = document.querySelector('#closeaddmeal');

  $(mealForm).on('submit', function (event) {
      event.preventDefault();

      const mealName = $('#mealname').val();
      const carbs = $('#carbs').val();
      const fat = $('#fat').val();
      const calories = $('#Calories').val();
      const protein = $('#Proteain').val();
      const mealImage = $('#dropzone-file')[0].files[0];

      // Read the image file as base64
      const reader = new FileReader();
      reader.readAsDataURL(mealImage);
      reader.onload = function () {
          const base64Image = reader.result;

          const mealData = {
              name: mealName,
              protein: protein,
              calories: calories,
              Carbs: carbs,
              Fat: fat,
              image: base64Image
          };

          // Send the meal data to the /meals endpoint
          $.ajax({
              url: 'http://127.0.0.1:5000/api/v1/meals',
              type: 'POST',
              contentType: 'application/json',
              dataType: 'json',
              headers: {
                  'Authorization': 'Basic ' + btoa('john:password123')
              },
              data: JSON.stringify(mealData),
              success: function (meal) {
                  const mealId = meal.id;
                  const selectedPreferences = [];
                  $('#createProductModal input[type="checkbox"]:checked').each(function () {
                      selectedPreferences.push(this.id);
                  });

                  // Send preferences to the /meals/<meal_id>/preferences endpoint
                  $.ajax({
                      url: `http://127.0.0.1:5000/api/v1/meals/${mealId}/preferences`,
                      type: 'POST',
                      contentType: 'application/json',
                      headers: {
                          'Authorization': 'Basic ' + btoa('john:password123')
                      },
                      data: JSON.stringify({ preferences: selectedPreferences }),
                      success: function (data) {
                          console.log('Preferences added:', data);
                          mealForm.reset();
                          closebutton.click();
                          showNotification('Meal created successfully', 'green');
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                          console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
                          closebutton.click();
                          showNotification('There was a problem with the fetch operation', 'red');
                      }
                  });

              },
              error: function (jqXHR, textStatus, errorThrown) {
                  console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
                  closebutton.click();
                  showNotification('There was a problem with the fetch operation', 'red');
              }
          });
      };

      reader.onerror = function (error) {
          console.error('Error reading file:', error);
          closebutton.click();
          showNotification('Error reading file', 'red');
      };
  });

  function showNotification(message, color) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.classList.add('fixed', 'top-4', 'right-4', 'p-4', 'text-white', 'rounded-md', 'shadow-md');

      if (color === 'green') {
          notification.classList.add('bg-green-500');
      } else if (color === 'red') {
          notification.classList.add('bg-red-500');
      }

      document.body.appendChild(notification);

      setTimeout(() => {
          notification.remove();
      }, 3000);
  }
});
