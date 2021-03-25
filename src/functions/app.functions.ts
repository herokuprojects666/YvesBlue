import { ColumnSort } from '../interfaces/column-sort.interface';
import { DataPoint } from '../interfaces/data-point.interface';
import { Header } from '../interfaces/header.interface';
import { MappedData } from '../interfaces/mapped-data.interface';
import { ColumnType } from '../enums/column-type.enum';
import { AppConstants } from '../constants/app.constants';
import { MainHeaders } from '../constants/main-headers.constants';
import { SecondaryHeaders } from '../constants/secondary-headers.constants';
import { TableData } from '../interfaces/table-data.interface';
import { range } from 'lodash'

export const addMainHeader = (accumulatedHeaders: Header[], lookupKey: string, currentHeaders: Set<string>): Header[] => {
	if (!lookupKey) {
		return accumulatedHeaders;
	}
	if (!MainHeaders.has(lookupKey)) {
		return accumulatedHeaders;
	}
	// Even though it's a header at this point, get method on Maps has a union typing so we need to assert the value isn't undefined
	const mainHeader = MainHeaders.get(lookupKey) as Header;
	if (mainHeader?.displayName && currentHeaders.has(lookupKey)) {
		return accumulatedHeaders;
	}
	currentHeaders.add(lookupKey);
	return addNewHeader(accumulatedHeaders, mainHeader);
}

export const addSecondaryHeaders = (accumulatedHeaders: Header[], lookupKey: string): Header[] => {
	if (!SecondaryHeaders.has(lookupKey)) {
		return accumulatedHeaders;
	}
	// Even though it's a header at this point, get method on Maps has a union typing so we need to assert the value isn't undefined
	const secondaryHeader = SecondaryHeaders.get(lookupKey) as Header;
	return addNewHeader(accumulatedHeaders, secondaryHeader);
}

export const addNewHeader = (accumulatedHeaders: Header[], newHeader: Header): Header[] => {
	accumulatedHeaders.push(newHeader);
	return accumulatedHeaders;
}

export const getCleanedData = (columnNames: string[], originalData: DataPoint): DataPoint => {
	const columns = columnNames as [keyof DataPoint]
	return columns.reduce((modifiedData: DataPoint, columnName: keyof DataPoint) => {
		modifiedData[columnName] = getComparisonValue(columnName, originalData);
		return modifiedData;
	}, JSON.parse(JSON.stringify(originalData)));
}

export const getColumnType = (columnName: keyof DataPoint): ColumnType => {
	switch (columnName) {
		case 'Company Name':
			return ColumnType.CompanyName;
		case 'Total Revenue':
			return ColumnType.TotalRevenue;
		case 'Company Market Cap':
			return ColumnType.CompanyMarketCap
		case 'Women Managers':
			return ColumnType.WomenManagers;
		case 'Women Employees':
			return ColumnType.WomenEmployees;
		case 'ESG Score':
			return ColumnType.ESGScore;
		case 'CO2 Scope 1 & 2 Adjusted':
			return ColumnType.CO2Scope1And2Adjusted;
		case 'CO2 Scope 1 & 2 Revenue Adjusted':
			return ColumnType.CO2Scope1And2RevenueAdjusted;
		case 'CO2 Scope 3 Adjusted':
			return ColumnType.CO2Scope3Adjusted;
		case 'CO2 Scope 3 Revenue Adjusted':
			return ColumnType.CO2Scope3RevenueAdjusted;
		default:
			return ColumnType.Unknown;
	}
}

export const getComparisonValue = (columnName: keyof DataPoint, data: DataPoint): number | string => {
	const columnType = getColumnType(columnName);
	const value = data[columnName as keyof DataPoint];
	switch (columnType) {
		case ColumnType.CompanyName:
		case ColumnType.WomenManagers:
		case ColumnType.WomenEmployees:
		case ColumnType.ESGScore:
			return value;
		case ColumnType.CO2Scope1And2RevenueAdjusted:
		case ColumnType.CO2Scope3RevenueAdjusted:
		case ColumnType.TotalRevenue:
		case ColumnType.CompanyMarketCap:
		case ColumnType.CO2Scope1And2Adjusted:
		case ColumnType.CO2Scope3Adjusted:
			// All these values are of mixed string | number types. Any value greater than 1000 has commas. Any negative value is presented
			// to us in the format accounting uses to represent negative numbers (number). We need to clean all of these values since we have to be
			// able to sort these mixed data types
			if (typeof value === 'number') {
				return value;
			}
			const stringValue = value as string;
			const mainValue = stringValue
				.replace(/[$,]/g, '')
			// value is represented to us as an accounting format for negative numbers
			if (mainValue.indexOf('(') !== -1) {
				return +(mainValue.replace(/[()]/g, '')) * -1
			}
			return +mainValue
		default:
			return value
	}
}

export const getData = async () => {
	const response = await fetch('./data.json')
	const data = await response.json();
	return data as never[];
}

export const getMainHeaders = (): Header[] => {
	const currentHeaders = new Set<string>();
	const columnNames = AppConstants.columnNames;
	return columnNames.reduce((headers: Header[], columnName: string) => {
		const columnType = getColumnType(columnName);
		switch (columnType) {
			case ColumnType.CompanyName:
			case ColumnType.TotalRevenue:
			case ColumnType.CompanyMarketCap:
				return addMainHeader(headers, 'default', currentHeaders)
			case ColumnType.ESGScore:
			return addMainHeader(headers, 'esgScore', currentHeaders)
			case ColumnType.CO2Scope1And2Adjusted:
			case ColumnType.CO2Scope1And2RevenueAdjusted:
				return addMainHeader(headers, 'firstAndSecondScope', currentHeaders)
			case ColumnType.CO2Scope3Adjusted:
			case ColumnType.CO2Scope3RevenueAdjusted:
				return addMainHeader(headers, 'thirdScope', currentHeaders);
			case ColumnType.WomenManagers:
			case ColumnType.WomenEmployees:
				return addMainHeader(headers, 'women', currentHeaders)
		}
		return headers
	}, [] as Header[]);
}

export const getMappedData = (data: DataPoint[]): MappedData => {
	const mappedData = new Map<DataPoint, DataPoint>();
	const columnNames = AppConstants.columnNames;
	const modifiedData = data.map((dataPoint: DataPoint) => {
		const cleanedData = getCleanedData(columnNames, dataPoint);
		mappedData.set(cleanedData, dataPoint);
		return cleanedData
	})
	return {
		cleaned: modifiedData,
		mapped: mappedData,
		original: data
	}
}

export const getPaginatedData = (page: number, perPage: number, data: DataPoint[]) => {
	const start = (page - 1) * perPage
	if (start > data.length) {
		return [];
	}
	let end = (page ) * perPage
	if (end > data.length) {
		end = data.length - 1;
	}
	return range(start, end)
		.map((index: number) => data[index]);
}

export const getSecondaryHeaders = (): Header[] => {
	const columnNames = AppConstants.columnNames;
	return columnNames.reduce((headers: Header[], columnName: string) => {
		const columnType = getColumnType(columnName);
		switch (columnType) {
			case ColumnType.CompanyName:
				return addSecondaryHeaders(headers, 'Company Name');
			case ColumnType.TotalRevenue:
				return addSecondaryHeaders(headers, 'Total Revenue');
			case ColumnType.CompanyMarketCap:
				return addSecondaryHeaders(headers, 'Company Market Cap');
			case ColumnType.WomenManagers:
				return addSecondaryHeaders(headers, 'Women Managers');
			case ColumnType.WomenEmployees:
				return addSecondaryHeaders(headers, 'Women Employees');
			case ColumnType.CO2Scope1And2Adjusted:
				return addSecondaryHeaders(headers, 'CO2 Scope 1 & 2 Adjusted');
			case ColumnType.CO2Scope3Adjusted:
				return addSecondaryHeaders(headers, 'CO2 Scope 3 Adjusted');
			case ColumnType.CO2Scope1And2RevenueAdjusted:
				return addSecondaryHeaders(headers, 'CO2 Scope 1 & 2 Revenue Adjusted');
			case ColumnType.CO2Scope3RevenueAdjusted:
				return addSecondaryHeaders(headers, 'CO2 Scope 3 Revenue Adjusted');
			case ColumnType.ESGScore:
				return addSecondaryHeaders(headers, 'ESG Score');
		}
		return headers;
	}, [] as Header[]);
}

export const getShortenedElement = (value: string | number, precision: number): any => {
	if (typeof value === 'string') {
		return value;
	}
	return (value as number).toPrecision(precision);
}

export const getSortType = (columnName: keyof DataPoint): ColumnSort => {
	let isNumberSort = false;
	let isStringSort = false;
	const columnType = getColumnType(columnName);
	switch (columnType) {
		case ColumnType.CompanyName:
			isNumberSort = false;
			isStringSort = true;
			break;
		case ColumnType.TotalRevenue:
		case ColumnType.CompanyMarketCap:
		case ColumnType.WomenManagers:
		case ColumnType.WomenEmployees:
		case ColumnType.ESGScore:
		case ColumnType.CO2Scope1And2Adjusted:
		case ColumnType.CO2Scope1And2RevenueAdjusted:
		case ColumnType.CO2Scope3Adjusted:
		case ColumnType.CO2Scope3RevenueAdjusted:
			isNumberSort = true;
			isStringSort = false;
			break;
		// let the case of both being false be a indicator to sortByColumn that we are dealing with an unknown column
		default:
			break;
	}
	return {
		numberSort: isNumberSort,
		stringSort: isStringSort
	}
}

export const getTableData = (dataPoint: DataPoint, mappedValue: DataPoint): TableData[] => {
	return AppConstants.columnNames.reduce((tableData: TableData[], columnName: string, index: number) => {
		const dataElement = mappedValue[columnName as keyof DataPoint];
		const isHeatMapColumn = AppConstants.heatmapColumns.has(columnName);
		const mainTableData: TableData = {
			data: dataElement,
			isHeatMap: false
		}
		// In the sole case right now, ESG Score is shortened from it's actual value. If this isn't necessarily always true in the future it could be determined by storing
		// another Set of values in AppConstants that indicates which values get shortened automagically.
		if (isHeatMapColumn) {
			mainTableData.data = getShortenedElement(dataElement, 4);
		}
		tableData.push(mainTableData);
		if (isHeatMapColumn) {
			const shortenedElement = mainTableData.data as number;
			const opacity = shortenedElement / 100;
			const style = {
				opacity,
				width: `${shortenedElement}%`
			}
			const heatmapElement: TableData = {
				data: shortenedElement,
				isHeatMap: true,
				style
			}
			tableData.push(heatmapElement)
		}
		return tableData;
	}, [])
}

export const sortByColumn = (columnName: string, data: DataPoint[], isAscending: boolean): DataPoint[] => {
	const sortType = getSortType(columnName);
	// Some new column we don't know about. Since we don't know how to handle it don't do any sorting
	if (!sortType.numberSort && !sortType.stringSort) {
		return data;
	}
	if (sortType.numberSort) {
		return data.sort((a: DataPoint, b: DataPoint) => {
			const firstValue = getComparisonValue(columnName, a) as number;
			const secondValue = getComparisonValue(columnName, b) as number;
			if (isAscending) {
				return firstValue - secondValue;
			}
			return secondValue - firstValue;
		})
	}
	return data.sort((a: DataPoint, b: DataPoint) => {
		const firstValue = getComparisonValue(columnName, a) as string;
		const secondValue = getComparisonValue(columnName, b) as string;
		if (firstValue < secondValue && isAscending) {
			return -1
		}
		if (firstValue > secondValue && isAscending) {
			return 1
		}
		if (firstValue < secondValue && !isAscending) {
			return 1
		}
		if (firstValue > secondValue && !isAscending) {
			return -1
		}
		return 0
	})
}