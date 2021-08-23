exports.extractSchIds = (data) => {
  return data.map((download) => {
    return download.pastquestion.schoolId;
  });
};
exports.extractDeptIds = (data) => {
  return data.map((download) => download.pastquestion.departmentId);
};
exports.extractLevelIds = (data) => {
  return data.map((download) => download.pastquestion.levelId);
};
