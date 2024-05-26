const editButtons = document.querySelectorAll('.edit-button');
const deleteButtons = document.querySelectorAll('.delete-button');

editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const row = event.target.closest('tr');

        const order_id = row.querySelector('.order_id').innerText;

        let delivery_address = row.querySelector('.delivery_address').innerText;
        let parts = delivery_address.split(", ");
        let [state, cityZip, street, apt] = parts;
        let [city, zipcode] = cityZip.split(" [");
        zipcode = zipcode.slice(0, -1);

        const order_status = row.querySelector('.order_status').innerText;
        let delivery_date = row.querySelector('.delivery_date').innerText;
        delivery_date = delivery_date.split(' ');


        document.querySelector('#drawer-update-product .orderid').innerHTML = order_id;
        document.getElementById('state').value = state;
        document.getElementById('city').value = city;
        document.getElementById('Zipcode').value = zipcode;
        document.getElementById('Street').value = street;
        document.getElementById('Appartement').value = apt;


        const selectElement = document.querySelector('#orderstatus');

        const options = selectElement.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === order_status) {
                option.setAttribute('selected', 'selected');
            } else {
                option.removeAttribute('selected');
            }
        });
        document.getElementById('datepicker').value = delivery_date[0];

        // Get meals info and create meal elements
        const mealsDiv = row.querySelector('#meals');
        const mealIDs = mealsDiv.querySelectorAll('.mealid');
        const mealNames = mealsDiv.querySelectorAll('.mealname');
        const mealsContainer = document.querySelector('.MealsInOrder .mealscontainer');
        mealsContainer.innerHTML = '';

        mealIDs.forEach((mealID, index) => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('onemeal', 'p-2', 'w-auto', 'h-[200px]', 'bg-gray-100', 'rounded-lg', 'dark:bg-gray-700', 'relative');
        
            mealDiv.setAttribute('data-meal-id', mealID.textContent.trim());
        
            const mealImage = document.createElement('img');
            mealImage.classList.add('meal-image', 'rounded-lg');
            mealImage.src = `../../../static/images/meals/${mealID.textContent}.jpg`
            mealImage.alt = 'Meal Image';
        
            const containerDiv = document.createElement('div');
            containerDiv.style.display = 'flex';
            containerDiv.style.flexDirection = 'row';
            containerDiv.style.alignItems = 'center';
            containerDiv.style.justifyContent = 'space-between';
        
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('absolute', 'text-red-600', 'dark:text-red-500', 'hover:text-red-500', 'dark:hover:text-red-400', 'bottom-1', 'right-1');
            removeButton.innerHTML = `
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only">Remove Meal</span>
            `;
            removeButton.addEventListener('click', () => {
                mealDiv.remove();
            });
        
            const mealNameSpan = document.createElement('span');
            mealNameSpan.classList.add('mealname', 'block', 'text-sm', 'font-medium', 'text-gray-900', 'absolute', 'bottom-1', 'left-1', 'dark:text-white', 'ml-2');
            mealNameSpan.textContent = mealNames[index].textContent;
        
            mealDiv.appendChild(mealImage);
            containerDiv.appendChild(removeButton);
            containerDiv.appendChild(mealNameSpan);
            mealDiv.appendChild(containerDiv);
        
            mealsContainer.appendChild(mealDiv);
        });
    });
});

deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const row = event.target.closest('tr');
        const order_id = row.querySelector('.order_id').innerText;

        document.querySelector('#delete-modal .orderid').innerHTML = order_id;
    });
});
