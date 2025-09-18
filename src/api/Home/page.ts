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
}

export interface TopSellingItem {
  menuDetails: MenuItem;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  thisWeek: {
    quantity: number;
    revenue: number;
  };
  lastWeek: {
    quantity: number;
    revenue: number;
  };
  weekGrowth: number;
  revenuePercentage: number;
}

export interface DashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    revenue: {
      today: number;
      weekly: number;
      monthly: number;
    };
    topSellingItems: TopSellingItem[];
    topCategories: {
      category: string;
      total: number;
    }[];
  };
}

export interface OfferBanner {
  _id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BannerResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: OfferBanner[];
}

export const fetchHomeDashboard = async (range: 'today' | 'weekly' | 'monthly' = 'weekly'): Promise<DashboardResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/RevenueDashboard`, {
      params: { range },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching dashboard data"
      );
    } else {
      throw new Error("An unknown error occurred while fetching dashboard data");
    }
  }
};

export const getAllBanners = async (): Promise<BannerResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offerBanner/getAll`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching offer banners"
      );
    } else {
      throw new Error("An unknown error occurred while fetching offer banners");
    }
  }
};
