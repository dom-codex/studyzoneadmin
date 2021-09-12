module.exports = (filter)=>{
  console.log(filter)
  if(filter=="ALL"){
    return ["card","key","freetrial"]
  }
  else{
    return [filter.toLowerCase()]
  }
}
