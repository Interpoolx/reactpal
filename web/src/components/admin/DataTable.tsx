import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    RowSelectionState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Trash2, Edit, Plus, Inbox } from 'lucide-react';

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    onAdd?: () => void;
    onEdit?: (row: TData) => void;
    onDelete?: (rows: TData[]) => void;
    isLoading?: boolean;
}

// Skeleton row component for loading state
function SkeletonRow({ columns }: { columns: number }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </td>
            ))}
        </tr>
    );
}

export function DataTable<TData>({
    data,
    columns,
    onAdd,
    onEdit,
    onDelete,
    isLoading = false,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Check if columns already have an actions/quickActions column
    const hasCustomActions = columns.some(col =>
        col.id === 'actions' || col.id === 'quickActions'
    );

    const allColumns: ColumnDef<TData, any>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    className="rounded border-gray-600 bg-dark text-brand-primary focus:ring-brand-primary"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="rounded border-gray-600 bg-dark text-brand-primary focus:ring-brand-primary"
                />
            ),
            size: 40,
        },
        ...columns,
        // Only add default actions column if no custom actions exist
        ...(!hasCustomActions && onEdit ? [{
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: any }) => (
                <button
                    onClick={() => onEdit?.(row.original)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-primary transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>
            ),
            size: 60,
        }] : []) as ColumnDef<TData, any>[],
    ];

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows.map(r => r.original);

    return (
        <div className="bg-darker rounded-2xl border border-border-muted overflow-visible">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border-muted">
                <div className="flex items-center gap-2">
                    {selectedRows.length > 0 && onDelete && (
                        <button
                            onClick={() => onDelete(selectedRows)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete ({selectedRows.length})
                        </button>
                    )}
                </div>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add New
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full">
                    <thead className="bg-dark/50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <button
                                                className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-primary' : ''}`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    header.column.getIsSorted() === 'asc' ? (
                                                        <ChevronUp className="w-3 h-3" />
                                                    ) : header.column.getIsSorted() === 'desc' ? (
                                                        <ChevronDown className="w-3 h-3" />
                                                    ) : (
                                                        <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                    )
                                                )}
                                            </button>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border-muted">
                        {isLoading ? (
                            // Skeleton loading rows
                            <>
                                <SkeletonRow columns={allColumns.length} />
                                <SkeletonRow columns={allColumns.length} />
                                <SkeletonRow columns={allColumns.length} />
                                <SkeletonRow columns={allColumns.length} />
                                <SkeletonRow columns={allColumns.length} />
                            </>
                        ) : table.getRowModel().rows.length === 0 ? (
                            // Empty state
                            <tr>
                                <td colSpan={allColumns.length} className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                            <Inbox className="w-6 h-6 text-muted" />
                                        </div>
                                        <div>
                                            <p className="text-muted font-medium">No data available</p>
                                            <p className="text-xs text-muted/70">Try adjusting your filters or add new items</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border-muted">
                <div className="text-sm text-muted">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-2 rounded-lg border border-border-muted hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-2 rounded-lg border border-border-muted hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
