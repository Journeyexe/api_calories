import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_MAX_LIMIT,
} from "../config/constants.js";

export const paginate = (query, page = 1, limit = PAGINATION_DEFAULT_LIMIT) => {
  const parsedLimit = Math.min(parseInt(limit), PAGINATION_MAX_LIMIT);
  const skip = (parseInt(page) - 1) * parsedLimit;
  return query.skip(skip).limit(parsedLimit);
};

export const getPaginationMeta = async (Model, filter, page, limit) => {
  const total = await Model.countDocuments(filter);
  const parsedLimit = Math.min(parseInt(limit), PAGINATION_MAX_LIMIT);

  return {
    page: parseInt(page),
    limit: parsedLimit,
    total,
    pages: Math.ceil(total / parsedLimit),
  };
};
