const Result = require('../modals/Result');
const Student = require('../modals/admissionSchema')
module.exports.getResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result =await Result.findOne({Class:req.query.Class, AdmissionNo: req.query.AdmissionNo, Term:req.query.Term});
            let student = await Student.findOne({AdmissionNo:result.AdmissionNo, Class:result.Class});
            console.log(req.query);
            if(result){
                return res.status(200).json({
                    message: "Result fetched",
                    data: {result, student}
                })
            }else{
                return res.status(404).json({
                    message:"No results found"
                })
            }
        }catch(err){
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    }else{
        return res.status(403).json({
            message:'Unautorized'
        })
    }
    
}


module.exports.addUpdateResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result = Result.findOne({AdmissionNo: req.body.AdmissionNo, Class:req.body.Class, Term:req.body.Term});
            if(result){
                console.log('deleting old record')
                await result.deleteOne();
            }
            await Result.create(req.body, function(){
                console.log('creating new record')
            });
            return res.redirect('back');
        }catch(err){
            return res.redirect('back');
        }
    }else{
        return res.render('Error_403');
    }
    
    
}

module.exports.searchResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let student = await Student.findOne({AdmissionNo:req.params.id, Class:req.query.Class});
            console.log(student);
            return res.render('search_result', {student:student, role:req.user.role});
        }catch(err){
            console.log(err);
            return res.redirect('back')
        }
    }else{
          return res.render('Error_403')  
    }
    
}

function getPercentage(marks, total){
    return marks*100/total
}


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
/*
async function updateFinalGrades(AdmissionNo, Class){
    let resultData = await Result.find({AdmissionNo:AdmissionNo, Class:Class});
    for(let i=0;i<resultData.length;i++){
        
    }
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{quarterlyGrade:"A"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{halfYearlyGrade:"B"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{finalGrade:"C"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{TotalGrade:"D"})
    console.log("printing result")
    console.log(resultData);
}
*/

module.exports.updateAllResults = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result_q = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Quarterly'});
            let result_h = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Half-Yearly'});
            let result_f = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Final'});
            console.log(result_q);
    
            await result_q.update({Hindi:+req.body.Hindi_q});
            await result_q.update({English:+req.body.English_q});
            await result_q.update({Math:+req.body.Math_q});
    
            await result_h.update({Hindi:+req.body.Hindi_h});
            await result_h.update({English:+req.body.English_h});
            await result_h.update({Math:+req.body.Math_h});
    
            await result_f.update({Hindi:+req.body.Hindi_f});
            await result_f.update({English:+req.body.English_f});
            await result_f.update({Math:+req.body.Math_f});
    
            if(req.query.Class === '6' || req.query.Class == '7' || req.query.Class == '8'){
                await result_q.update({Science:+req.body.Science_q});
                await result_q.update({Social_Science:+req.body.Social_Science_q});
                await result_q.update({Sanskrit:+req.body.Sanskrit_q});
    
                await result_h.update({Science:+req.body.Science_h});
                await result_h.update({Social_Science:+req.body.Social_Science_h});
                await result_h.update({Sanskrit:+req.body.Sanskrit_h});
    
                await result_f.update({Science:+req.body.Science_f});
                await result_f.update({Social_Science:+req.body.Social_Science_f});
                await result_f.update({Sanskrit:+req.body.Sanskrit_f});
            }
            else{
                await result_q.update({Enviornment:+req.body.Enviornment_q});
                await result_q.update({Computer:+req.body.Computer_q});
                await result_q.update({Moral:+req.body.Moral_q});
    
                await result_h.update({Enviornment:+req.body.Enviornment_h});
                await result_h.update({Computer:+req.body.Computer_h});
                await result_h.update({Moral:+req.body.Moral_h});
    
                await result_f.update({Enviornment:+req.body.Enviornment_f});
                await result_f.update({Computer:+req.body.Computer_f});
                await result_f.update({Moral:+req.body.Moral_f});
            }
            
            await result_q.save();
            //updateFinalGrades(req.params.AdmissionNo,req.query.Class);
            return res.redirect('back')
        }catch(err){
            console.log(err)
            return res.redirect('back')
            
        }
    }else{
         return res.render('Error_403')   
    }
    
}
