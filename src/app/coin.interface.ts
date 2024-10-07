export interface coinInterface {
    id: string;
    market_cap_rank: number;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    [key: string]: any;
}