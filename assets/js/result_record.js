
function getResult(){
    $.ajax({
        url:'/result/get',
        type:'GET',
        data:{
            AdmissionNo: document.getElementById('AdmissionNo_result').value,
            Class: document.getElementById('class_result').value
        },
        success:function(data){showResult(data.data.result, data.data.student)} ,
        error: showZeroResult()
    })
}

function showResult(result, student){
    console.log("show result");
    console.log(result);
    document.getElementById('search_record').innerHTML=
    `
        <form action='/result/update' method='POST' id='marks-form' class="d-flex container justify-content-between my-4" style="flex-direction:column;">
            
            <input type='text' hidden name='AdmissionNo' value='${student.AdmissionNo}'>
            <input type='text' hidden name='Class' value='${student.Class}'>
            <div>
                <h6>Hindi : </h6>
                <h4><input name='Hindi' type="text" value=${result.Hindi}></h4>
            </div>
            <div>
                <h6>English : </h6>
                <h4><input name='English' type="text" value=${result.English}></h4>
            </div>
            <div>
                <h6>Math : </h6>
                <h4><input name='Math' type="text" value=${result.Math}></h4>
            </div>
        </form>
    `
    let val = 75;
    let otherSubjects = [];
    if(result.Class == '6' || result.Class == '7' || result.Class=='8'){
        otherSubjects = ['Science', 'Social_Science', 'Sanskrit']
    }else{
        otherSubjects =['Moral', 'Computer', 'Environment' ]
    }

    for(let i=0;i<otherSubjects.length;i++){
        let element = document.createElement('div');
        element.innerHTML=
        `
        <h6>${otherSubjects[i]}</h6>
        <h4><input name=${otherSubjects[i]} type="text" value=${result[otherSubjects[i]]}></h4>
        `
        document.getElementById('marks-form').appendChild(element);
    }

    let element = document.createElement('div');
    element.innerHTML=
    `
    <input type="submit" value="Update">    
    `
    document.getElementById('marks-form').appendChild(element);
}

/*
<div>
                
            </div>
            <div>
                <h6>Science : </h6>
                <h4><input type="text" value="78"></h4>
            </div>
            <div>
                <h6>Science : </h6>
                <h4><input type="text" value="78"></h4>
            </div>

*/
function showZeroResult(){

}
document.getElementById('search_result').addEventListener('click', getResult)