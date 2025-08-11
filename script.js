// Data storage
let transactions = [];

// DOM elements
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const netBalanceEl = document.getElementById('netBalance');
const ctx = document.getElementById('financeChart').getContext('2d');

// Get colors from CSS variables
const style = getComputedStyle(document.documentElement);
const incomeColor = style.getPropertyValue('--income-color');
const expenseColor = style.getPropertyValue('--expense-color');

// Initialize Chart.js
const financeChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                incomeColor,
                expenseColor
            ],
            borderColor: [
                'var(--card-bg)',
                'var(--card-bg)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: 'white',
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'var(--text-color)'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        let label = tooltipItem.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.raw.toFixed(2) + ' USD';
                        return label;
                    }
                }
            }
        }
    }
});

// Function to render transactions and update summary
const renderTransactions = () => {
    transactionList.innerHTML = ''; // Clear the list
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        const item = document.createElement('li');
        item.classList.add('transaction-item');
        item.innerHTML = `
            <span class="description">${transaction.description}</span>
            <span class="amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</span>
        `;
        transactionList.appendChild(item);

        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    // Update summary cards
    totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
    netBalanceEl.textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;

    // Update chart data
    updateChart(totalIncome, totalExpenses);
};

// Function to update the pie chart
const updateChart = (income, expenses) => {
    financeChart.data.datasets[0].data = [income, expenses];
    financeChart.update();
};

// Handle form submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description.trim() === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const newTransaction = {
        description,
        amount,
        type,
        id: Date.now()
    };

    transactions.push(newTransaction);
    renderTransactions();
    transactionForm.reset();
});

// Initial render
renderTransactions();
