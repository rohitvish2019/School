function creatPDFFromText(){
    console.log('creating pdf');
    window.jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var doc = new jsPDF();
	
    doc.text(20, 20, 'Shree Veer Vidya Niketan Shala Shahpur');
    doc.text(20, 25, 'Admission Form');
    doc.text(20, 30, 'Admission No:'+'')
    doc.text(20, 35, 'abc')
    /*
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    doc.text()
    */
    
    // Add new page
    doc.addPage();
    doc.text(20, 20, 'Visit CodexWorld.com');

    // Save the PDF
    doc.save('document.pdf');
}
//Not working, Need to fix
function createPDFFromHTML(){
    
    document.getElementById('pdf').onclick = function () {
        // Your html2pdf code here.
        var element = document.getElementById('adm-form');
        html2pdf(element);
    };
    
}

document.getElementById('pdf').addEventListener('click', function(event){creatPDFFromText()})