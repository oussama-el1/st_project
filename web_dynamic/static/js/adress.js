$(document).ready(function () {
    // Initially disable the submit button
    $('.button-50').prop('disabled', true);

    // Function to enable/disable submit button based on input fields
    function toggleSubmitButton() {
        var fields = $('#shipping-form input[required]');
        var allFieldsFilled = true;

        fields.each(function() {
            if ($(this).val() === '') {
                allFieldsFilled = false;
                return false;
            }
        });

        $('.button-50').prop('disabled', !allFieldsFilled);
    }

    // Call toggleSubmitButton function whenever input fields change
    $('#shipping-form input').on('input', toggleSubmitButton);

    // Submit form when button is clicked
    $('.button-50').click(function (event) {
        event.preventDefault();

        var first_name = $('input[name="first-name"]').val();
        var last_name = $('input[name="last-name"]').val();
        var street = $('input[name="street-address"]').val();
        var apt = $('input[name="apt-suite-floor"]').val();
        var city = $('input[name="city"]').val();
        var zip_code = $('input[name="zip-code"]').val();
        var state = $('input[name="state"]').val();
        var tel = $('input[name="tel"]').val();

        $.ajax({
            type: 'POST',
            url: '/store_session_data_address',
            contentType: 'application/json',
            data: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "street": street,
                "apt": apt,
                "city": city,
                "zip_code": zip_code,
                "state": state,
                "tel": tel
            }),
            success: function (response) {
                window.location.href = '/checkout';
            },
            error: function (xhr, status, error) {
                console.error('Error storing session data:', error);
            }
        });
    });
});
