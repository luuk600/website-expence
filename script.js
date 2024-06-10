document.addEventListener('DOMContentLoaded', () => { //load this before everything
    const expenseForm = document.getElementById('expense-form'); // get expense-form
    const expenseList = document.getElementById('expense-list'); // get expense-list
    const expenseSummary = document.getElementById('expense-summary'); // get expense-summary

    let expenses = JSON.parse(localStorage.getItem('expenses')) || []; //expenses = save to local storage

    expenseForm.addEventListener('submit', (e) => { // 
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        const expense = { id: Date.now(), amount, category, description };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        displayExpenses();
        displaySummary();
        expenseForm.reset();
    });

    expenseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.parentElement.dataset.id;
            expenses = expenses.filter(expense => expense.id != id);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            displayExpenses();
            displaySummary();
        }
    });

    function displayExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.dataset.id = expense.id;
            li.innerHTML = `
                €${expense.amount} - ${expense.category} - ${expense.description}
                <button class="delete">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }

    function displaySummary() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const categories = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) acc[expense.category] = 0;
            acc[expense.category] += expense.amount;
            return acc;
        }, {});
        expenseSummary.innerHTML = `
            <h3>Total: €${total.toFixed(2)}</h3>
            ${Object.keys(categories).map(category => `<p>${category}: €${categories[category].toFixed(2)}</p>`).join('')}
        `;
    }

    displayExpenses();
    displaySummary();
});
