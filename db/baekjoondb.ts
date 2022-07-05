import mongoose from "mongoose";

const schema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
  },
  bojusername: {
    type: String,
    required: true,
  },
  bojpassword: {
    type: String,
    required: true,
  },
});

export default mongoose.model("baekjoondb", schema, "baekjoondb");
