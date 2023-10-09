export type GiftFloatingModel = {
  /**
   * suggestion: seqId('_gf').toString()
   */
  id: string;
  avatar?: string;
  nickName: string;
  content: string;
  giftIcon: string;
  /**
   * Default number 1.
   */
  giftCount?: number;
};
export type GiftFloatingTask = {
  model: GiftFloatingModel;
};
