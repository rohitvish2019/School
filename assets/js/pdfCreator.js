console.log('PDF creator loaded')
const button = document.getElementById('download-button');
button.addEventListener('click', generatePDF);
console.log('PDF creator loaded')

// To generate the pdf of admission form
function generatePDF() {   
      
    var opt = {
        margin:       0.63,
        filename:     'myfile.pdf',
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
    let form = document.getElementById('admissionForm');
    let sub = () =>{
        form.submit();
    }
    setTimeout(sub, 100);   
    
   
}
