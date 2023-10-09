export type MarqueeModel = {
  /**
   * suggestion: seqId('_mq').toString()
   */
  id: string;
  content: string;
};
export type MarqueeTask = {
  model: MarqueeModel;
};
