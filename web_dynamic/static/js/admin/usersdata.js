"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchUsers(page, perPage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/admin/users?page=${page}&perPage=${perPage}`);
            const data = yield response.json();
            const totalUsers = data.total_users;
            const users = data.users;
            return { totalUsers, users };
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    });
}
function displayUsers(users) {
    const tbody = document.querySelector('.user-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.totalSpend}</td>
        <td>${user.totalOrders}</td>
        <td>${user.email}</td>
        <td>${user.tel}</td>
        <td>${user.createdDate}</td>
        <td>
          <div class="flex items-center space-x-4">
            <button type="button" data-drawer-target="drawer-update-product"
              data-drawer-show="drawer-update-product"
              aria-controls="drawer-update-product"
              class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd" />
              </svg>
              Edit
            </button>
            <!-- Other buttons -->
          </div>
        </td>
      `;
            tbody.appendChild(row);
        });
    }
}
function initPagination(totalUsers, currentPage, perPage) {
    const totalPages = Math.ceil(totalUsers / perPage);
    const nav = document.querySelector('.pagination-nav');
    if (nav) {
        nav.innerHTML = '';
        const prevButton = document.createElement('li');
        prevButton.innerHTML = `
      <a href="#" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="sr-only">Previous</span>
        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd" />
        </svg>
      </a>
    `;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                fetchUsers(currentPage - 1, perPage).then(response => {
                    const totalUsers = response.totalUsers;
                    const users = response.users;
                    displayUsers(users);
                    initPagination(totalUsers, currentPage - 1, perPage);
                });
            }
        });
        nav.appendChild(prevButton);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('li');
            pageButton.innerHTML = `
        <a href="#" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i}</a>
      `;
            if (i === currentPage) {
                pageButton.innerHTML = `
          <a href="#" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${i}</a>
        `;
            }
            pageButton.addEventListener('click', () => {
                fetchUsers(i, perPage).then(response => {
                    const users = response.users;
                    displayUsers(users);
                    initPagination(response.totalUsers, i, perPage);
                });
            });
            nav.appendChild(pageButton);
        }
        const nextButton = document.createElement('li');
        nextButton.innerHTML = `
      <a href="#" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
        <span class="sr-only">Next</span>
        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </a>
    `;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                fetchUsers(currentPage + 1, perPage).then(response => {
                    const totalUsers = response.totalUsers;
                    const users = response.users;
                    displayUsers(users);
                    initPagination(totalUsers, currentPage + 1, perPage);
                });
            }
        });
        nav.appendChild(nextButton);
    }
    else {
        console.error('Pagination navigation element not found.');
    }
}
const currentPage = 1;
const perPage = 3;
fetchUsers(currentPage, perPage).then(response => {
    const totalUsers = response.totalUsers;
    displayUsers(response.users);
    initPagination(totalUsers, currentPage, perPage);
});
