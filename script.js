document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const expenseSummary = document.getElementById('expense-summary');
    const incomeForm = document.getElementById('income-form');
    const incomeList = document.getElementById('income-list');
    const incomeSummary = document.getElementById('income-summary');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];

    expenseForm.addEventListener('submit', (e) => {
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

    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount2 = parseFloat(document.getElementById('amount2').value);
        const category2 = document.getElementById('category2').value;
        const description2 = document.getElementById('description2').value;

        const income = { id: Date.now(), amount: amount2, category: category2, description: description2 };
        incomes.push(income);
        localStorage.setItem('incomes', JSON.stringify(incomes));

        displayIncome();
        displaySummaryIncome();
        incomeForm.reset();
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

    incomeList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.parentElement.dataset.id;
            incomes = incomes.filter(income => income.id != id);
            localStorage.setItem('incomes', JSON.stringify(incomes));
            displayIncome();
            displaySummaryIncome();
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

    function displayIncome() {
        incomeList.innerHTML = '';
        incomes.forEach(income => {
            const li = document.createElement('li');
            li.dataset.id = income.id;
            li.innerHTML = `
                €${income.amount} - ${income.category} - ${income.description}
                <button class="delete">Delete</button>
            `;
            incomeList.appendChild(li);
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

    function displaySummaryIncome() {
        const total2 = incomes.reduce((sum, income) => sum + income.amount, 0);
        const categories2 = incomes.reduce((acc2, income) => {
            if (!acc2[income.category]) acc2[income.category] = 0;
            acc2[income.category] += income.amount;
            return acc2;
        }, {});
        incomeSummary.innerHTML = `
            <h3>Total: €${total2.toFixed(2)}</h3>
            ${Object.keys(categories2).map(category => `<p>${category}: €${categories2[category].toFixed(2)}</p>`).join('')}
        `;
    }

    displayExpenses();
    displaySummary();
    displayIncome();
    displaySummaryIncome();
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const incomeMinusExpenses = totalIncome - totalExpenses;

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `€${incomeMinusExpenses.toFixed(2)}`;

});