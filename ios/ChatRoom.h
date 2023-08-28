
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNChatRoomSpec.h"

@interface ChatRoom : NSObject <NativeChatRoomSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ChatRoom : NSObject <RCTBridgeModule>
#endif

@end
