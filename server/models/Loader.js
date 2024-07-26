const mongoose = require('mongoose')

const loaderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nationalId: { type: String, required: true },
    nationalIdFront: { type: String, required: true },
    nationalIdBack: { type: String, required: true },
    drivingLicense: { type: String, default: null },
    nationalIdCopy: { type: String, default: null },
  },
  { timestamps: true }
);

const Loader = mongoose.model("Loader", loaderSchema);
module.exports = Loader;
