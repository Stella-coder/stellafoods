const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    meal: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    order: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    cloud_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("foodApi", schema);
