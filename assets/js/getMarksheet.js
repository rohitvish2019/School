function calculateGrade(value){
    if(value > 100){
        return "Invalid"
    }
    if(value <= -1){
        return 'NA'
    }else if( value <= 100 && value > 90){
        return 'A+'
    }else if(value <= 90 && value > 74){
        return 'A'
    }else if( value <= 75 && value > 59){
        return 'B'
    }else if(value <= 60 && value > 44){
        return 'C'
    }else if(value <= 45 && value > 33){
        return 'D'
    }else{
        return 'F'
    }
}

function setFinalGrade(){
    let grade = document.getElementById('finalGrade').innerText;
    let percent = Number(document.getElementById('percent').innerText)
    if(grade == 'Invalid'){
        grade = null
    }
    $.ajax({
        url:'/result/updateFinalGradeM',
        type:'POST',
        data:{
            grade,
            percent,
            AdmissionNo:document.getElementById('admno').innerText
        }
    })
    console.log(document.getElementById('finalGrade').innerText)
}

setFinalGrade()