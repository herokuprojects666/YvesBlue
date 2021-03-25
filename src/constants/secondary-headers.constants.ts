import { Header } from '../interfaces/header.interface';

export const SecondaryHeaders = new Map<string, Header>();
SecondaryHeaders.set('ESG Score', {
	children: [],
	displayName: 'esg score',
	hasHeatMap: true,
	name: 'ESG Score'
});
SecondaryHeaders.set('Company Name', {
	children: [],
	displayName: 'company name',
	hasHeatMap: false,
	name: 'Company Name'
});
SecondaryHeaders.set('Total Revenue', {
	children: [],
	displayName: 'total company revenue',
	hasHeatMap: false,
	name: 'Total Revenue'
});
SecondaryHeaders.set('Company Market Cap', {
	children: [],
	displayName: 'market capitalization',
	hasHeatMap: false,
	name: 'Company Market Cap'
});
SecondaryHeaders.set('Women Managers', {
	children: [],
	displayName: 'employees',
	hasHeatMap: false,
	name: 'Women Managers',
});
SecondaryHeaders.set('Women Employees', {
	children: [],
	displayName: 'managers',
	hasHeatMap: false,
	name: 'Women Employees'
});
SecondaryHeaders.set('CO2 Scope 1 & 2 Adjusted', {
	children: [],
	displayName: 'total',
	hasHeatMap: false,
	name: 'CO2 Scope 1 & 2 Adjusted'
});
SecondaryHeaders.set('CO2 Scope 3 Adjusted', {
	children: [],
	displayName: 'total',
	hasHeatMap: false,
	name: 'CO2 Scope 3 Adjusted'
});
SecondaryHeaders.set('CO2 Scope 1 & 2 Revenue Adjusted', {
	children: [],
	displayName: 'revenue',
	hasHeatMap: false,
	name: 'CO2 Scope 1 & 2 Revenue Adjusted'
});
SecondaryHeaders.set('CO2 Scope 3 Revenue Adjusted', {
	children: [],
	displayName: 'revenue',
	hasHeatMap: false,
	name: 'CO2 Scope 3 Revenue Adjusted'
});