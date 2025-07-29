/* eslint-disable prefer-const */
import { Division } from "../divission/division.model";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }
    const division = await Division.findById(payload.divisionId);
    if (!division) {
        throw new Error("Division not found.");
     }
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    const divisionSlug = division.name.toLowerCase().split("").join("")
    let slug = `${baseSlug}-tour-${divisionSlug}`;
    
    let counter = 1;
    let uniqueSlug = slug;
    while (await Tour.exists({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter++}`;
    }
    
    payload.slug = uniqueSlug;

    const tour = await Tour.create(payload)

    return tour;
};


const getAllTours = async () => {
    const tours = await Tour.find({});
    const totalTours = await Tour.countDocuments();
    return {
        data: tours,
        meta: {
            total: totalTours
        }
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