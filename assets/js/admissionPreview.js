function renderPreview(){
    let data = $('#admissionForm').serialize().split('&');
    let result = new Object();
    for(let i=0;i<data.length;i++){
        let res = data[i].split('=');
        let a= res[0];
        let b = res[1];
        result[a] = b;
        console.log('count is '+1)
    }
    $.ajax({
        url:'/admissions/getPreview',
        method: 'POST',
        data:result,
        success: function(data){
            console.log(data);
            document.getElementById('main').innerHTML=data;
        }
    })
    console.log(result);
}

document.getElementById('preview').addEventListener('click', function(event){renderPreview()})