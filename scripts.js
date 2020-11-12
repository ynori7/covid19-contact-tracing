/* Display functions */
function toggleSection(id, show) {
    if(show) {
        $(id).removeClass("d-none")
    } else {
        $(id).addClass("d-none")
    }
}

function checkCountry() {
    if($("#infectionSource-country").val() == "DE") {
        toggleSection("#infectionSourceAddress", true)
    } else {
        toggleSection("#infectionSourceAddress", false)
    }
}

$( function() {
    $( ".datepicker" ).datepicker({
        dateFormat: 'dd-mm-yy',
        maxDate: '0'
    });
} );

/* Form construction and validation */
var jsonForm = {};

function buildForm() {
    $('input[type=text], input[type=checkbox]:checked, select, textarea').each(function(e) {
        var t = $( this );

        var name = t.attr('name');
        var val = t.val();
        var path = t.attr('data-object');

        if(!name || !path) {
            return;
        }

        if(t.attr('type') == 'checkbox') {
            pushAtPath(path, name, val);
        } else {
            setAtPath(path, name, val);
        }
    });

    // Some additional logic for contact persons
    jsonForm.contactPersons = jsonForm.contactPersons || {};

    var contactPersons = [];
    for(var i in jsonForm.contactPersons) {
        contactPersons.push(jsonForm.contactPersons[i])
    }

    jsonForm.contactPersons = contactPersons
}

function setAtPath(path, name, val) {
    if(path == '/') {
        jsonForm[name] = val;
    } else {
        current = jsonForm;
        path.split('/').slice(1).forEach(function(elem){
            current[elem] = current[elem] || {};
            current = current[elem];
        });
        current[name] = val;
    }
}

function pushAtPath(path, name, val) {
    if(path == '/') {
        jsonForm[name] = jsonForm[name] || [];
        jsonForm[name].push(val);
    } else {
        current = jsonForm;
        path.split('/').slice(1).forEach(function(elem){
            current[elem] = current[elem] || {};
            current = current[elem];
        });
        current[name] = current[name] || [];
        current[name].push(val);
    }
}

/* Buttons */

$(function() {
    $('#survey').submit(function() {
        buildForm();

        $.post("https://www.scottfinlay.xyz/dev/corona-form-submit.php", {"body": JSON.stringify(jsonForm)}, function (data) {
            $('.mainContent').first().html("<pre>"+JSON.stringify(data, undefined, 4)+"</pre>");
        });

        return false;
    });
});

var contactPersonIndex = 0;

function addContactPerson() {
    markup = getContactPersonMarkup(contactPersonIndex);

    toggleSection("#contactPersonList", true)
    $('#contactPersonList').append(markup);

    contactPersonIndex++;
}

function getContactPersonMarkup(index) {
    return '<div class="col-sm-12 col-md-10 offset-md-1 row contactPerson">\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label for="contact-person-givenname' + index + '" class="col-sm-12">Vorname</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-givenname' + index + '" placeholder="Max" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label for="contact-person-familyname' + index + '" class="col-sm-12">Nachname</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-familyname' + index + '" placeholder="Mustermann" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label class="col-sm-12" for="contact-person-street' + index + '">Straße/Hausnummer</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-street' + index + '" name="street" placeholder="Straße" data-object="/contactPersons/' + index + '" required>\n' +
        '                            <input type="text" class="col-sm-2 form-control" id="contact-person-house' + index + '" name="house" placeholder="Nr." data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label class="col-sm-12" for="contact-person-zip' + index + '">Postleitzahl</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-zip' + index + '" name="zip" placeholder="PLZ" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label class="col-sm-12" for="contact-person-city' + index + '">Stadt</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-city' + index + '" name="city" placeholder="München" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label class="col-sm-12" for="contact-person-phone' + index + '">Telefonnummer</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-phone' + index + '" name="phone" placeholder="089/1234567" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label class="col-sm-12" for="contact-person-email' + index + '">E-Mail</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-email' + index + '" name="email" placeholder="abc@mail.de" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>';
}