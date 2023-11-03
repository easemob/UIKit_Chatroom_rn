export type GiftEffectModel = {
  /**
   * suggestion: seqId('_gf').toString()
   */
  id: string;
  avatar?: string;
  nickName: string;
  content: string;
  giftIcon: string;
  /**
   * Default string 1.
   */
  giftCount?: string;
};
export type GiftEffectTask = {
  model: GiftEffectModel;
};
