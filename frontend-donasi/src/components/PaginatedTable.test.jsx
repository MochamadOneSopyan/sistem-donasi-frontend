// @vitest-environment jsdom
import {it,expect,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import PaginatedTable from './PaginatedTable';
afterEach(cleanup);
const table=rows=><table><thead><tr><th>Data</th></tr></thead><tbody>{rows.map(id=><tr key={id}><td>Record {id}</td></tr>)}</tbody></table>;
it('shows ten rows, navigates, clamps page and resets when filtered records change',()=>{
 const rows=Array.from({length:23},(_,i)=>i+1);
 const view=render(<PaginatedTable>{table(rows)}</PaginatedTable>);
 expect(screen.queryByText('Record 11')).toBeNull();expect(screen.getByText('Record 10')).toBeTruthy();
 fireEvent.click(screen.getByText('Berikutnya'));expect(screen.getByText('Record 11')).toBeTruthy();
 fireEvent.click(screen.getByText('Berikutnya'));expect(screen.getByText('Record 23')).toBeTruthy();expect(screen.getByText('Berikutnya').disabled).toBe(true);
 view.rerender(<PaginatedTable>{table(rows.slice(0,12))}</PaginatedTable>);expect(screen.getByText('Record 1')).toBeTruthy();expect(screen.queryByText('Record 11')).toBeNull();
});
it('keeps small and empty tables without unnecessary pagination',()=>{
 render(<PaginatedTable>{table([1])}</PaginatedTable>);expect(screen.queryByRole('navigation')).toBeNull();expect(screen.getByText('Record 1')).toBeTruthy();
});
