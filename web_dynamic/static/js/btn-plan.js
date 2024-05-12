$(document).ready(function () {
    $('#select-plan-btn').prop('disabled', true);
    $('.message').hide();

    function toggleSelectPlanButton() {
        var anyPreferenceSelected = $('.prefcheckbox:checked').length > 0;
        $('#select-plan-btn').prop('disabled', !anyPreferenceSelected);

        if (anyPreferenceSelected) {
            $('.message').hide();
        } else {
            $('.message').show();
        }
    }
    $('.prefcheckbox').on('change', toggleSelectPlanButton);
    function updateSessionData() {
        var selectedPrefs = [];
        $('.prefcheckbox:checked').each(function () {
            selectedPrefs.push($(this).data('id'));
        });

        const numPeople = $('input[name="numPeople"]:checked').val();
        const mealsPerWeek = $('input[name="mealsPerWeek"]:checked').val();

        const boxprice = numPeople * mealsPerWeek * 9.99;
        const discount = boxprice * 0.3;
        const totale = boxprice - discount

        $.ajax({
            type: 'POST',
            url: '/store_session_data_plan',
            contentType: 'application/json',
            data: JSON.stringify({
                'selectedPrefs': selectedPrefs,
                'numPeople': numPeople,
                'mealsPerWeek': mealsPerWeek,
                'boxprice': boxprice.toFixed(2),
                'discount': discount.toFixed(2),
                'totale': totale.toFixed(2)
            }),
            success: function (response) {
            },
            error: function (xhr, status, error) {
                console.error('Error storing session data:', error);
            }
        });
    }

    $('#select-plan-btn').click(function () {
        updateSessionData();
        window.location.href = '/registration';
    });

    $('.prefcheckbox, input[name="numPeople"], input[name="mealsPerWeek"]').change(function () {
        updateSessionData();
    });
});
