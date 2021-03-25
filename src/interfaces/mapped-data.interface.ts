import { DataPoint } from './data-point.interface';

export interface MappedData {
	cleaned: DataPoint[];
	mapped: Map<DataPoint, DataPoint>;
	original: DataPoint[];
}
