function getFeesDetails(){
    try {
        $.ajax({
            url :'/reports/feesReport',
            data:{
                Class: document.getElementById('classForFees').value
            },
            success: function(data){
                showFeesDetails(data.feeSummary)
            },
            error:function(err) {
                consle.log("Error fetching details")
            }
        })
    } catch(err) {
        console.log("Unable to get fees details")
    }
}
/*
function showFeesDetails(feesData) {
    let container = document.getElementById('feesdata')
    container.innerHTML=``;
    for(let i=0;i<feesData.length;i++) {
        let row = document.createElement('tr');
        let td_adm = document.createElement('td');
        td_adm.innerText = feesData[i].AdmissionNo;
        td_adm.rowSpan = feesData[i].fees.length;
        row.appendChild(td_adm)

        let td_name = document.createElement('td');
        td_name.innerText = feesData[i].FirstName + " " + feesData[i].LastName;
        td_name.rowSpan = feesData[i].fees.length;
        row.appendChild(td_name)
        
        for(let k=0;k<feesData[i].fees.length;k++) {
            row.innerHTML +=
            `
                <td>${feesData[i].fees[k].Class}</td>
                <td>${feesData[i].fees[k].total}</td>
                <td>${feesData[i].fees[k].paid}</td>
                <td>${feesData[i].fees[k].concession}</td>
                <td>${feesData[i].fees[k].remaining}</td>
            `
            
        }
        container.appendChild(row)
    }
}
    */

function showFeesDetails(feesData) {
    let container = document.getElementById('feesdata');
    container.innerHTML = ``;

    for (let i = 0; i < feesData.length; i++) {
        let student = feesData[i];
        let fees = student.fees;

        for (let k = 0; k < fees.length; k++) {
            let row = document.createElement('tr');

            if (k === 0) {
                let td_sno = document.createElement('td');
                td_sno.innerText = i+1;
                td_sno.rowSpan = fees.length;
                row.appendChild(td_sno);

                let td_adm = document.createElement('td');
                td_adm.innerText = student.AdmissionNo;
                td_adm.rowSpan = fees.length;
                row.appendChild(td_adm);

                let td_name = document.createElement('td');
                td_name.innerText = student.FirstName + " " + student.LastName;
                td_name.rowSpan = fees.length;
                row.appendChild(td_name);
            }

            // fee details
            let td_class = document.createElement('td');
            td_class.innerText = fees[k].Class;
            row.appendChild(td_class);

            let td_total = document.createElement('td');
            td_total.innerText = fees[k].total;
            row.appendChild(td_total);

            let td_paid = document.createElement('td');
            td_paid.innerText = fees[k].paid;
            row.appendChild(td_paid);

            let td_concession = document.createElement('td');
            td_concession.innerText = fees[k].concession;
            row.appendChild(td_concession);

            let td_remaining = document.createElement('td');
            td_remaining.innerText = fees[k].remaining;
            td_remaining.style.fontWeight='bold'
            row.appendChild(td_remaining);

            container.appendChild(row);
        }
    }
}

function printData(){
    let items = document.getElementsByClassName('no-print');
    for (let i=0;i< items.length;i++) {
        items[i].style.display='none'
    }
    window.print()
}