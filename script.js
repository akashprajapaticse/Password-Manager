// script.js
console.log("DEBUG: script.js has started executing!");

// --- Utility Functions ---
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.error("DEBUG ERROR: Toast element not found! Cannot show notifications.");
        return;
    }
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
};

const hidePassword = (password) => {
    return "*".repeat(password.length);
};

// IMPORTANT: copyContent needs to be globally accessible for onClick in HTML
window.copyContent = async (content) => {
    console.log("DEBUG: Attempting to copy content:", content);
    try {
        // Using navigator.clipboard.writeText() as it's modern and should work in Canvas
        await navigator.clipboard.writeText(content);
        showToast("Copied to clipboard!");
        console.log("DEBUG: Content copied successfully.");
    } catch (err) {
        console.error('DEBUG ERROR: Copying failed:', err);
        showToast("Failed to copy!", 'error');
    }
};

// --- DOM Elements (Declared globally, assigned in DOMContentLoaded) ---
let passwordForm;
let websiteInput;
let usernameInput;
let passwordInput;
let passwordTableBody;
let emptyState;
let editModal;
let closeButton;
let editForm;
let editIndexInput;
let editWebsiteInput;
let editUsernameInput;
let editPasswordInput;

// --- Functions for data management ---
const getPasswordData = () => {
    console.log("DEBUG: getPasswordData called.");
    const passwordDetails = localStorage.getItem("passwordDetails");
    return passwordDetails ? JSON.parse(passwordDetails) : [];
};

const setPasswordData = (data) => {
    console.log("DEBUG: setPasswordData called with data:", data);
    localStorage.setItem("passwordDetails", JSON.stringify(data));
};

// IMPORTANT: deletePasswordData and editPasswordData must be globally accessible for onClick in HTML
window.deletePasswordData = (index) => {
    console.log("DEBUG: deletePasswordData called for index:", index);
    // Using a custom modal for confirmation is better, but confirm() for simplicity here.
    // In a real app, replace this with a beautiful modal.
    if (confirm("Are you sure you want to delete this password?")) {
        let passwordData = getPasswordData();
        passwordData.splice(index, 1);
        setPasswordData(passwordData);
        showToast("Password deleted successfully!");
        populateSavedPasswordDetails();
        console.log("DEBUG: Password deleted and table re-populated.");
    }
};

window.editPasswordData = (index) => {
    console.log("DEBUG: editPasswordData called for index:", index);
    const passwordData = getPasswordData();
    const itemToEdit = passwordData[index];

    if (itemToEdit && editModal && editIndexInput && editWebsiteInput && editUsernameInput && editPasswordInput) {
        editIndexInput.value = index;
        editWebsiteInput.value = itemToEdit.website;
        editUsernameInput.value = itemToEdit.username;
        editPasswordInput.value = itemToEdit.password; // Show actual password in edit field
        editModal.classList.add('show');
        console.log("DEBUG: Edit modal shown with data for index:", index);
    } else {
        console.error("DEBUG ERROR: Cannot edit. Element(s) or data not found for edit modal.", { itemToEdit, editModal, editIndexInput, editWebsiteInput, editUsernameInput, editPasswordInput });
        showToast("Error preparing edit. Please try again.", 'error');
    }
};

const saveNewPassword = (website, username, password) => {
    console.log("DEBUG: saveNewPassword called.");
    const passwordData = getPasswordData();
    passwordData.push({ website, username, password });
    setPasswordData(passwordData);
    showToast("Password saved successfully!");
    populateSavedPasswordDetails();
};

const updatePasswordData = () => {
    console.log("DEBUG: updatePasswordData called.");
    const index = parseInt(editIndexInput.value);
    const passwordData = getPasswordData();

    if (index >= 0 && index < passwordData.length) {
        passwordData[index] = {
            website: editWebsiteInput.value,
            username: editUsernameInput.value,
            password: editPasswordInput.value
        };
        setPasswordData(passwordData);
        showToast("Password updated successfully!");
        populateSavedPasswordDetails();
        if (editModal) {
            editModal.classList.remove('show');
            console.log("DEBUG: Edit modal hidden after update.");
        }
    } else {
        showToast("Error updating password.", 'error');
        console.error("DEBUG ERROR: Invalid index or data for update:", { index, passwordData });
    }
};

const populateSavedPasswordDetails = () => {
    console.log("DEBUG: populateSavedPasswordDetails called.");
    const passwordData = getPasswordData();
    if (!passwordTableBody || !emptyState) {
        console.error("DEBUG ERROR: Table body or empty state element not found for population!");
        return;
    }

    passwordTableBody.innerHTML = ''; // Clear existing rows

    if (passwordData.length === 0) {
        emptyState.style.display = 'block';
        passwordTableBody.style.display = 'none';
        console.log("DEBUG: No passwords saved, showing empty state.");
        return;
    } else {
        emptyState.style.display = 'table-row-group'; // Use table-row-group for tbody display
        emptyState.style.display = 'none'; // Hide empty state if data exists
        console.log("DEBUG: Passwords found, hiding empty state.");
    }

    passwordData.forEach((row, index) => {
        const tr = document.createElement('tr');
        // IMPORTANT: Escape single quotes in string literals passed to onClick
        const escapedWebsite = row.website.replace(/'/g, "\\'");
        const escapedUsername = row.username.replace(/'/g, "\\'");
        const escapedPassword = row.password.replace(/'/g, "\\'");

        tr.innerHTML = `
                    <td class="py-3 px-4">${row.website} <i onClick="copyContent('${escapedWebsite}')" class="fas fa-copy cursor-pointer text-blue-500 hover:text-blue-700 ml-2"></i></td>
                    <td class="py-3 px-4">${row.username} <i onClick="copyContent('${escapedUsername}')" class="fas fa-copy cursor-pointer text-blue-500 hover:text-blue-700 ml-2"></i></td>
                    <td class="py-3 px-4">${hidePassword(row.password)} <i onClick="copyContent('${escapedPassword}')" class="fas fa-copy cursor-pointer text-blue-500 hover:text-blue-700 ml-2"></i></td>
                    <td class="py-3 px-4">
                        <div class="flex space-x-2">
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 flex items-center" onclick="editPasswordData(${index})">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 flex items-center" onclick="deletePasswordData(${index})">
                                <i class="fas fa-trash-alt mr-1"></i> Delete
                            </button>
                        </div>
                    </td>
                `;
        passwordTableBody.appendChild(tr);
    });
    console.log("DEBUG: Table populated with", passwordData.length, "entries.");
};

// --- Event Listeners and Initial Setup (Ensured DOM is loaded) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded event fired. Attaching listeners.");

    // Re-select DOM elements inside DOMContentLoaded to ensure they exist
    passwordForm = document.getElementById('passwordForm');
    websiteInput = document.getElementById('website');
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');
    passwordTableBody = document.getElementById('passwordTableBody');
    emptyState = document.getElementById('emptyState');
    editModal = document.getElementById('editModal');
    closeButton = document.querySelector('.close-button');
    editForm = document.getElementById('editForm');
    editIndexInput = document.getElementById('editIndex');
    editWebsiteInput = document.getElementById('editWebsite');
    editUsernameInput = document.getElementById('editUsername');
    editPasswordInput = document.getElementById('editPassword');

    // Attach form submit listeners
    try {
        if (passwordForm) {
            passwordForm.addEventListener('submit', (event) => {
                console.log("DEBUG: Form submit event triggered.");
                event.preventDefault();
                saveNewPassword(websiteInput.value, usernameInput.value, passwordInput.value);
                passwordForm.reset();
                console.log("DEBUG: Form reset after save.");
            });
            console.log("DEBUG: passwordForm submit listener attached.");
        } else {
            console.error("DEBUG ERROR: passwordForm element not found. Cannot attach submit listener.");
        }
    } catch (e) {
        console.error("DEBUG ERROR: Error attaching passwordForm submit listener:", e);
    }

    try {
        if (editForm) {
            editForm.addEventListener('submit', (event) => {
                console.log("DEBUG: Edit form submit event triggered.");
                event.preventDefault();
                updatePasswordData();
            });
            console.log("DEBUG: editForm submit listener attached.");
        } else {
            console.error("DEBUG ERROR: editForm element not found. Cannot attach submit listener.");
        }
    } catch (e) {
        console.error("DEBUG ERROR: Error attaching editForm submit listener:", e);
    }

    // Attach modal close listener
    try {
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log("DEBUG: Close button clicked.");
                if (editModal) {
                    editModal.classList.remove('show');
                }
            });
            console.log("DEBUG: closeButton click listener attached.");
        } else {
            console.error("DEBUG ERROR: closeButton element not found. Cannot attach click listener.");
        }
    } catch (e) {
        console.error("DEBUG ERROR: Error attaching closeButton click listener:", e);
    }

    // Close modal when clicking outside of it
    try {
        if (editModal) {
            window.addEventListener('click', (event) => {
                if (event.target == editModal) {
                    console.log("DEBUG: Click outside modal detected. Hiding modal.");
                    editModal.classList.remove('show');
                }
            });
            console.log("DEBUG: Window click listener for modal attached.");
        } else {
            console.warn("DEBUG WARNING: Edit modal element not found. External click listener for modal not active.");
        }
    } catch (e) {
        console.error("DEBUG ERROR: Error attaching window click listener for modal:", e);
    }

    // Toggle password visibility for all password inputs
    try {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            const passwordField = toggle.previousElementSibling; // The input field
            if (passwordField && passwordField.type === 'password') { // Ensure it's a password input
                toggle.addEventListener('click', function() {
                    console.log("DEBUG: Toggle password clicked.");
                    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordField.setAttribute('type', type);
                    this.querySelector('i').classList.toggle('fa-eye');
                    this.querySelector('i').classList.toggle('fa-eye-slash');
                });
            } else {
                console.warn("DEBUG WARNING: Toggle password found but associated input field is not a password type or missing.");
            }
        });
        console.log("DEBUG: Toggle password listeners attempted to attach.");
    } catch (e) {
        console.error("DEBUG ERROR: Error attaching toggle password listeners:", e);
    }

    // Initial load of data when the DOM is ready
    try {
        populateSavedPasswordDetails();
        console.log("DEBUG: Initial password details populated.");
    } catch (e) {
        console.error("DEBUG ERROR: Error during initial populateSavedPasswordDetails call:", e);
    }

    console.log("DEBUG: script.js execution finished initial DOM setup.");
}); // End DOMContentLoaded

console.log("DEBUG: script.js finished global execution phase.");
