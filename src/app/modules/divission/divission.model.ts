import { model, Schema } from "mongoose";
import { IDivission } from "./divission.interface";

const divissionSchema = new Schema<IDivission>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String,  unique: true },
        thumbnail: { type: String },
        discription:  { type: String }
    },
    {
        timestamps: true
    }
);

export const Divission = model<IDivission>("Divission", divissionSchema)