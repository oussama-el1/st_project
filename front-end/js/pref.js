$(document).ready(function () {
    var selectedPref = {};
    
    // Handling change events on checkboxes
    $('.prefcheckbox').change(function () {
        var prefName = $(this).data('name');
        
        if ($(this).is(':checked')) {
            selectedPref[prefName] = prefName;
        } else {
            delete selectedPref[prefName];
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
        $('.plan-details h3').text(planDetailsText);
    });
});
