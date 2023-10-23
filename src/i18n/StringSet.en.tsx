import type { StringSet } from './types';

export function createStringSetEn(): StringSet {
  return {
    'this is test.': 'this is test.',
    'This is test with ${0} and ${1}': (a: string, b: number) => {
      return `This is test with ${a} and ${b}`;
    },

    'Private Chat': 'Private Chat',
    'Translate': 'Translate',
    'Delete': 'Delete',
    'Mute': 'Mute',
    'Unmute': 'Unmute',
    'Report': 'Report',
    'Cancel': 'Cancel',
    'Remove': 'Remove',

    'Participants': 'Participants',
    'Muted': 'Muted',

    'Search': 'Search',

    "Let's Chat!": "Let's Chat!",

    'Send': 'Send',

    'self': 'self',

    'delete_button_click_popups_title': 'Delete Message',
    'delete_button_click_popups_content':
      'The message will be deleted and cannot been seen by others.',
    'delete_button_click_popups_button_cancel': 'Cancel',
    'delete_button_click_popups_button_confirm': 'Confirm',

    'mute_button_click_popups_title': 'Mute Participant',
    'mute_button_click_popups_content':
      'The participant will be muted and cannot send messages.',
    'mute_button_click_popups_button_cancel': 'Cancel',
    'mute_button_click_popups_button_confirm': 'Confirm',

    'report_button_click_menu_title': 'Report',
    'report_button_click_menu_subtitle_message': 'Report Message',
    'report_button_click_menu_subtitle_violation': 'Violation',
    'report_button_click_menu_subtitle_description': 'Description (Optional)',
    'report_button_click_menu_button_cancel': 'Cancel',
    'report_button_click_menu_button_report': 'Report',

    'violation_reason_1': 'Unwelcome commercial content or spam',
    'violation_reason_2': 'Pornographic or explicit content',
    'violation_reason_3': 'Child abuse',
    'violation_reason_4': 'Hate speech or graphic violence',
    'violation_reason_5': 'Promote terrorism',
    'violation_reason_6': 'Harassment or bullying',
    'violation_reason_7': 'Suicide or self harm',
    'violation_reason_8': 'False information',
    'violation_reason_9': 'Others',

    'participant_list_title': 'Participants',
    'participant_list_button_click_menu_privatechat': 'Private Chat',
    'participant_list_button_click_menu_mute': 'Mute',
    'participant_list_button_click_menu_remove': 'Remove',
    'participant_list_button_click_menu_cancel': 'Cancel',

    'remove_button_click_popups_title': 'Remove Participant',
    'remove_button_click_popups_content':
      'The participant will be removed from this chatroom.',
    'remove_button_click_popups_button_cancel': 'Cancel',
    'remove_button_click_popups_button_confirm': 'Confirm',

    'keyboard_toolbar_button_send': 'Send',

    'gift_menu_title': 'Gift',

    'gift_barrage_subtitle': "sent '@gift_name'",

    'global_broadcast_barrage_announcement':
      "'@broadcaster' made an announcement",
    'global_broadcast_barrage_gifting':
      "'@username' gifts '@username' with a '@gift_name'",
  };
}
