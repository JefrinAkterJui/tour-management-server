import { Division } from "../divission/division.model";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchableFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const division = await Division.findById(payload.divisionId);
    if (!division) {
        throw new Error("Division not found.");
     }
    // const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    // const divisionSlug = division.name.toLowerCase().split("").join("")
    // let slug = `${baseSlug}-tour-${divisionSlug}`;
    
    // let counter = 1;
    // let uniqueSlug = slug;
    // while (await Tour.exists({ slug: uniqueSlug })) {
    //     uniqueSlug = `${slug}-${counter++}`;
    // }
    
    // payload.slug = uniqueSlug;

    const tour = await Tour.create(payload)

    return tour;
};


// const getAllTours = async (query: Record< string, string>) => {
//     const filtter =query
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt"
//     const fields = query.fields?.split(",").join(" ") || ""
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page-1)*limit

//     for( const field of excludeField){
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filtter[field]
//     }

//     const searshQuery = {
//         $or: tourSearchableFields.map(field => ({[field]:{$regex: searchTerm, $options: "i"} }))
//     }
//     const tours = await Tour.find(searshQuery).find(filtter).sort(sort).select(fields).skip(skip).limit(limit);
//     const totalTours = await Tour.countDocuments();

//     const totalPage = Math.ceil(totalTours/limit)
//     const meta={
//         page: page,
//         limit: limit,
//         total: totalTours,
//         totalPage: totalPage
//     }
//     return {
//         data: tours,
//         meta: meta
//     }
// };
const getAllTours = async (query: Record< string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query)
    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])
    return {
        data,
        meta
    }
};

const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};

const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
    const { name } = payload;
    if (!name) {
        throw new Error("Name is required");
    }
    const existingTourType = await TourType.findOne({ name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name });
};
const getAllTourTypes = async () => {
    return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};

export const TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    updateTour,
    deleteTour,
};