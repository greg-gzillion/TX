// lib/api.ts
const API_BASE_URL = 'https://phoenix-api-756y.onrender.com/api';

export interface CreateAuctionData {
  title: string;
  description: string;
  startingPrice: number;
  metalType: string;
  weight?: number;
  purity?: number;
  endTime: string;
}

export interface Auction {
  id: number;
  title: string;
  currentBid: number;
  timeLeft: string;
  bids: number;
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  image?: string;
  description?: string;
  startingPrice?: number;
  endTime?: string;
  seller?: string;
}

export interface PriceData {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
  lastUpdated: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Price endpoints
  async getPrices(): Promise<PriceData> {
    const response = await fetch(`${API_BASE_URL}/prices`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return data.data;
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Auction endpoints
  async createAuction(auctionData: CreateAuctionData) {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(auctionData),
    });
    return response.json();
  }

  async getAuctions(filters?: { metalType?: string; status?: string }): Promise<{ success: boolean; data: Auction[] }> {
    const params = new URLSearchParams();
    if (filters?.metalType) params.append('metalType', filters.metalType);
    if (filters?.status) params.append('status', filters.status);

    const url = `${API_BASE_URL}/auctions${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAuction(id: string) {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async placeBid(auctionId: string, amount: number) {
    const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bid`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount }),
    });
    return response.json();
  }

  // Helper for mock data until auction endpoints are ready
  async getMockAuctions(): Promise<Auction[]> {
    const prices = await this.getPrices();
    
    return [
      {
        id: 1,
        title: '1oz Gold Bar - 999.9 Fine',
        currentBid: prices.gold,
        timeLeft: '2h 15m',
        bids: 12,
        metal: 'gold',
        description: 'PAMP Suisse gold bar in original assay card',
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        title: '10oz Silver Bar',
        currentBid: prices.silver * 10,
        timeLeft: '1d 3h',
        bids: 8,
        metal: 'silver',
        description: 'Engelhard silver bar, serial number visible',
        endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        title: '1oz Platinum Bar',
        currentBid: prices.platinum,
        timeLeft: '3h 45m',
        bids: 5,
        metal: 'platinum',
        description: 'Valcambi platinum bar in sealed package',
        endTime: new Date(Date.now() + 3.75 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        title: '1oz Palladium Bar',
        currentBid: prices.palladium,
        timeLeft: '4h 20m',
        bids: 3,
        metal: 'palladium',
        description: 'PAMP palladium bar with certificate',
        endTime: new Date(Date.now() + 4.33 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
}

export const api = new ApiService();