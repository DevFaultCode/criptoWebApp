import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CryptoExchangeService } from '../../services/crypto-exchange.service';


@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './exchange.component.html',
  styleUrl: './exchange.component.css'
})

export class ExchangeComponent implements OnInit {
  balances: { [key: string]: number } = {};
  exchangeRate: number | undefined;
  selectedFrom: string = 'BTC';
  selectedTo: string = 'ETH';
  amountToExchange: number = 0;
  amountToReceive: number = 0;
  symbolToIdMap: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    // Agrega más criptomonedas según sea necesario
  };

  isExchangeRateVisible: boolean = false;
  exchangeRateTimeout: any;

  constructor(private exchangeService: CryptoExchangeService) { }

  ngOnInit(): void {
    this.loadBalances();
    this.updateExchangeRate();
  }

  loadBalances(): void {
    this.exchangeService.getBalances().subscribe(balances => {
      this.balances = balances;
    });
  }

  updateExchangeRate(): void {
    const fromId = this.symbolToIdMap[this.selectedFrom]; // Obtener el ID de la moneda de origen  
    
    this.exchangeService.getExchangeRate(fromId, this.selectedTo.toLowerCase()).subscribe(data => {
      const fromSymbol = fromId;
      const toSymbol = this.selectedTo.toLowerCase();
      this.exchangeRate = data[fromSymbol][toSymbol];
      this.calculateAmountToReceive();
    });
  }

  calculateAmountToReceive(): void {
    if (this.exchangeRate) {
      this.amountToReceive = this.amountToExchange * this.exchangeRate;

    }
  }

  executeTrade(): void {
    // Verificar si hay saldo suficiente antes de hacer el intercambio
    if (this.selectedFrom && this.selectedTo && this.amountToExchange > 0) {
      // Comprobar si el saldo disponible es suficiente
      if (this.balances[this.selectedFrom] < this.amountToExchange) {
        alert(`Saldo insuficiente en ${this.selectedFrom}`);
        return; // Salir de la función sin ejecutar el intercambio
      }
  
      // Ejecutar el intercambio
      this.exchangeService.executeTrade(this.selectedFrom, this.selectedTo, this.amountToExchange)
        .subscribe(response => {
          console.log('Intercambio realizado con éxito', response);
  
          // Actualizar el saldo de la criptomoneda desde (selectedFrom)
          this.balances[this.selectedFrom] -= this.amountToExchange;
  
          // Actualizar el saldo de la criptomoneda destino (selectedTo)
          this.balances[this.selectedTo] += this.amountToExchange;
          console.log('Saldo actual de destino (antes):', this.balances[this.selectedTo]);
  
          if (this.balances[this.selectedTo] !== undefined) {
            this.balances[this.selectedTo] += this.amountToReceive;
          } else {
            // Si no hay balance para la moneda destino se inicializa
            this.balances[this.selectedTo] = this.amountToReceive;
          }
  
          console.log('Saldo actualizado de destino (después):', this.balances[this.selectedTo]);
  
          // Resetea los valores de intercambio
          this.amountToExchange = 0;
          this.amountToReceive = 0;
        });
    }
  }
}