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

export const fetchMenuItems = async (page: number = 1, limit: number = 10): Promise<MenuResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/getAllMenuItems`, {
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
          "An error occurred while fetching menu items"
      );
    } else {
      throw new Error("An unknown error occurred while fetching menu items");
    }
  }
};
