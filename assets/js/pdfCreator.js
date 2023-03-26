console.log('PDF creator loaded')
const button = document.getElementById('download-button');
button.addEventListener('click', generatePDFAdmissionForm);


// To generate the pdf of admission form
function generatePDFAdmissionForm() {   
    new Noty({
        theme: 'relax',
        text: 'Admission form is downloading',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show();
    let firstname = document.getElementById('fname').value;
    let lastname = document.getElementById('lname').value;
    let admissionno = document.getElementById('admno').value;
    var opt = {
        margin:       0.63,
        filename:     firstname+'_'+lastname+'_'+admissionno,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    // Choose the element that your content will be rendered to.
    console.log('creating pdf');
    let element = document.getElementById('toPDF');
    // Choose the element and save the PDF for your user.
    html2pdf(element, opt);
    console.log(element);
    html2pdf().set(opt).from(element).save();
    
}


function generatePDFMarksheet() {   
    let firstname = document.getElementById('fname').value;
    let lastname = document.getElementById('lname').value;
    let admissionno = document.getElementById('admno').value;
    var opt = {
        margin:       0.63,
        filename:     firstname+'_'+lastname+'_'+admissionno+'marksheet',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    // Choose the element that your content will be rendered to.
    console.log('creating pdf');
    let element = document.getElementById('toPDF');
    // Choose the element and save the PDF for your user.
    html2pdf(element, opt);
    console.log(element);
    html2pdf().set(opt).from(element).save();
}