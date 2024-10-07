import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoExchangeService {
  private apiUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) { }
  
  // funcion para obtener precios de una cripto con respecto a otra
  getExchangeRate(from: string, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/simple/price?ids=${from}&vs_currencies=${to}`);
  }

  // Simulador de balances
  getBalances(): Observable<{ [key: string]: number }> {
    return new Observable(observer => {
      observer.next({ BTC: 0.0080, ETH: 0.21, USDT: 400, BNB: 0.071, SOL: 0.28});
      observer.complete();
    });
  }

  // Simulador de transaccion
  executeTrade(from: string, to: string, amount: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }
}