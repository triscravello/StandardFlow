// services/standardService.ts
import Standard, { IStandard } from '../models/Standard';

export interface StandardData {
    code: string;
    description: string;
    subject: string;
    gradeLevel: number;
}

export interface StandardFilter {
    subject?: string;
    gradeLevel?: number;
    code?: string;
}

export const createStandard = async (data: StandardData): Promise<IStandard> => {
    try {
        const standard = new Standard(data);
        return await standard.save();
    } catch (error) {
        throw new Error('Error creating standard: ' + error);
    }
}

export const getStandards = async (filter: StandardFilter = {}): Promise<IStandard[]> => {
    try {
        return await Standard.find(filter).lean(); // lean return plain JS objects
    } catch (error) {
        throw new Error('Error retrieving standards: ' + error);
    }
}

export const getStandardById = async (id: string): Promise<IStandard | null> => {
    try {
        const standard = await Standard.findById(id).lean();
        if (!standard) throw new Error('Standard not found');
        return standard;
    } catch (error) {
        throw new Error('Error retrieving standard by ID: ' + error);
    }
}

export const updateStandard = async (id: string, data: Partial<StandardData>): Promise<IStandard | null> => {
    try {
        const updatedStandard = await Standard.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedStandard) throw new Error('Standard not found for update');
        return updatedStandard;
    } catch (error) {
        throw new Error('Error updating standard: ' + error);
    }
}

export const deleteStandard = async (id: string): Promise<IStandard | null> => {
    try {
        const deletedStandard = await Standard.findByIdAndDelete(id).lean();
        if (!deletedStandard) throw new Error('Standard not found for deletion');
        return deletedStandard;
    } catch (error) {
        throw new Error('Error deleting standard: ' + error);
    }
}