/**
 * Config types
 */
export type Config = {
  /**
   * Whether to enable the development mode.
   */
  isDevMode: boolean;
  /**
   * Whether to enable the debug mode.
   */
  enableCompare: boolean;
  /**
   * Whether to enable the type check.
   */
  enableCheckType: boolean;
  /**
   * Room option.
   */
  roomOption: RoomOption;
};
/**
 * Room option types
 */
export type RoomOption = {
  /**
   * Marquee option.
   */
  marquee: {
    /**
     * Whether to load.
     */
    isVisible: boolean;
  };
  /**
   * Gift option.
   */
  gift: {
    /**
     * Whether to load.
     */
    isVisible: boolean;
  };
  /**
   * Message list option.
   */
  messageList: {
    /**
     * Whether to load for gift message.
     */
    isVisibleGift: boolean;
    /**
     * Whether to load for timestamp.
     */
    isVisibleTime: boolean;
    /**
     * Whether to load for Tag.
     */
    isVisibleTag: boolean;
    /**
     * Whether to load for Avatar.
     */
    isVisibleAvatar: boolean;
  };
};
