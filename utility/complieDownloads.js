module.exports = (downloads, schools, depts, levels) => {
  return downloads.map((download) => {
    //find associated school, dept and level
    const sch = schools.find((sch) => sch.id == download.pastquestion.schoolId);
    const dept = depts.find(
      (dept) => dept.id == download.pastquestion.departmentId
    );
    const level = levels.find(
      (level) => level.id == download.pastquestion.levelId
    );
    delete sch.dataValues["id"];
    delete dept.dataValues["id"];
    delete level.dataValues["id"];
    delete download.dataValues.pastquestion.dataValues["schoolId"];
    delete download.dataValues.pastquestion.dataValues["departmentId"];
    delete download.dataValues.pastquestion.dataValues["levelId"];
    delete download.dataValues.pastquestion.dataValues["id"];
    return {
      ...download.dataValues.pastquestion.dataValues,
      ...sch.dataValues,
      ...dept.dataValues,
      ...level.dataValues,
      slug: download.slug,
    };
  });
};
