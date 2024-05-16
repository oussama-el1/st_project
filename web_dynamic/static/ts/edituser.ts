// Define a function to handle the edit button click
function handleEditButtonClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  // Get the closest row containing user data
  const row = target.closest('tr');

  if (row) {
      // Extract user data from the row
      const firstName = row.querySelector('.first-name')?.textContent;
      const lastName = row.querySelector('.last-name')?.textContent;
      const email = row.querySelector('.email')?.textContent;
      const tel = row.querySelector('.tel')?.textContent;
      const createdDate = row.querySelector('.created-date')?.textContent;

      // Populate input fields in the update form with user data
      (document.getElementById('firstname2') as HTMLInputElement).value = firstName || '';
      (document.getElementById('lastname2') as HTMLInputElement).value = lastName || '';
      (document.getElementById('email2') as HTMLInputElement).value = email || '';
      (document.getElementById('tel2') as HTMLInputElement).value = tel || '';
      (document.getElementById('datepicker') as HTMLInputElement).value = createdDate || '';
      
      // Open the update form
      // Add your code to open the update form if needed
  }
}

// Add click event listeners to all edit buttons
document.querySelectorAll('.edit-button').forEach((button: Element) => {
  button.addEventListener('click', handleEditButtonClick);
});

