export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMeta extends PaginationQuery {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPagination = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  take: limit,
});

export const createPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
