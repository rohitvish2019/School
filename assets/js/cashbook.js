

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
let transactions = [];
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
            window.location.href='/reports/cashbook/home'
            
        },
        error:function(err){}
    })
}

function getTransactionsList(){
    $.ajax({
        type:'get',
        url:'/reports/cashbook/getTransactions',
        success:function(data){console.log(data);
            displayTransactions(data.data)},
        error:function(err){console.log("Nothing")}
    })
}
function displayTransactions(transactions) {
    console.log(transactions)
    const transactionsDiv = document.getElementById('transactions');
    if (transactions.length === 0) {
        transactionsDiv.innerHTML = '<p>No transactions to display</p>';
        return;
    }
    const table = document.createElement('table');
    table.classList.add('transactions-table');

    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>S.No</th><th>Date</th><th>Credit Amount</th><th>Debit Amount</th><th>Comment</th><th>Payee/Paid to</th>';
    
    let totalDebit =0
    let totalCredit = 0
    let totalBalance = 0;
    let count = 1;
    transactions.forEach(transaction => {
        const row = table.insertRow();
        let type = transaction.type
        let dateArray = String(transaction.date).split('T')[0].split('-');
        if(type == 'in'){
            totalCredit = totalCredit+transaction.amount
            row.innerHTML = `
                         <td>${count++}</td>
                         <td>${dateArray[2]}-${dateArray[1]}-${dateArray[0]}</td>
                         <td>₹${transaction.amount}</td>
                         <td>-</td>
                         <td>${transaction.comment}</td>
                         <td>${transaction.Person}</td>`;
        }else{
            totalDebit = totalDebit + transaction.amount
            row.innerHTML = `
                         <td>${count++}</td>
                         <td>${dateArray[2]}-${dateArray[1]}-${dateArray[0]}</td>
                         <td>-</td>
                         <td>₹${transaction.amount}</td>
                         <td>${transaction.comment}</td>
                         <td>${transaction.Person}</td>`;
        }

        
    });

    transactionsDiv.appendChild(table);
    updateTotals(totalCredit, totalDebit)
    
}


function filterTransactions() {
    const monthYearInput = document.getElementById('monthYear');
    const selectedMonthYear = monthYearInput.value;

    const filteredTransactions = transactions.filter(transaction => transaction.monthYear === selectedMonthYear);
    transactions = filteredTransactions;
    displayTransactions();
}

function updateTotals(totalCredit,totalDebit) {
    const totalCreditSpan = document.getElementById('totalCredit');
    const totalDebitSpan = document.getElementById('totalDebit');
    const totalBalanceSpan = document.getElementById('totalBalance');
    let totalBalance = totalCredit - totalDebit

    totalCreditSpan.textContent = '₹' + totalCredit.toFixed(2);
    totalDebitSpan.textContent = '₹' + totalDebit.toFixed(2);
    totalBalanceSpan.textContent = '₹' + totalBalance.toFixed(2);
}

getTransactionsList()
