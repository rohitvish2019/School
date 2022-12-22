
function getFeeDetails(){
    document.getElementById('search').addEventListener('click', function(event){
        console.log(event.target.id + "is hit");
        $.ajax({
            type:'GET',
            url:'/student/get/'+document.getElementById('adm_no').value,
            success: function(data){showOnDOM(data.data[0])},
            error: function(data){showOnDOM(data.data)}
        })
    });
}
getFeeDetails();

function showOnDOM(student){
    console.log(student);
    if(student == null){
        console.log('student is null');
        document.getElementById('record').innerHTML=
    `
    <td>Record not found</td>
    
    `
    }else{
        document.getElementById('record').innerHTML=
        
    `   
    <div class='d-flex justify-content-between'>
        <div style='width:12%'>
            <h6><u>Admission No</u></h6>
            <h5>${student.AdmissionNo}</h5>
        </div>
        <div style='width:12%'>
            <h6><u>Name</u></h6>
            <h5>${student.FirstName} ${student.LastName}</h5>
        </div>
        <div style='width:12%'>
            <h6><u>Class</u></h6>
            <h5>${student.Class}</h5>
        </div>
    </div>
    
    <div class='d-flex justify-content-between'>
        <div style='width:12%'>
            <h6><u>Father's Name</u></h6>
            <h5>${student.FathersName}</h5>
        </div>
        <div style='width:12%'>
            <h6><u>Mother's Name</u></h6>
            <h5>${student.MothersName}</h5>
        </div>
        <div style='width:12%'>
            <h6><u>Aadhar</u></h6>
            <h5>${student.AadharNumber}</h5>
        </div>
    </div>   
    <div class='d-flex justify-content-around my-3'>
        <div>
            <a  class='btn btn-primary' id='full-${student._id}'>Full Details</a>
            <a href='/fee/getFee/${student._id}' class='btn btn-primary' id='fee-${student.AdmissionNo}'>Fee info</a>
        </div>
    </div>   
    `
    }
}