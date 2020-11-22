/* Display functions */
function toggleSection(id, show) {
    if(show) {
        $(id).show('slow')
    } else {
        $(id).hide('slow')
    }
}

function checkCountry() {
    if($("#infectionSource-country").val() == "DE") {
        toggleSection("#infectionSourceAddress", true)
    } else {
        toggleSection("#infectionSourceAddress", false)
    }
}

$(function () {
    datePickerInit();
});

function datePickerInit() {
    $(".datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        maxDate: '0'
    });

    $(".datepicker-future").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: '0'
    });
}

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

    $('#contactPersonList').append(markup);
    toggleSection("#contactPersonList", true)

    $('html, body').animate({
        scrollTop: $('#contact-person-'+contactPersonIndex).offset().top
    }, 500);

    contactPersonIndex++;

    datePickerInit();
}

function getContactPersonMarkup(index) {
    return '<div class="col-sm-12 col-md-10 offset-md-1 row contactPerson" id="contact-person-'+index+'">\n' +
        '                    <button type="button" class="x" onclick="$(this).parent().slideUp(400, function(){ $(this).remove();});">X</button>\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label for="contact-person-givenname' + index + '" class="col-sm-12">Vorname</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" name="givenname" id="contact-person-givenname' + index + '" placeholder="Max" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row required">\n' +
        '                        <label for="contact-person-familyname' + index + '" class="col-sm-12">Nachname</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" name="familyname" id="contact-person-familyname' + index + '" placeholder="Mustermann" data-object="/contactPersons/' + index + '" required>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                   <div class="form-group col-sm-12 row">\n' +
        '                       <legend class="col-sm-12 col-form-label pt-0">selber Haushalt</legend>\n' +
        '\n' +
        '                       <div class="col-sm-12">\n' +
        '                           <div class="form-check form-check-inline">\n' +
        '                               <input class="form-check-input" type="radio" name="contact-person-sameHousehold" id="contact-person-sameHousehold'+index+'-1" value="0" onclick="toggleSection(\'#contact-person-'+index+' .optionalSection\', true)" checked>\n' +
        '                               <label class="form-check-label" for="contact-person-sameHousehold'+index+'-1">nein</label>\n' +
        '                           </div>\n' +
        '\n' +
        '                           <div class="form-check form-check-inline">\n' +
        '                               <input class="form-check-input" type="radio" name="contact-person-sameHousehold" id="contact-person-sameHousehold'+index+'-2" value="1" onclick="toggleSection(\'#contact-person-'+index+' .optionalSection\', false)">\n' +
        '                               <label class="form-check-label" for="contact-person-sameHousehold'+index+'-2">ja</label>\n' +
        '                           </div>\n' +
        '                       </div>\n' +
        '                   </div>' +
        '                   <div class="form-group col-sm-6 row optionalSection required">\n' +
        '                       <label class="col-sm-12" for="contact-person-lastDayOfContact"' + index + '">Letzter Kontakt</label>\n' +
        '                       <div class="col-sm-12 row no-gutters">\n' +
        '                           <input type="text" class="col-sm-10 form-control datepicker" id="contact-person-lastDayOfContact' + index + '" name="lastDayOfContact" data-object="/contactPersons/' + index + '" placeholder="01-01-2020">\n' +
        '                       </div>\n' +
        '                   </div>' +
        '\n' +
        '                    <div class="form-group col-sm-6 row optionalSection">\n' +
        '                        <label class="col-sm-12" for="contact-person-street' + index + '">Straße/Hausnummer</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-street' + index + '" name="street" placeholder="Straße" data-object="/contactPersons/' + index + '">\n' +
        '                            <input type="text" class="col-sm-2 form-control" id="contact-person-house' + index + '" name="house" placeholder="Nr." data-object="/contactPersons/' + index + '">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row optionalSection">\n' +
        '                        <label class="col-sm-12" for="contact-person-zip' + index + '">Postleitzahl</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-zip' + index + '" name="zip" placeholder="PLZ" data-object="/contactPersons/' + index + '">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group col-sm-6 row optionalSection">\n' +
        '                        <label class="col-sm-12" for="contact-person-city' + index + '">Stadt</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-city' + index + '" name="city" placeholder="München" data-object="/contactPersons/' + index + '">\n' +
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
        '                    <div class="form-group col-sm-6 row">\n' +
        '                        <label class="col-sm-12" for="contact-person-email' + index + '">E-Mail</label>\n' +
        '                        <div class="col-sm-12 row no-gutters">\n' +
        '                            <input type="text" class="col-sm-10 form-control" id="contact-person-email' + index + '" name="email" placeholder="abc@mail.de" data-object="/contactPersons/' + index + '">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-sm-6 row d-flex align-items-end no-gutters required">\n' +
        '                       <label class="col-sm-12" for="contact-person-symptoms' + index + '">Hat/Hatte diese Person Covid-19-typische Symptome?</label>\n' +
        '                       <select name="hasSymptoms" id="contact-person-symptoms' + index + '" class="col-sm-12 custom-select" data-object="/contactPersons/' + index + '">\n' +
        '                           <option value="" selected>Bitte auswählen</option>\n' +
        '                           <option value="Ja">Ja</option>\n' +
        '                           <option value="Nein">Nein</option>\n' +
        '                           <option value="Nicht Bekannt">Nicht Bekannt</option>\n' +
        '                       </select>\n' +
        '                   </div>' +
        '                </div>';
}