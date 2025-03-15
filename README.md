# 🔐 Password Manager Application

Welcome to the **Password Manager Application** repository!  
This project is a secure and user-friendly tool designed to help you store, manage, and protect your passwords. Built with **JavaScript** and modern web technologies, this application provides a practical solution for managing your login credentials.

---

## 🚀 **Features**
✅ Securely store login credentials (website, username, and password)  
✅ Password masking and copying to clipboard  
✅ Edit and delete saved passwords  
✅ LocalStorage-based data persistence  
✅ Clean and responsive UI  

---

## 🛠️ **Technologies Used**
- **HTML** – For structuring the application interface  
- **CSS** – For styling and responsive design  
- **JavaScript** – For handling application logic and interactivity  
- **LocalStorage** – For data persistence  

---

## 📥 **Installation**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/akashprajapati-cse/Password-Manager.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Password-Manager
   ```

3. **Open `index.html`** in your browser:
   - Use a local server (e.g., Live Server in VS Code)  
   - Or directly open the file in your browser  

---

## 🏃 **Usage**
### ✅ **Add Password:**
1. Open the application.  
2. Enter the following details:
   - Website  
   - Username  
   - Password  
3. Click on **Save** – Your data will be securely stored.  

### ✅ **View Saved Passwords:**
- Your saved passwords will appear in a table format.  
- Passwords are hidden using `*` symbols for security.  

### ✅ **Copy to Clipboard:**
- Click on the **clipboard icon** next to a field to copy its content.  

### ✅ **Edit Password:**
1. Click on **Edit** next to the saved password.  
2. Make changes directly in the table.  
3. Click **Update** to save the changes.  

### ✅ **Delete Password:**
- Click **Delete** to remove a saved password.  

---

## 💡 **Project Structure**
```plaintext
Password-Manager/
├── index.html         # Main HTML structure
├── style.css          # Styling for the UI
├── script.js          # JavaScript logic
└── README.md          # Project documentation
```

---

## 🧪 **Code Highlights**
### ✅ **Hide Password with Asterisks (`*`)**
```javascript
const hidePassword = (password) => {
  let hiddenPassword = "";
  for (let i = 0; i < password.length; i++) {
    hiddenPassword += "*";
  }
  return hiddenPassword;
};
```

### ✅ **Copy to Clipboard**
```javascript
const copyContent = (content) => {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      alert("Copied");
    })
    .catch((err) => {
      alert("Copying Failed");
    });
};
```

### ✅ **Save to LocalStorage**
```javascript
localStorage.setItem("passwordDetails", JSON.stringify(passwordData));
```

---

## ✅ **Best Practices**
- Keep your passwords secure by using a strong master password.  
- Clear saved passwords regularly if not needed.  
- Avoid using sensitive passwords for testing purposes.  

---

## 👨‍💻 **Contributors**
- **Akash Prajapati** – [GitHub](https://github.com/akashprajapati-cse)  

---

## 📄 **License**
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

**⭐ If you like this project, consider giving it a star on GitHub!**  
