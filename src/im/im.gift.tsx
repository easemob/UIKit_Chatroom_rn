import type {
  GiftService,
  GiftServiceData,
  GiftServiceListener,
} from './types';

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
  sendGift(_gift: GiftServiceData): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
