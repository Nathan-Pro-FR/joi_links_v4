import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const MediaSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    cat: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    creator: { type: String, required: true, index: true },
    dur: { type: String, required: true },
    durSec: { type: Number, required: true, index: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    fav: { type: Boolean, default: false, index: true },
    bookmark: { type: Boolean, default: false, index: true },
    url: { type: String, required: true },
    thumb: { type: String, default: "" },
    seed: { type: Number, default: 0 },
    hot: { type: Boolean, default: false },
    addedAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true }
);

export type MediaDoc = InferSchemaType<typeof MediaSchema> & { _id: string };

// Drop any cached model so dev hot-reloads pick up schema changes (e.g. new fields).
if (mongoose.models.Media) mongoose.deleteModel("Media");
export const Media = model("Media", MediaSchema);
