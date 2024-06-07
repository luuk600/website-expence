document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const expenseSummary = document.getElementById('expense-summary');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        const expense = { id: Date.now(), amount, category, date, description };
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
        if (e.target.classList.contains('edit')) {
            const id = e.target.parentElement.dataset.id;
            const expense = expenses.find(expense => expense.id == id);
            document.getElementById('amount').value = expense.amount;
            document.getElementById('category').value = expense.category;
            document.getElementById('date').value = expense.date;
            document.getElementById('description').value = expense.description;
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
                ${expense.amount} - ${expense.category} - ${expense.date} - ${expense.description}
                <button class="edit">Edit</button>
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
            <h3>Total: $${total.toFixed(2)}</h3>
            ${Object.keys(categories).map(category => `<p>${category}: $${categories[category].toFixed(2)}</p>`).join('')}
        `;
    }

    displayExpenses();
    displaySummary();
});
