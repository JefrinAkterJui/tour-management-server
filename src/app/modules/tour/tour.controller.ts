import { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { TourService } from './tour.service';
import { catchsync } from '../../utils/catchAsync';
import { ITour } from './tour.interface';

const createTour = catchsync(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    }
    const result = await TourService.createTour(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
});

const getAllTours = catchsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await TourService.getAllTours(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const getSingleTour = catchsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await TourService.getSingleTour(slug);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
    });
});

const updateTour = catchsync(async (req: Request, res: Response) => {

    const result = await TourService.updateTour(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
});

const deleteTour = catchsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourService.deleteTour(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
});
const getAllTourTypes = catchsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});


const createTourType = catchsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await TourService.createTourType({name});
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});

const updateTourType = catchsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await TourService.updateTourType(id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});
const deleteTourType = catchsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});

export const TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    deleteTourType,
    updateTourType,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};