/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Gift, GiftService, GiftServiceListener } from './types';

export class GiftServiceImpl implements GiftService {
  addListener(listener: GiftServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(listener: GiftServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
  sendGift(gift: Gift): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
