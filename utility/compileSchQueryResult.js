module.exports = (schools, facultyInfo) => {
  return schools.map((school) => {
    //find associatedfaculty data
    const facultyData = facultyInfo.find((f, i) => {
      return f.schoolId == school.dataValues.id;
    });
    //check result
    delete school.dataValues["id"];
    if (facultyData == null) {
      return {
        ...school.dataValues,
        faculties: "0",
      };
    }
    return {
      ...school.dataValues,
      faculties: facultyData.dataValues.faculties,
    };
  });
};
