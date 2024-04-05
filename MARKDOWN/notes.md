## Google Auth Sign In:

    -> Tutorial followed: https://youtu.be/UUJfTsn6S_Y?si=5HH5B3mcfzoIqsLh 2.

## Nodemailer:

## Font Awesome installation:

    -> https://docs.fontawesome.com/web/use-with/react

## In MongoDB, to add a name to your DB collection, you can modify the Mongo URI like so:

    -> mongodb+srv://[your name]:[some data].mongodb.net/[**ADD NAME HERE**]?retryWrites=true&w=majority&appName=Blog

## In Express Session to set a cookie:

1. Make sure that in your axios/fetch request, you have: `withCredentials true` (though this applies to setting cookies in general--express-session or not) **this applies to the frontend**

2. Make sure CORs in your backend accepts cookies **this applies to the backend**

3. Make sure your express-session cookie object has `sameSite: "none"` commented out. If uncommented, it will delete the cookie on page reload **this applies to the backend**

4. To rename your express-session cookie from "connect.sid", just add `name: "new-cookie-name",` in your session object **this applies to the backend**
