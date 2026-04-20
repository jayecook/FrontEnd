import React from "react";

function SearchFilters({ filters, onChange, onSearch, onClear, onBack }) {
  return (
    <form className="form" onSubmit={onSearch}>
      <input
        name="productId"
        placeholder="Product ID"
        value={filters.productId}
        onChange={onChange}
      />
      <input
        name="productType"
        placeholder="Product Type"
        value={filters.productType}
        onChange={onChange}
      />
      <input
        name="productAmount"
        placeholder="Product Amount"
        value={filters.productAmount}
        onChange={onChange}
      />
      <input
        name="productCount"
        placeholder="Product Count"
        value={filters.productCount}
        onChange={onChange}
      />
      <div className="button-row">
        <button type="submit">Search</button>
        <button type="button" onClick={onClear}>Clear Filters</button>
        <button type="button" onClick={onBack}>Back</button>
      </div>
    </form>
  );
}

export default SearchFilters;
