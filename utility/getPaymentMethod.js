module.exports = (filter)=>{
  if(filter=="ALL"){
    return ["card","key","freetrial"]
  }
  else{
    return [filter.toLowerCase()]
  }
}
