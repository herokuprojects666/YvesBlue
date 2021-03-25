import { useState } from 'react';
import { range } from 'lodash';
import { Header } from './interfaces/header.interface';
import { DataPoint } from './interfaces/data-point.interface';
import { MappedData } from './interfaces/mapped-data.interface';
import { TableData } from './interfaces/table-data.interface';
import { getData, getMainHeaders, getMappedData, getPaginatedData, getSecondaryHeaders, getTableData, sortByColumn } from './functions/app.functions';
import { AppConstants } from './constants/app.constants';
import './App.css';

function App() {
	const perPage = AppConstants.perPage;
	const [isAscending, setIsAscending] = useState(true);
	const [wasFetched, setWasFetched] = useState(false);
	const [paginatedData, setPaginatedData] = useState<DataPoint[]>([]);
	const [page, setPage] = useState(1);
	const [cleanedData, setCleanedData] = useState<MappedData>({
		cleaned: [] as DataPoint[],
		mapped: new Map<DataPoint, DataPoint>(),
		original: [] as DataPoint[]
	});
	const columnCount = AppConstants.columnNames.length;
	// Fetching local resources causes a massive amount of duplicate requests. We still get one extra request with this approach but it's better than the dozen we would get without this check
	if (!wasFetched) {
		setWasFetched(true);
		getData()
			.then((response: DataPoint[]) => {
				const sortedData = sortByColumn('Company Name', response, isAscending);
				const cleanedData = getMappedData(sortedData);
				const paginatedData = getPaginatedData(page, perPage, cleanedData.cleaned);
				setCleanedData(cleanedData)
				setPaginatedData(paginatedData);
			})
	}
  return (
  	<table>
  		<thead>
	  		<tr key={'main'}>
		  		{
		  			getMainHeaders().map((header: Header, index: number) => {
		  				let baseClass = '';
		  				// One of the dummy columns that doesn't display anything but is still needed to fill out the table
		  				if (!header.displayName) {
		  					baseClass = 'no-border '
		  				}
		  				return <td key={index} className={header.children.length ? `${baseClass}header` : `${baseClass}`} colSpan={header.children.length || 1}>{header.displayName}</td>
		  			})
		  		}
	  		</tr>
	  		<tr key={'secondary'}>
	  			{
		  			getSecondaryHeaders().map((header: Header, index: number) => {
		  				return <td key={index} onClick={
		  					() => {
			  					setIsAscending(!isAscending);
			  					const sortedData = sortByColumn(header.name, cleanedData.cleaned, !isAscending); 
			  					const paginatedData = getPaginatedData(page, perPage, sortedData);
			  					setPaginatedData(paginatedData);
		  				 	} 
		  				} className="header" colSpan={header.hasHeatMap ? 2 : 1}>{header.displayName}</td>
		  			})
	  			}
  			</tr>
  		</thead>
  		<tbody>
  		{
  			paginatedData.map((dataPoint: DataPoint, index: number) => {
  				const mappedValue = cleanedData.mapped.get(dataPoint) as DataPoint;
  				return <tr key={index}>
  					{
  						getTableData(dataPoint, mappedValue).map((tableData: TableData, index: number) => {
								if (tableData.isHeatMap) {
									return <td key={index} className="no-padding">
										<div className="heatmap" style={tableData.style}></div>
									</td>
								}
								if (index === 0) {
									return <td key={index} className="align-left">{tableData.data}</td>
								}
								return <td key={index} className="align-right">{tableData.data}</td>
							})
  					}
  				</tr>
  			})
  		}
  		<tr className="dummy-row">
	  			{
		  			range(columnCount - 1).map((index: number) => {
		  				return <td colSpan={1} key={index}></td>
		  			})
	  			}
	  			{
	  				<td colSpan={2} className="button-area">
	  					<div>
			  				<div className="page-wrapper">
				  				<button className="previous-button" onClick={
					  				() => {
				  						const previousPage = page - 1;
				  						// Can't go to a previous page of results on the first page
				  						if (previousPage === 0) {
				  							return;
				  						}
				  						setPage(previousPage);
				  						const paginatedData = getPaginatedData(previousPage, perPage, cleanedData.cleaned);
				  						setPaginatedData(paginatedData);
				  					}
				  				}>PREV</button>
				  				<div className="page">page</div>
				  				<input disabled type="text" value={page}></input>
				  				<button className="next-button" onClick={
				  					() => {
				  						const nextPage = page + 1;
				  						const paginatedData = getPaginatedData(nextPage, perPage, cleanedData.cleaned);
				  						// No more pages to page through
				  						if (paginatedData.length === 0) {
				  							return;
				  						}
				  						setPage(nextPage);
				  						setPaginatedData(paginatedData);
				  					}
			  					}>NEXT</button>
			  				</div>
	  					</div>
		  			</td>
  				}
  		</tr>
  		</tbody>
  	</table>
  );
}

export default App;
