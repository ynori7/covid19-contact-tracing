# Covid19 Contact Tracing
This repository contains a mockup for a covid19 contact tracing form to which can be sent out to a 
quarrantined person to gather information which is currently being obtained manually by phone for each case. 
The intent here is to reduce the amount of manual work being done by health departments by allowing infected 
persons to supply the data directly. This mockup has been initially developed voluntarily for the Munich 
Gesundheitsamt.
 
## How it works
The form contains a series of simple questions, gathering data about the person's address and living and work
 situations which is relevant for determining whether any follow-up is necessary. It also requests information
 about symptoms and preconditions which can be helpful for the Robert Koch Institute to track the development
 of the virus.
 
The user can also supply information about an arbitrary number of contact persons.
 
Once all data has been filled in and the user clicks the submit button, very loose validation is performed, and
the data from the form is structured into a JSON object which can be posted to a backend.

## Extensibility
Fields which should be included in the final payload should be marked with the `data-object` attribute. This 
attribute contains the path to which this field should be placed in the JSON.

For example:
```html
<input type="text" readonly class="form-control-plaintext" id="caseId" name="caseId" data-object="/" value="001234567">
```
The above field with the name `caseId` and the data-object value of `/` will result in a field called `caseId`
being placed at the root of the object.

```html
<input type="text" class="col-sm-10 form-control" id="zip" name="zip" placeholder="PLZ" data-object="/address/primary" required>
```
In this example, the field `zip` will be placed in a `primary` object within an `address` object like so:
```json
{
  "address": {
    "primary": {
      "zip": "54321"
    }
  }
}
```

For checkboxes, each option must contain the `data-object` attribute, and will appear as an array containing only
the checked items in the end.

The contact persons are a special case, each containing a path like this: `/contactPersons/0`. After constructing
the JSON object, the contactPersons field will be converted into an array. 

Any input which does not contain the `data-object` attribute will be omitted from the final payload. This is useful
for fields such as the radio buttons which only exist for showing/hiding additional input fields.

## Follow-up
To follow up, a backend would need to be created which serves this document, filling in the user's name, birthdate,
and case number (the name and birthdate are there in case multiple people from the same household need to supply 
information). 

This backend would also need to generate and store a unique token per case which would appear in the URL. This
non-guessable token would prevent a malicious user from enumerating IDs to see the names of other people and from
sending garbage data.

Sanitization and validation of data needs to occur still in the backend. Ideally, fields such as the checkboxes
would be generated from a database of expected values. The actual checkbox value would ideally be an enum which
the backend can translate.