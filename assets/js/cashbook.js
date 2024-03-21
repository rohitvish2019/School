let transactions = [];

function addTransaction(type) {
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const commentInput = document.getElementById('comment');
    const monthYearInput = document.getElementById('monthYear');
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const comment = commentInput.value;
    

    if (isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
    }
    sendTransaction(amount,date,comment,type);
    
}

function sendTransaction(amount,date,comment,type){
    console.log(amount,date,comment,type);
    $.ajax({
        type:'Post',
        url:'/reports/cashbook/update',
        data:{
            amount,
            date,
            comment,
            type
        },
        success:function(data){
            transactions.push({ type, amount, date, comment});
            displayTransactions();
            updateTotals();
        },
        error:function(err){}
    })
}

function getTransactionsList(){
    $.ajax({
        type:'get',
        url:'/reports/cashbook/getTransactions',
        success:function(data){console.log(data)},
        error:function(err){console.log("Nothing")}
    })
}
function displayTransactions() {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';

    if (transactions.length === 0) {
        transactionsDiv.innerHTML = '<p>No transactions to display</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('transactions-table');

    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Type</th><th>Amount</th><th>Date</th><th>Comment</th>';

    transactions.forEach(transaction => {
        const row = table.insertRow();
        row.innerHTML = `<td>${transaction.type === 'in' ? 'Cash In' : 'Cash Out'}</td>
                         <td>₹${transaction.amount.toFixed(2)}</td>
                         <td>${transaction.date}</td>
                         <td>${transaction.comment}</td>`;
    });

    transactionsDiv.appendChild(table);
}


function filterTransactions() {
    const monthYearInput = document.getElementById('monthYear');
    const selectedMonthYear = monthYearInput.value;

    const filteredTransactions = transactions.filter(transaction => transaction.monthYear === selectedMonthYear);
    transactions = filteredTransactions;
    displayTransactions();
    updateTotals();
}

function updateTotals() {
    const totalCreditSpan = document.getElementById('totalCredit');
    const totalDebitSpan = document.getElementById('totalDebit');
    const totalBalanceSpan = document.getElementById('totalBalance');

    const totalCredit = transactions.filter(transaction => transaction.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
    const totalDebit = transactions.filter(transaction => transaction.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = totalCredit - totalDebit;

    totalCreditSpan.textContent = '₹' + totalCredit.toFixed(2);
    totalDebitSpan.textContent = '₹' + totalDebit.toFixed(2);
    totalBalanceSpan.textContent = '₹' + totalBalance.toFixed(2);
}
