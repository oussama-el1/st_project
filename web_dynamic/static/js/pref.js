$(document).ready(function () {
    var selectedPref = {};
    // Handling change events on checkboxes
    $('.prefcheckbox').change(function () {
        var prefName = $(this).data('name');
        var prefid = $(this).data('id');

        if ($(this).is(':checked')) {
            selectedPref[prefid] = prefName;
        } else {
            delete selectedPref[prefid];
        }

        let valuesArray = [];
        $.each(selectedPref, function (key, value) {
            valuesArray.push(value);
        });

        var planDetailsText = (valuesArray.length > 0) ? valuesArray.join(', ') : "Choose your plan";
        
        // Replace the last occurrence of ", " with " and "
        if (valuesArray.length > 1) {
            var lastCommaIndex = planDetailsText.lastIndexOf(', ');
            planDetailsText = planDetailsText.substring(0, lastCommaIndex) + ' and ' + planDetailsText.substring(lastCommaIndex + 2);
        }
        
        // Update the text
        console.log(selectedPref)
        $('.plan-details h3').text(planDetailsText);
    });
});
