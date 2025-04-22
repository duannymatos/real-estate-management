# USER REGISTRATION
### USERS MUST FILL OUT ALL FIELDS IN ORDER TO COMPLETE REGISTRATION

1. **Email**
User must enter email in order to complete registration.
If user does not include "@", a message will return requesting to add valid email.
Regardless of user upercase letters, code will format all to lowercase prior to persisting to DB.

2. **Phone Number**
User must enter phone number in order to complete registration.
If user does not enter exactly 10 digits, a message will return requesting to add valid phone number.
User must enter phone number as 10 digits without formating and the code will format properly prior to persisting to DB.
**User enters** 5555555555
**Code will format to** (555) 555-5555


3. **Password**
User must enter password in order to complete registration.
If user does not enter a minimum of 8 characters to satisfy password criteria.

**EMAIL MUST BE UNIQUE FOR EVERY USER**
If there is an attempt to register with an existing email in the DB, function will return error message

---

# USER LOGIN

### User must enter email and password in order to login.

1. **Email**
If user does not enter "@"