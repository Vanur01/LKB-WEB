import axios from "axios";

const API_BASE_URL = "https://api.orderfood.coffee/api/v1";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MenuResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    counts: {
      vegetarian: number;
      nonVegetarian: number;
      unavailable: number;
    };
    menus: MenuItem[];
  };
}

export interface CategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    page: number;
    pages: number;
    limit: number;
    categories: Category[];
  };
}

export interface MenuFilters {
  page?: number;
  limit?: number;
  isAvailable?: boolean;
  isVeg?: boolean;
  categoryName?: string;
}

export const fetchMenuItems = async (filters: MenuFilters = {}): Promise<MenuResponse> => {
  try {
    const {
      page = 1,
      limit = 10,
      isAvailable,
      isVeg,
      categoryName
    } = filters;

    const params: any = {
      page,
      limit,
    };

    // Only add optional filters if they are explicitly set
    if (isAvailable !== undefined) {
      params.isAvailable = isAvailable;
    }
    if (isVeg !== undefined) {
      params.isVeg = isVeg;
    }
    if (categoryName && categoryName !== "All") {
      params.categoryName = categoryName;
    }

    const response = await axios.get(`${API_BASE_URL}/menu/getAllMenuItems`, {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching menu items"
      );
    } else {
      throw new Error("An unknown error occurred while fetching menu items");
    }
  }
};

export const fetchCategories = async (page: number = 1, limit: number = 90): Promise<CategoryResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/getAllCategory`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching categories"
      );
    } else {
      throw new Error("An unknown error occurred while fetching categories");
    }
  }
};
