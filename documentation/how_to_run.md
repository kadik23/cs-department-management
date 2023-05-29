# **How to run:**

### **Requirements:**
- **PHP:** v8.2
- **MariaDB SQL:** v15.1

You can run it in php 7.* but the latest version is more stable.

### **Steps:**

1- There is a file called database_creation.sql under the database directory copy the code and run it in your sql server and the code will initiate all the necessary tables including admin cred.

2- If you are using PHP v8.2 you can test the app by running the following command line:

```bash
php -S localhost:8000 -t src
```

and then open your browser and type: 'localhost:8000'

If you are not using PHP v7.*, there is no devlopement server in that version so you need to use a server that support php like apache or wamp.then copy src directory files to your server directory and put includes and database one layer above the directory.

3- Now you will get a login page.
default admin cred:
    username: admin
    password: admin

4- now you can create other accounts and manage the application as you want.