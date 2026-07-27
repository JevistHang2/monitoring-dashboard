import mongoose, { Schema } from "mongoose";

export type TemperatureReading = {
  created_at: Date;
  value: number;
};

const temperatureReadingSchema = new Schema<TemperatureReading>(
  {
    created_at: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

temperatureReadingSchema.index({ created_at: 1 });

export const TemperatureReadingModel = mongoose.model<TemperatureReading>(
  "TemperatureReading",
  temperatureReadingSchema,
);
