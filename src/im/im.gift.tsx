import type { Gift, GiftService, GiftServiceListener } from './types';

export class GiftServiceImpl implements GiftService {
  addListener(_listener: GiftServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(_listener: GiftServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
  sendGift(_gift: Gift): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
