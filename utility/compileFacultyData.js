const faculty = require("../models/faculty");

module.exports = (faculties, deptInfo) => {
  return faculties.map((faculty) => {
    const dept = deptInfo.find((d, i) => {
      return faculty.id == d.facultyId;
    });
    delete faculty.dataValues["id"];
    if (dept == null) {
      return {
        ...faculty.dataValues,
        children: 0,
      };
    }
    return {
      ...faculty.dataValues,
      children: dept.dataValues.children,
    };
  });
};
