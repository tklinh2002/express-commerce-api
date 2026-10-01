import crypto from 'crypto';
import qs from 'qs';

export class VnPayService {
  // Bạn có thể đăng ký tài khoản Sandbox trên VNPay để lấy mã thật. Tạm thời mình để mặc định.
  private tmnCode = process.env.VNPAY_TMNCODE || 'TEST_TMNCODE';
  private secretKey = process.env.VNPAY_HASHSECRET || 'TEST_SECRETKEY_VERY_LONG_STRING';
  private vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/orders/vnpay/return';

  // 1. CREATE PAYMENT URL (Send to client to redirect to VNPay)
  public createPaymentUrl(orderId: string, amount: number, ipAddress: string): string {
    const date = new Date();
    const createDate = this.formatDate(date);

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId, // Attach your order ID here
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay requires amount multiplied by 100 (e.g., 100,000 VND -> 10000000)
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddress || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Required to sort parameters alphabetically before encryption
    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });

    // Create security signature
    const hmac = crypto.createHmac('sha512', this.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Add signature to the end
    vnp_Params['vnp_SecureHash'] = signed;

    // Append parameters to VNPay URL and return
    return this.vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
  }

  // 2. VERIFY SIGNATURE FROM VNPAY (Prevent hackers from modifying the link)
  public verifyIpnSignature(vnp_Params: any): boolean {
    const secureHash = vnp_Params['vnp_SecureHash'];
    // Remove signature from parameters to recalculate
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed; // If recalculated matches VNPay's hash -> Safe!
  }

  // VNPay helper function
  private sortObject(obj: any): any {
    const sorted: any = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const HH = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }
}
