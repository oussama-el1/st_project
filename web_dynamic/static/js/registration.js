$(document).ready(function () {
    // Initially hide the error message
    $('.error-msg').hide();

    // Initially disable the submit button
    $('.registration-btn').prop('disabled', true);

    // Function to enable/disable submit button based on input fields
    function toggleSubmitButton() {
        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();

        // Check if email is valid
        if (isValidEmail(email)) {
            // Hide error message if email is valid
            $('.error-msg').hide();
            // Enable submit button if both email and password are valid
            if (password !== '') {
                $('.registration-btn').prop('disabled', false);
            } else {
                $('.registration-btn').prop('disabled', true);
            }
        } else {
            // Show error message if email is invalid
            $('.error-msg').show();
            // Disable submit button if email is invalid
            $('.registration-btn').prop('disabled', true);
        }
    }

    // Validate email format
    function isValidEmail(email) {
        // Regular expression for validating email format
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Call toggleSubmitButton function whenever input fields change
    $('input[name="email"], input[name="password"]').on('input', toggleSubmitButton);

    // Submit form when button is clicked
    $('.registration-btn').click(function (event) {
        event.preventDefault();

        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();

        // Proceed with AJAX request
        $.ajax({
            type: 'POST',
            url: '/store_session_data_registration',
            contentType: 'application/json',
            data: JSON.stringify({
                'email': email,
                'password': password
            }),
            success: function (response) {
                // Redirect user to registration page
                window.location.href = '/form';
            },
            error: function (xhr, status, error) {
                console.error('Error storing session data:', error);
            }
        });
    });
});
