export type Config = {
  isDevMode: boolean;
  enableCompare: boolean;
  enableCheckType: boolean;
  roomOption: RoomOption;
};

export type RoomOption = {
  marquee: {
    isVisible: boolean;
  };
  gift: {
    isVisible: boolean;
  };
  messageList: {
    isVisibleGift: boolean;
  };
};
