const mongoose = require("mongoose");

const miniToolSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    iframeSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    iframeHtml: {
      type: String,
    },
    reactAppUrl: {
      type: String,
      trim: true,
    },
    reactAppZipPath: {
      type: String,
      trim: true,
    },
    appType: {
      type: String,
      enum: ['html', 'react'],
      default: 'html',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

miniToolSchema.index({ id: 1 });
miniToolSchema.index({ iframeSlug: 1 });


// Ensure virtuals are included in JSON output
miniToolSchema.set('toJSON', { virtuals: true });
miniToolSchema.set('toObject', { virtuals: true });

const MiniToolDB = mongoose.model("MiniTool", miniToolSchema);

module.exports = MiniToolDB;

