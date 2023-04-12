# Contribution

### **How to use Git ?**

Just clone the repo using

```bash
git clone https://github.com/abdelfetah18/cs-department-management

# Then just change directory to cs-department-management.
cd cs-department-management
```

To run the app, just run:

```bash
php -S localhost:8000 -t src
```

### **How to work on something ?**
First, you need to ensure that you have the same version from the repo.
just run:

```bash
git pull
```
and this will update your local files with its changes.


### **How to push your work ?**

If you have created new files just write:
```bash
git add <file>,...

# Example
git add /src/admin/login.php, /src/admin/register.php
```
or you can write to add all files:
```bash
git add .
```


Then just commit the changes:

```bash
git commit -m "<your changes message>"

# Example
git commit -m "Creating project files structure."
```

and then push to the repo:

```bash
git push -u origin main
```
