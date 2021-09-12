exports.extractUserRefs = (data) => {
  return data.map((request) => {
    return request.requestedBy;
  });
};
exports.compileRequestResult = (requests, testimonies) => {
  return requests.map((request) => {
    //find associated testimony
    const testimony = testimonies.find(
      (testimony) => testimony.user == request.requestedBy
    );
    if (testimony == null) {
      return {
        ...request.dataValues,
        videoLink: null,
      };
    } else {
      return {
        ...request.dataValues,
        videoLink: testimony.videoLink,
      };
    }
  });
};
