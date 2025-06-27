import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="flex flex-col h-full bg-white">
      <div class="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-[#e7edf3]">
        <button routerLink="/debt" class="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors">
          <i-lucide name="arrow-left" class="w-5 h-5 text-[#4e7397]"></i-lucide>
        </button>
        <div>
          <h1 class="text-[#0e141b] text-xl md:text-2xl font-bold">Lịch sử thanh toán</h1>
          <p class="text-[#4e7397] text-sm">Chi tiết các lần thanh toán</p>
        </div>
      </div>
      
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i-lucide name="construction" class="w-16 h-16 text-[#4e7397] mx-auto mb-4"></i-lucide>
          <h3 class="text-lg font-medium text-[#0e141b] mb-2">Đang phát triển</h3>
          <p class="text-[#4e7397]">Tính năng này sẽ sớm được hoàn thành</p>
        </div>
      </div>
    </div>
  `
})
export class PaymentHistoryComponent {} 