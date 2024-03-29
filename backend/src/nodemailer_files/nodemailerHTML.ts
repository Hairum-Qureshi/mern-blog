const EMAIL_HTML = (
	first_name: string,
	user_id: string,
	token: string,
	token_id: string
) => {
	return `<!DOCTYPE html>
<html>
<head>
<style>
    .header {
        width: 100%;
        box-sizing: border-box;
        background-color: red;
        padding: 10px;
        background-image: url('https://img.freepik.com/free-photo/white-smoke-collection-black-background_1112-1676.jpg?size=626&ext=jpg&ga=GA1.1.523418798.1711497600&semt=ais');
        height: 80px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
        text-align: center;
        font-family: 'Trebuchet MS', sans-serif;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
    }

    .content {
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        width: 100%;
        height: 35vh;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        background: rgb(10,27,92);
        background: linear-gradient(0deg, rgba(10,27,92,1) 0%, rgba(5,5,27,1) 100%);
        color: white;
        font-family: 'Trebuchet MS', sans-serif;
    }

    .content h4 {
        color: white;
        text-align: center;
        margin: 30px;
    }

    .content button {
        padding: 10px;
        font-size: 16px;
        display: block;
        margin: 40px auto;
        width: 50%;
        background-color: #122F65;
        border: 1px solid #07368E;
        border-radius: 5px;
        color: white;
        font-family: 'Trebuchet MS', sans-serif;
    }
    
    .content button:hover {
    	cursor: pointer;
        color: blue;
        border: 1px solid blue;
       	transition: 0.5s;
    }
    
  	.content button:active {
   		background-color: #0757EC;
    }
    
</style>
</head>
<body>

<div class="header">
    <h2 style = "color: white">Digital Dialogue</h2>
</div>
<h4>
<div class="content">Hello ${first_name}, thanks for creating an account! Click the link below to verify your account! <br /><br /> <a href="http://localhost:4000/api/user/verify/${token}?token=${token_id}&uid=${user_id}" style="font-size: 17px; text-align: center;">VERIFY ACCOUNT</a> <br /> <br /> This link will expire in 5 minutes.
    </h4>
</div>
</body>
</html>`;
};

export default EMAIL_HTML;
