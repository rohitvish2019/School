const Result = require('../modals/Result');
const Student = require('../modals/admissionSchema')
module.exports.getResult = async function(req, res){
    try{
        let result =await Result.findOne({Class:req.query.Class, AdmissionNo: req.query.AdmissionNo});
        let student = await Student.findOne({AdmissionNo:req.query.AdmissionNo});
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
}


module.exports.addUpdateResult = async function(req, res){
    try{
        let result = Result.findOne({AdmissionNo: req.body.AdmissionNo, Class:req.body.Class});
        if(result){
            await result.deleteOne();
        }
        await Result.create(req.body);
        return res.redirect('back');
    }catch(err){
        return res.redirect('back');
    }
}

module.exports.searchResult = async function(req, res){
    try{
        let student = await Student.findOne({AdmissionNo:req.params.id});
        return res.render('search_result', {student:student});
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
