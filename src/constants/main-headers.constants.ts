import { Header } from '../interfaces/header.interface';

export const MainHeaders = new Map<string, Header>();
MainHeaders.set('default', {
	children: [],
	displayName: '',
	hasHeatMap: false,
	name: 'default'
});
MainHeaders.set('esgScore', {
	children: ['ESGScore', 'Heatmap'],
	displayName: '',
	hasHeatMap: true,
	name: 'esgScore'
});
MainHeaders.set('firstAndSecondScope',{
	children: ['CO2 Scope 1 & 2 Adjusted', 'CO2 Scope 1 & 2 Revenue Adjusted'],
	displayName: 'co2 scope 1 & 2',
	hasHeatMap: false,
	name: 'firstAndSecondScope'
});
MainHeaders.set('thirdScope', {
	children: ['CO2Scope3Adjusted', 'CO2Scope3RevenueAdjusted'],
	displayName: 'co2 scope 3',
	hasHeatMap: false,
	name: 'thirdScope'
});
MainHeaders.set('women', {
	children: ['Women Employees', 'Women Managers'],
	displayName: 'women (per 100)',
	hasHeatMap: false,
	name: 'women'
})