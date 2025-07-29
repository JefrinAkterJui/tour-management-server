import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
    {
        name: { type: String, required: true, unique: true }
    }, 
    {
        timestamps: true
    }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema)

const tourSchema = new Schema<ITour>(
    {
        title: { type: String, required: true },
        slug: { type: String,  unique: true },
        description: { type: String },
        images: { type: [String], default: [] },
        location: { type: String },
        costFrom: { type: Number },
        startDate: { type: Date },
        endDate: { type: Date },
        included: { type: [String], default: [] },
        excluded: { type: [String], default: [] },
        amenities: { type: [String], default: [] },
        tourPlan: { type: [String], default: [] },
        maxGuest: { type: Number },
        minAge: { type: Number },
        divisionId: {
            type: Schema.Types.ObjectId,
            ref: "Division",
            required: true
        },
        tourType: {
            type: Schema.Types.ObjectId,
            ref: "TourType",
            required: true
        }
    }, 
    {
        timestamps: true
    }
);

tourSchema.pre("save", async function(next){
    if(this.isModified("title")){
        const baseSlug = this.title.toLowerCase().split(" ").join("-");
        // eslint-disable-next-line prefer-const
        let slug = `${baseSlug}`;

        let counter = 1;
        let uniqueSlug = slug;
        while (await Tour.exists({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter++}`;
        }

        this.slug = uniqueSlug;
    }
    next()
})
tourSchema.pre("findOneAndUpdate", async function(next){
    const tour = this.getUpdate() as Partial<ITour>
    if(tour.title){
        const baseSlug = tour.title.toLowerCase().split(" ").join("-");
        // eslint-disable-next-line prefer-const
        let slug = `${baseSlug}`;

        let counter = 0;
        let uniqueSlug = slug;
        while (await Tour.exists({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter++}`;
        }
        tour.slug = uniqueSlug;
    }
    this.setUpdate(tour)
    next()
})

export const Tour = model<ITour>("Tour", tourSchema);