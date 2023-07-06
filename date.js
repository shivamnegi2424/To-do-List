module.exports=getDate;

function getDate(){
var date = new Date();

    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    var day=date.toLocaleDateString("hi-IN",options);
    return day;
}