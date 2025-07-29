import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
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
divisionSchema.pre("save", async function(next){
    if(this.isModified("name")){
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        // eslint-disable-next-line prefer-const
        let slug = `${baseSlug}-division`;

        let counter = 1;
        let uniqueSlug = slug;
        while (await Division.exists({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter++}`;
        }

        this.slug = uniqueSlug;
    }
    next()
})
divisionSchema.pre("findOneAndUpdate", async function(next){
    const division = this.getUpdate() as Partial<IDivision>
    if(division.name){
        const baseSlug = division.name.toLowerCase().split(" ").join("-");
        // eslint-disable-next-line prefer-const
        let slug = `${baseSlug}-division`;

        let counter = 1;
        let uniqueSlug = slug;
        while (await Division.exists({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter++}`;
        }
        division.slug = uniqueSlug;
    }
    this.setUpdate(division)
    next()
})

export const Division = model<IDivision>("Division", divisionSchema)