import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError,switchMap, tap } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { coinInterface } from "../../coin.interface";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  api: string = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
  coins: coinInterface[] = []
  staticAmounts: number[] = [0.0080, 0.21, 400, 0.071, 0.28];
  amountsToDolars: number[] = []
  titles: string[] = ['#', 'Coin', 'Price', 'Price Change', '24H Volume'];
  searchText: string = '';
  filteredCoints: coinInterface[] = [];
  holdCoins: coinInterface[] = [];
  sortField: string = '';
  sortDirection: boolean = true;

  private http = inject(HttpClient)

  ngOnInit(): void {

    this.fetchCoins();

    interval(30000).pipe(
      switchMap(() => this.http.get<coinInterface[]>(this.api)), // Cambiar a la API
      tap((res) => {
        this.coins = res.slice(0, 5); // Obtener solo las primeras 5 monedas
        this.filteredCoints = [...this.coins]; // Mostrar todas las monedas
      }),
      catchError((err) => {
        console.error('Error al obtener los datos', err);
        return of([]); // Manejo de errores
      })
    ).subscribe();
  }

  private fetchCoins(): void {
    this.http.get<coinInterface[]>(this.api).pipe(
      tap((res) => {
        this.coins = res.slice(0, 5); // Obtener solo las primeras 5 monedas
        this.filteredCoints = [...this.coins]; // Mostrar todas las monedas
        this.holdCoins = [...this.coins];

        for (let index = 0; index < this.staticAmounts.length; index++) {

          const element = this.staticAmounts[index];
          const result = element * this.holdCoins[index].current_price || 0;
          this.amountsToDolars.push(result);
        }
      }),
      catchError((err) => {
        console.error('Error al obtener los datos', err);
        return of([]); // Manejo de errores
      })
    ).subscribe();
  }

  searchCoin() {
    this.filteredCoints = this.coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(this.searchText.toLowerCase())
    ).slice(0, 5);
  }

  sortCoins(field: string = this.sortField) {
    this.sortField = field;
    this.filteredCoints.sort((a, b) => {
      let comparison = 0;

      if (a[field] < b[field]) {
        comparison = -1;
      } else if (a[field] > b[field]) {
        comparison = 1;
      }

      return this.sortDirection ? comparison : comparison * -1;
    }).slice(0, 5);

    // Cambiar la dirección de ordenación
    this.sortDirection = !this.sortDirection;
  }
}
