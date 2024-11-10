console.log('JS is working');

let creditScore = 50;

// Vanilla JS to handle the navbar toggling
const navbarToggler = document.getElementById("navbar-toggler");
const navbarCollapse = document.getElementById("navbarNav");

navbarToggler.addEventListener("click", function () {
    this.classList.toggle("active");
    navbarCollapse.classList.toggle("show");
});


document.addEventListener('DOMContentLoaded', function() {
    loadExpenses();
    loadGoals();
    loadBalance();
    updateScoreIndicator();
    attachEventListeners();
});

document.getElementById('credit-score-slider').addEventListener('input', function() {
    const slider = this;
    const max = slider.max;
    const min = slider.min;
    const val = slider.value;

    // Calculate percentage of the current value within the range
    const percent = ((val - min) / (max - min)) * 100;

    // Update the position of the score indicator
    const indicator = document.getElementById('score-indicator');
    indicator.style.left = percent + '%';
});

function attachEventListeners() {
    document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);
    document.getElementById('goal-form').addEventListener('submit', handleGoalSubmit);
}

function updateBalance() {
    const balanceInput = document.getElementById('current-balance'); // This should be unique
    const balanceDisplay = document.getElementById('display-balance'); // Ensure IDs are unique and correct

    const newBalance = parseFloat(balanceInput.value);
    if (!isNaN(newBalance) && newBalance >= 0) { // Check if the number is valid and non-negative
        balanceDisplay.textContent = newBalance.toFixed(2); // Update the display
    } else {
        alert("Please enter a valid balance.");
    }
}


function handleExpenseSubmit(e) {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;

    if (!isNaN(amount) && amount > 0 && description.trim() !== '') {
        const isGoodSpending = determineSpendingType(amount);
        addExpenseToList(amount, category, description);
        updateTotal(amount);
        //updateScore(isGoodSpending);
        clearForm();
        updateCreditScore()
    } else {
        alert('Please enter a valid amount and description.');
    }
}

function handleGoalSubmit(e) {
    const description = document.getElementById('goal-description').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);
    if (description && !isNaN(amount)) {
        addGoalToList(description, amount);
    } else {
        alert('Please enter a valid goal and amount.');
    }
}

function addExpenseToList(amount, category, description) {
    const list = document.getElementById('expense-list');
    const item = document.createElement('li');
    item.textContent = `${category}: $${amount.toFixed(2)} - ${description}`;
    list.appendChild(item);
    createListItemButtons(item, amount, category, description);
}

function addGoalToList(description, amount) {
    const list = document.getElementById('goal-list');
    const item = document.createElement('li');
    item.textContent = `${description}: $${amount.toFixed(2)}`;
    list.appendChild(item);
}

function createListItemButtons(item, amount, category, description) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function() { editExpense(item, amount, category, description); };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() { deleteExpense(item, amount); };

    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
  
      // Show success message
      const successMsg = document.getElementById('successMessage');
      successMsg.classList.add('showMessage');
  
      // Hide form
      document.querySelector('.the_signup_box').style.display = 'none';
  
      // Hide success message after 3 seconds
      setTimeout(() => {
        successMsg.classList.remove('showMessage');
        document.querySelector('.the_signup_box').style.display = 'block';
      }, 3000);
    });
});
  
  

function editExpense(item, amount, category, description) {
    // Editing functionality logic
}

function deleteExpense(item, amount) {
    // Deletion functionality logic
}

function updateTotal(amount) {
    const totalElement = document.getElementById('total');
    let total = parseFloat(totalElement.textContent) || 0;
    total += amount;
    totalElement.textContent = total.toFixed(2);
}

function clearForm() {
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = 'food';
    document.getElementById('expense-description').value = '';
}

function determineSpendingType(amount) {
    return amount <= 100; // Simplified logic
}

/*function updateScore(isGoodSpending) {
    creditScore += isGoodSpending ? 5 : -5;
    creditScore = Math.max(0, Math.min(creditScore, 100));
    updateScoreIndicator();
}*/

/*function updateScoreIndicator() {
    const score = creditScore; // Use the global credit score
    const indicator = document.getElementById('score-indicator');
    const maxScoreWidth = 100;
    indicator.style.width = `${(score / 100) * maxScoreWidth}%`;
    indicator.style.backgroundColor = score >= 50 ? 'green' : 'red';
}*/

async function updateCreditScore() {
    let currentCreditScore = document.querySelector("#current-score").textContent;
    //let pointsChange = 0;

    /*const category = document.getElementById('expense-category').value;
    if (category == "traveling" || category == "shopping" || category == "entertainment") {
        pointsChange = -10;
    }*/

    //let newCreditScore = parseInt(currentCreditScore) + pointsChange;
    let newCreditScore = parseInt(currentCreditScore) - 10

    if (newCreditScore < 0) {
        newCreditScore = 0
    }

    try {
        // Send new credits
        const response = await fetch('/update_credit_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newCreditScore })
        });
        
        if (response.ok) {
            console.log("Credit score updated successfully on the server.");
        } else {
            console.error("Failed to update credit score on the server.");
        }
    } catch (error) {
        console.error("Error updating credit score:", error);
    }

    console.log(newCreditScore);
    document.querySelector("#current-score").textContent = newCreditScore;
}

function loadExpenses() {
    // Load expenses from storage
}

function loadGoals() {
    // Load goals from storage
}

function loadBalance() {
    // Load balance from storage
}

