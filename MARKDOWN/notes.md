## Google Auth Sign In:

    -> Tutorial followed: https://youtu.be/UUJfTsn6S_Y?si=5HH5B3mcfzoIqsLh 2.

## Nodemailer:

## Font Awesome installation (make sure you're in the frontend folder):

    -> https://docs.fontawesome.com/web/use-with/react

## In MongoDB, to add a name to your DB collection, you can modify the Mongo URI like so:

    -> mongodb+srv://[your name]:[some data].mongodb.net/[**ADD NAME HERE**]?retryWrites=true&w=majority&appName=Blog

## In Express Session to set a cookie:

1. Make sure that in your axios/fetch request, you have: `withCredentials true` (though this applies to setting cookies in general--express-session or not) **this applies to the frontend**

2. Make sure CORs in your backend accepts cookies **this applies to the backend**

3. Make sure your express-session cookie object has `sameSite: "none"` commented out. If uncommented, it will delete the cookie on page reload **this applies to the backend**

4. To rename your express-session cookie from "connect.sid", just add `name: "new-cookie-name",` in your session object **this applies to the backend**

5. After creating a cookie, **make sure you do a `res.send()`** or the cookie will not set on the frontend! (Refer to auth_controller.ts [68] for an example) **this applies to the backend**

## In Express Session to delete a cookie:

- Make sure that your axios request in the frontend is a GET request

# Accessing `req.session.user_id` when the user is signed in

- If you're doing a POST request, make sure you have `{ withCredentials: true }`in the axios frontend code because otherwise, `req.session.user_id` will be undefined

## MISCELLANEOUS

1. The `findUser` function you made isn't necessary since MongoDB has a method called `findById`. An example:

```javascript
const user = await User.findById(user_id);
```

2. You can format `JSON.stringify()` like this:

```javascript
JSON.stringify(jsonCode, null, 4);
// or
JSON.stringify(jsonCode, null, "\t");
```

3. **ALWAYS** make sure that your .env file is not being sent to yout Github repo!

## DEALING WITH EXPRESS SESSION WITH TYPESCRIPT

- This YouTube video covered how to set up the configurations for Express Session with TypeScript:

-> https://youtu.be/FcxjCPeicvU?si=6p98GjkmCckSHTPt

## CSS

- The following CSS will help keep a footer at the bottom of the page regardless if there's content on the page or not:

```css
  {
	min-height: 100vh;
	max-height: inherit;
\ }
```

If there's no content on the page, the footer will be at the bottom by default due to the `min-height: 100vh` property. However, as content is being added, if it exceeds 100vh, the `max-height: inherit` property will take over and the footer will remain at the bottom beneath the content exceeding 100vh.
