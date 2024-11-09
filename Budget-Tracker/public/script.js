console.log('JS is working');

let creditScore = 50;

document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
    loadGoals();
    loadBalance();
    updateScoreIndicator();
});

// Event listener for submitting the expense form
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;

    if (!isNaN(amount) && amount > 0 && description.trim() !== '') {
        const isGoodSpending = determineSpendingType(amount);
        addExpenseToList(amount, category, description);
        updateTotal(amount);
        updateScore(isGoodSpending); // Update the credit score
        clearForm();
        updateLocalStorage();
    } else {
        alert('Please enter a valid amount and description.');
    }
});

// Event listener for submitting the goal form
document.getElementById('goal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const description = document.getElementById('goal-description').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);
    if (description && !isNaN(amount)) {
        addGoalToList(description, amount);
        updateLocalStorageGoals();
    } else {
        alert('Please enter a valid goal and amount.');
    }
});

// Function to add expenses to the list
function addExpenseToList(amount, category, description) {
    const list = document.getElementById('expense-list');
    const item = document.createElement('li');
    item.textContent = `${category}: $${amount.toFixed(2)} - ${description}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function() {
        editExpense(item, amount, category, description);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        deleteExpense(item, amount);
    };

    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    list.appendChild(item);
}

// Function to handle total updates
function updateTotal(amount) {
    const totalElement = document.getElementById('total');
    let total = parseFloat(totalElement.textContent);
    total += amount;
    totalElement.textContent = total.toFixed(2);
}

// Function to clear form inputs
function clearForm() {
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'food';
    document.getElementById('expense-description').value = '';
}

// Function to save expenses to local storage
function updateLocalStorage() {
    const expenses = Array.from(document.querySelectorAll("#expense-list li")).map(item => item.textContent);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("creditScore", creditScore); // Save the credit score
}

// Function to load expenses from local storage
function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(expense => {
        const [category, rest] = expense.split(': ');
        const [amount, description] = rest.split(' - ');
        addExpenseToList(parseFloat(amount.slice(1)), category, description);
    });
    creditScore = parseInt(localStorage.getItem("creditScore")) || 50;
    document.getElementById('score').textContent = creditScore;
}

// Function to determine if spending is good
function determineSpendingType(amount) {
    return amount <= 100; // Define your logic here
}

// Function to update the credit score
function updateScore(isGoodSpending) {
    creditScore += isGoodSpending ? 5 : -5;
    creditScore = Math.max(0, Math.min(creditScore, 100));
    document.getElementById('score').textContent = creditScore;
    updateScoreIndicator();
}

// Function to update the score indicator
function updateScoreIndicator() {
    const score = parseInt(document.getElementById('score').textContent);
    const emoji = document.getElementById('emoji');
    const indicator = document.getElementById('score-indicator');
    const maxScoreWidth = 100;

    emoji.textContent = score >= 50 ? '😃' : '😔';
    const indicatorPosition = (score / 100) * maxScoreWidth;
    indicator.style.width = `${indicatorPosition}%`;
    indicator.style.background = score >= 50 ? 'green' : 'red';
}

// Function to update the balance manually
function updateBalance() {
    const manualBalance = parseFloat(document.getElementById('manual-balance').value);
    if (!isNaN(manualBalance)) {
        document.getElementById('current-balance').textContent = manualBalance.toFixed(2);
        localStorage.setItem('currentBalance', manualBalance);
    } else {
        alert("Please enter a valid balance.");
    }
}

// Function to load the balance from local storage
function loadBalance() {
    const storedBalance = parseFloat(localStorage.getItem('currentBalance'));
    if (!isNaN(storedBalance)) {
        document.getElementById('current-balance').textContent = storedBalance.toFixed(2);
    }
}

// Function to load goals from local storage
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.forEach(goal => addGoalToList(goal.description, goal.amount));
}

// Function to add goals to the list and save to local storage
function addGoalToList(description, amount) {
    const list = document.getElementById('goal-list');
    const item = document.createElement('li');
    item.textContent = `${description}: $${amount.toFixed(2)}`;
    list.appendChild(item);
    updateLocalStorageGoals();
}

// Function to save goals to local storage
function updateLocalStorageGoals() {
    const goals = Array.from(document.querySelectorAll("#goal-list li")).map(item => {
        const [description, amount] = item.textContent.split(': $');
        return {description, amount: parseFloat(amount)};
    });
    localStorage.setItem("goals", JSON.stringify(goals));
}

// Utility functions for editing and deleting expenses
function editExpense(item, amount, category, description) {
    const newAmount = prompt("Enter new amount:", amount);
    const newDescription = prompt("Enter new description:", description);
    if (newAmount && newDescription) {
        item.textContent = `${category}: $${parseFloat(newAmount).toFixed(2)} - ${newDescription}`;
        updateTotal(-amount + parseFloat(newAmount));
        updateLocalStorage();
    }
}

function deleteExpense(item, amount) {
    const list = document.getElementById('expense-list');
    list.removeChild(item);
    updateTotal(-amount);
    updateLocalStorage();
}
