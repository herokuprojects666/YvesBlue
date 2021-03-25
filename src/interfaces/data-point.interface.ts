export interface DataPoint extends Record<string, any> {
	'Company Name': string;
	'Total Revenue': string;
	'Company Market Cap': string;
	'Women Managers': number;
	'Women Employees': number;
	'ESG Score': number;
	'CO2 Scope 1 & 2 Adjusted': string;
	'CO2 Scope 1 & 2 Revenue Adjusted': number;
	'CO2 Scope 3 Adjusted': string;
	'CO2 Scope 3 Revenue Adjusted': number;
}
