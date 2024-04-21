1. On GitHub, before making your mern-blog repo public, remove the .env file

=> Figure out how to prevent the .env file from being pushed to Github despite it being added to the .gitignore file

2. _MIGHT_ need to create a .env file for the clientID used in App.tsx

3. Add the ability to see your password when typing it in the input fields for the registration forms

4. Maybe add loading feature to login button, forgot password, change password buttons too

5. It's a good idea to have a second set of validation on the server to check if the user's email is valid (they might have JavaScript disabled on the browser)

6. Make the "show email" action on the settings page work

7. Consider adding another property to the User model involving making the user account private/public

8. If a user signed up through Google, maybe consider hiding the "Security" tab on the user settings page since it seems pointless
