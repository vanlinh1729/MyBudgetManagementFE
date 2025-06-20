import { Component, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, LucideAngularModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit {
  featuresData = [
    {
      icon: 'wallet',
      title: 'Theo dõi chi tiêu',
      description: 'Ghi lại mọi khoản chi tiêu một cách dễ dàng và tự động phân loại theo danh mục.',
      color: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      icon: 'target',
      title: 'Lập ngân sách',
      description: 'Thiết lập ngân sách cho từng danh mục và nhận thông báo khi sắp vượt quá.',
      color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      icon: 'users',
      title: 'Chia bill nhóm',
      description: 'Chia sẻ chi phí với bạn bè và gia đình một cách công bằng và minh bạch.',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      icon: 'credit-card',
      title: 'Quản lý nợ',
      description: 'Theo dõi các khoản nợ và được nhắc nhở khi đến hạn thanh toán.',
      color: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      icon: 'chart-network',
      title: 'Báo cáo chi tiết',
      description: 'Xem báo cáo tài chính chi tiết với biểu đồ trực quan và dễ hiểu.',
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      icon: 'piggy-bank',
      title: 'Mục tiêu tiết kiệm',
      description: 'Đặt mục tiêu tiết kiệm và theo dõi tiến độ đạt được mục tiêu.',
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    {
      icon: 'smartphone',
      title: 'Đồng bộ đa thiết bị',
      description: 'Truy cập dữ liệu từ mọi thiết bị với đồng bộ hóa thời gian thực.',
      color: 'linear-gradient(135deg, #10b981, #3b82f6)'
    },
    {
      icon: 'shield-check',
      title: 'Bảo mật cao',
      description: 'Dữ liệu được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất.',
      color: 'linear-gradient(135deg, #059669, #047857)'
    },
    {
      icon: 'bell',
      title: 'Thông báo thông minh',
      description: 'Nhận thông báo về chi tiêu bất thường và nhắc nhở thanh toán.',
      color: 'linear-gradient(135deg, #f97316, #ea580c)'
    }
  ];

  stepsData = [
    {
      number: 1,
      icon: 'user-plus',
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc số điện thoại.'
    },
    {
      number: 2,
      icon: 'settings',
      title: 'Thiết lập hồ sơ',
      description: 'Cài đặt thông tin cá nhân và các danh mục chi tiêu phù hợp với bạn.'
    },
    {
      number: 3,
      icon: 'circle-plus',
      title: 'Thêm giao dịch',
      description: 'Bắt đầu ghi lại các giao dịch thu chi hàng ngày một cách đơn giản.'
    },
    {
      number: 4,
      icon: 'trending-up',
      title: 'Theo dõi & phân tích',
      description: 'Xem báo cáo chi tiết và nhận insights để cải thiện tài chính cá nhân.'
    }
  ];

  statsData = [
    {
      number: '50K+',
      label: 'Người dùng tin tưởng'
    },
    {
      number: '1M+',
      label: 'Giao dịch được xử lý'
    },
    {
      number: '4.9/5',
      label: 'Đánh giá trung bình'
    },
    {
      number: '99.9%',
      label: 'Thời gian hoạt động'
    }
  ];

  testimonialsData = [
    {
      name: 'Nguyễn Minh Anh',
      role: 'Nhân viên văn phòng',
      avatar: 'MA',
      rating: 5,
      content: 'My Budget đã giúp tôi kiểm soát chi tiêu tốt hơn rất nhiều. Giao diện đẹp, dễ sử dụng và tính năng chia bill với bạn bè rất tiện lợi!'
    },
    {
      name: 'Trần Văn Hùng',
      role: 'Sinh viên',
      avatar: 'TH',
      rating: 5,
      content: 'Là sinh viên với ngân sách hạn hẹp, ứng dụng này giúp tôi quản lý tiền bạc hiệu quả. Tính năng báo cáo rất chi tiết và dễ hiểu.'
    },
    {
      name: 'Lê Thị Hương',
      role: 'Chủ doanh nghiệp',
      avatar: 'LH',
      rating: 5,
      content: 'Tôi sử dụng My Budget để quản lý cả tài chính cá nhân và doanh nghiệp nhỏ. Rất hài lòng với tính năng đồng bộ đa thiết bị.'
    },
    {
      name: 'Phạm Đức Nam',
      role: 'Kỹ sư IT',
      avatar: 'PN',
      rating: 5,
      content: 'Ứng dụng có giao diện hiện đại, tính năng phong phú và quan trọng là bảo mật tốt. Đây là lựa chọn tốt nhất cho quản lý tài chính cá nhân.'
    }
  ];

  pricingData = [
    {
      name: 'Miễn phí',
      price: 0,
      period: '/tháng',
      popular: false,
      features: [
        'Theo dõi chi tiêu cơ bản',
        'Tối đa 3 danh mục',
        'Báo cáo hàng tháng',
        'Hỗ trợ email',
        'Đồng bộ 1 thiết bị'
      ]
    },
    {
      name: 'Pro',
      price: 99000,
      period: '/tháng',
      popular: true,
      features: [
        'Tất cả tính năng Miễn phí',
        'Không giới hạn danh mục',
        'Chia bill nhóm',
        'Quản lý nợ',
        'Báo cáo chi tiết',
        'Đồng bộ không giới hạn',
        'Hỗ trợ ưu tiên'
      ]
    },
    {
      name: 'Business',
      price: 199000,
      period: '/tháng',
      popular: false,
      features: [
        'Tất cả tính năng Pro',
        'Quản lý nhiều doanh nghiệp',
        'Báo cáo nâng cao',
        'API tích hợp',
        'Hỗ trợ 24/7',
        'Tư vấn tài chính',
        'Backup tự động'
      ]
    }
  ];


  navMenuActive = false;
  navbarScrolled = false;

  // Initialisation après le rendu de la vue
  ngAfterViewInit() {
    this.setupScrollAnimations();
    this.handleFloatingCards();
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }

  closeNavMenu() {
    if (window.innerWidth < 768) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.navbarScrolled = window.scrollY > 100;
  }

  handleFloatingCards() {
    const floatingCards = document.querySelector('.floating-cards') as HTMLElement;
    if (!floatingCards) return;

    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    floatingCards.style.display = mediaQuery.matches ? 'none' : 'block';
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });
  }

  isVideoVisible = false;
  playDemoVideoClick() {

    this.isVideoVisible = true;
  }
  hideVideo() {
    this.isVideoVisible = false;
  }

  createArray(n: number): any[] {
    return Array(n);
  }
}
