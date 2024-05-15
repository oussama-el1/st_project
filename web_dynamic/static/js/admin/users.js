// Function to fetch users from the API along with total_users
async function fetchUsers(page, perPage) {
  try {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://127.0.0.1:5000/api/v1/admin/users?page=${page}&perPage=${perPage}`,
        method: 'GET',
        success: function(response) {
          resolve(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error fetching users:', errorThrown);
          reject(errorThrown);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow the error for higher-level handling
  }
}

// Function to display users
function displayUsers(users) {
  const tbody = document.querySelector('.user-table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div class="flex items-center mr-3">${user.id}</div>
          </th>
          <td class="px-4 py-3">
            <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">${user.FirstName}</span>
          </td>
          <td class="px-4 py-3">
            <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">${user.LastName}</span>
          </td>
          <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${user.totale_spend}</td>
          <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div class="flex items-center" style="gap: 5px;">
              ${user.total_orders}
              <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-400 mr-2" aria-hidden="true">
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </div>
          </td>
          <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${user.email}</td>
          <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${user.tel}</td>
          <td class="px-4 py-3">${user.created_at}</td>
          <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div class="flex items-center space-x-4">
              <button type="button" data-drawer-target="drawer-update-product" data-drawer-show="drawer-update-product" aria-controls="drawer-update-product" class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
                Edit
              </button>
              <button type="button" data-drawer-target="drawer-read-product-advanced" data-drawer-show="drawer-read-product-advanced" aria-controls="drawer-read-product-advanced" class="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-2 -ml-0.5">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
                </svg>
                Preview
              </button>
              <button type="button" data-modal-target="delete-modal" data-modal-toggle="delete-modal" class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
      tbody.appendChild(row);
    });
  }
}


// Flag to indicate whether a request is in progress
let isRequestInProgress = false;

// Function to initialize pagination
function initPagination(total_users, currentPage, perPage) {
  // Calculate total number of pages
  const totalPages = Math.ceil(total_users / perPage);

  // Remove existing event listeners from "Previous" button
  const prevButton = document.querySelector('.prev');
  if (prevButton) {
    prevButton.removeEventListener('click', handlePrevButtonClick);
  }

  // Remove existing event listeners from "Next" button
  const nextButton = document.querySelector('.next');
  if (nextButton) {
    nextButton.removeEventListener('click', handleNextButtonClick);
  }

  // Function to handle "Previous" button click
  function handlePrevButtonClick() {
    if (!isRequestInProgress && currentPage > 1) {
      isRequestInProgress = true; // Set flag to true
      fetchAndDisplayUsers(currentPage - 1, perPage)
        .then(() => {
          currentPage--; // Update current page
        })
        .catch(error => {
          console.error('Error fetching and displaying users:', error);
        })
        .finally(() => {
          isRequestInProgress = false; // Reset flag
        });
    }
  }

  // Function to handle "Next" button click
  function handleNextButtonClick() {
    if (!isRequestInProgress && currentPage < totalPages) {
      isRequestInProgress = true; // Set flag to true
      fetchAndDisplayUsers(currentPage + 1, perPage)
        .then(() => {
          currentPage++; // Update current page
        })
        .catch(error => {
          console.error('Error fetching and displaying users:', error);
        })
        .finally(() => {
          isRequestInProgress = false; // Reset flag
        });
    }
  }

  // Attach event listener to "Previous" button
  if (prevButton) {
    prevButton.addEventListener('click', handlePrevButtonClick);
  }

  // Attach event listener to "Next" button
  if (nextButton) {
    nextButton.addEventListener('click', handleNextButtonClick);
  }
}

// Function to fetch users from API and display them
async function fetchAndDisplayUsers(page, perPage) {
  try {
    const response = await fetchUsers(page, perPage);
    displayUsers(response.users);
    // Update pagination with new page number
    initPagination(response.total_users, page, perPage);
  } catch (error) {
    throw error;
  }
}

// Initial load
const initialPage = 1;
const itemsPerPage = 9; // Adjust as needed

// Fetch and display users for initial page
fetchAndDisplayUsers(initialPage, itemsPerPage);