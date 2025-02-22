


let cart = [];
let currentUser = null;


function showSection(event) {
    const sectionId = event.target.dataset.section
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('product-details-section').style.display = 'none';
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('checkout-message').style.display = 'none';

    if (sectionId === 'auth') {
        checkUserLoginState()
        if (currentUser) {
            document.getElementById('user-dashboard').style.display = 'block';
        } else {
            document.getElementById('auth-section').style.display = 'block';
        }
    } else {
        document.getElementById(sectionId + '-section').style.display = 'block';
    }
}
function addToCart(product) {
    cart.push(product);
    updateCart();
}


function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="" alt="${item.name}">
            <span>${item.name}</span>
            <span>$${item.price}</span>
             <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length > 0) {
        document.getElementById('cart-items').innerHTML = ''
        cart = []
        updateCart()
        document.getElementById('checkout-message').style.display = 'block';
    } else {
        alert("Your cart is empty");
    }
}

function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('edit-profile-form').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('edit-profile-form').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'none';
}

function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(user => user.username === username || user.email === email)) {
        alert("User with this username or email already exists!");
        return false;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('Registration:', newUser);

    showLoginForm();
    alert("Registration successful! Please log in now.");
    return false;
}


function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        console.log('Login:', user);
        currentUser = user;
        showDashboard();
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('welcome-text').textContent = `Welcome, ${username}!`;
        return false;
    } else {
        alert("Invalid username or password!");
        return false;
    }
}

function showDashboard() {
    if (currentUser) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'block';
        document.getElementById('edit-profile-form').style.display = 'none';
        document.getElementById('dashboard-username').textContent = currentUser.username;
        document.getElementById('dashboard-email').textContent = currentUser.email;
        document.getElementById('welcome-message').style.display = 'none';

    }
}

function editProfile() {
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('edit-profile-form').style.display = 'block';
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('edit-username').value = currentUser.username;
    document.getElementById('edit-email').value = currentUser.email;
}

function saveProfile() {
    const newUsername = document.getElementById('edit-username').value;
    const newEmail = document.getElementById('edit-email').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex > -1) {
        users[userIndex].username = newUsername
        users[userIndex].email = newEmail
        localStorage.setItem('users', JSON.stringify(users));
        currentUser.username = newUsername;
        currentUser.email = newEmail;
        alert("Profile updated!");
        showDashboard();
    }
    return false;
}

function logoutUser() {
    currentUser = null;
    document.getElementById('user-dashboard').style.display = 'none';
    document.getElementById('edit-profile-form').style.display = 'none';
    showLoginForm();
}

function checkUserLoginState() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length > 0) {
        let loginUser = localStorage.getItem('lastLoginUser');
        if (loginUser) {
            loginUser = JSON.parse(loginUser);
            if (users.find(user => user.username === loginUser.username && user.password === loginUser.password)) {
                currentUser = loginUser
                showDashboard();
                return;
            }
        }
    }

    showSection({ target: { dataset: { section: 'products' } } })
}


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('header nav a').forEach(link => {
        link.addEventListener('click', showSection);
    });
    checkUserLoginState();
});