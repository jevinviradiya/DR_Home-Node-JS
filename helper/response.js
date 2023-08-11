const errorResponse = (res, msg) => {
    res.status(400).send({
      status: false,
      message: msg,
    });
  };
  
  const sendResponse = (res, msg, data, restData) => {
    res.status(200).send({
      status: true,
      message: msg,
      data: data,
      ...restData
    });
  };
  
  const createResponse = (res, msg, data) => {
    res.status(201).send({
        status: true,
        message: msg,
        data: data
    })
  }

  const notFoundResponse = (res, msg) => {
    res.status(404).send({
        status: false,
        message: msg,
    })
  }

  const serverErrResponse = (res, msg) => {
    res.status(500).send({
        status: false,
        message: msg,
    })
  }

  module.exports = {errorResponse, sendResponse, createResponse, notFoundResponse, serverErrResponse};