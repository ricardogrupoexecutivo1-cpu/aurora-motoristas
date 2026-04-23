"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchKeys = [],
  filterable = true,
  exportable = true,
  pageSize = 10,
  onRowClick,
  actions,
  emptyMessage = "Nenhum registro encontrado",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter data
  const filteredData = data.filter((item) => {
    if (!search) return true;
    return searchKeys.some((key) =>
      String(item[key]).toLowerCase().includes(search.toLowerCase())
    );
  });

  // Sort data
  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {searchable && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {filterable && (
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm transition-all">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          )}
          {exportable && (
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm transition-all">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-sm font-medium text-muted-foreground ${
                    column.sortable ? "cursor-pointer hover:text-foreground" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <ArrowUpDown className={`w-4 h-4 ${sortKey === column.key ? "text-primary" : ""}`} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Acoes</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm">
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? "gradient-premium text-white"
                      : "bg-white/5 border border-white/10 hover:border-primary/50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
