const AppError = require("../util/AppError");
const catchAsync = require("../util/catcAsync");
const APIFeatures = require("../util/ApiFeature");
const Hotel = require("../models/Hotel.model");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (doc == null)
      return next(new AppError("No Document Found With this id", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidtor: true,
    });

    if (doc == null)
      return next(new AppError("No Document Found With this id", 404));

    res.status(200).json({
      status: "success",
      data: {
        document: doc,
      },
    });
  });
};

exports.getOne = (Model, populateOption) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOption) query.populate(populateOption);
    const document = await query;

    if (document == null)
      return next(new AppError("No document Found With this id", 404));

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        document,
      },
    });
  });
};

exports.getAll = (Model) => {
  
  return catchAsync(async (req, res) => {
    // console.log("hellpo");
    // let filtter = {};
    // if (req.params.id) filtter = { hotel: req.params.hotelId };
    // if (req.params.id) filtter = { restaurant: req.params.restaurantId };
    // if (req.params.id) filtter = { attraction: req.params.attractionId };

    const faetures = new APIFeatures(Model.find(), req.query)
      .filtter()
      .sorting()
      .limiting()
      .pagination();

    const docuemnts = await faetures.query;

    //send response
    res.status(200).json({
      status: "success",
      data: {
        docuemnts,
      },
    });
  });
};
