1. On GitHub, before making your mern-blog repo public, remove the .env file

=> Figure out how to prevent the .env file from being pushed to Github despite it being added to the .gitignore file

2. _MIGHT_ need to create a .env file for the clientID used in App.tsx

3. Add the ability to see your password when typing it in the input fields for the registration forms

4. Maybe add loading feature to login button, forgot password, change password buttons too

5. It's a good idea to have a second set of validation on the server to check if the user's email is valid (they might have JavaScript disabled on the browser)

6. Make the "show email" action on the settings page work

7. Consider adding another property to the User model involving making the user account private/public

~~8. If a user signed up through Google, maybe consider hiding the "Security" tab on the user settings page since it seems pointless~~

9. In the future, maybe add options on users' profile pages if they would like to receive email notifications whenever a user posts a new blog

10. Check to see if you _really do_ need CookieParser.

11. May need to add some logic to prevent showing too much personal information on the route '/api/user/[user_id]'

12. On the user profile page's blogs tab, add a delay on the button hover title text

13. In the verIfication_controller.ts file, check if you really do need `await` before the `deleteToken()` function because you use `await deleteToken()` once and `deleteToken()` for the rest of the instances.

14. In the future, add more properties to the Blogs model like upvotes, favorites, etc. and display them on the archived blogs setting page as 'blog stats'

15. Consider adding a character limit on the blog summary textarea AND Blog Title in the blog post form

16. Add a 'save password' feature

17. Style the blogs' delete and edit buttons

18. Modify the logic to handle blog post notification emails where if a user X has blog post notifications enabled for user Y, but block user Y, remove user X's email from user Y's array containing notification subscribers and vice versa if user Y blocks user X.

19. Consider if you want to allow non-logged in users from viewing user profiles. If yes, fix the logic so that unauthenticated users can view user profiles and the blogs listed on the landing page. If not, fix the logic so that you're unable to view the blog if unauthenticated. If you take this route, you will also need to update the email text notification message (in blog_routes.ts) to let the user know that they may also be redirected to a 404 page if they're not logged in.

20. Add a new property to the user model called "isAdmin" and set it to false by default. Implement logic where if you are an admin, you're allowed to delete a user's posts. However, when the admin goes to delete a blog post or account, they're prompted to send an email to that user where they need to add an explanation as to why their blog/account has been deleted.
