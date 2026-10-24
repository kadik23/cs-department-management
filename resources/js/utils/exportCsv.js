/**
 * Utility to export data to CSV with full Excel compatibility.
 * Prepends UTF-8 BOM (\uFEFF) so Excel opens UTF-8 special characters cleanly.
 *
 * @param {string} filename - Filename (with or without .csv extension)
 * @param {Array<string>} headers - Array of column header strings
 * @param {Array<Array<any>>} rows - 2D array of row cells
 */
export function exportToCsv(filename, headers, rows) {
    const escapeField = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val);
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
    };

    const headerLine = headers.map(escapeField).join(',');
    const rowLines = rows.map((row) => row.map(escapeField).join(','));
    const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanFilename = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
