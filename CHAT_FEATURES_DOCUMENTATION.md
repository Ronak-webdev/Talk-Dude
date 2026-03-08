# Advanced Chat Features Implementation Guide

## Overview
This document describes the advanced chat features implemented in TalkDude, including message deletion, reply functionality, and one-time view images.

---

## 1. Message Delete Functionality ✅

### Features:
- **Delete for Me**: Removes message only from your view
- **Delete for Everyone**: Removes message from all users' chats

### How It Works:

#### On PC/Desktop:
1. **Right-click** on any message
2. Context menu appears with options:
   - 🗑️ **Delete for Me** (Trash icon)
   - 🗑️ **Delete for Everyone** (Double trash icon)
3. Click your preferred option

#### On Mobile/Tablet:
1. **Long press** (press and hold for 500ms) on any message
2. Context menu appears centered on screen
3. Tap your preferred delete option

### Visual Feedback:
- Deleted messages show: *"This message was deleted"* in italic style
- Toast notifications confirm deletion
- Smooth animations

### Technical Details:
- Uses `deleteMessage()` API function
- Tracks deleted messages in component state
- Prevents re-rendering of deleted content

---

## 2. Reply to Message Feature ✅

### Features:
- Reply to specific messages
- Preview of original message above input
- Click preview to scroll to original message

### How It Works:

#### On PC/Desktop:
1. **Right-click** on a message
2. Click **Reply** option (Reply icon)
3. Reply preview appears above input field
4. Type your reply and send

#### On Mobile/Tablet:
1. **Swipe left or right** on a message
   - Swipe left → Quick reply
   - Swipe right → Quick reaction (future feature)
2. Or use long press → Reply option
3. Reply preview appears
4. Type and send

### Visual Feedback:
- Blue vertical line indicates replying context
- Shows original sender name and message preview
- Cancel button to dismiss reply
- Smooth slide-in animation

### Technical Details:
- Uses `replyToMessage()` API function
- ReplyPreview component shows context
- MessageInput handles reply state

---

## 3. One-Time View Photo/Image Sharing ✅

### Features:
- Send photos that can be viewed only once
- Auto-disappears after viewing
- Screenshot detection and notification
- 10-second auto-close timer

### How It Works:

#### Sending One-Time View Image:
1. Click attachment button (Plus icon)
2. Select image
3. Choose "One-Time View" option
4. Send - image appears as special card

#### Receiving One-Time View Image:
1. See special card with "VIEW ONCE" badge
2. Click card to open image
3. Image opens in full-screen mode
4. Auto-closes after 10 seconds OR click to close
5. After viewing, image disappears from chat

### Security Features:
- **Screenshot Detection**:
  - Detects PrintScreen key press
  - Monitors visibility changes during viewing
  - Sends alert to sender if screenshot attempted
  - Shows error toast to receiver

- **Prevents**:
  - Right-click on image
  - Drag and save
  - Keyboard shortcuts
  - Screen capture attempts

### Visual Feedback:
- Special gradient card before viewing
- Full-screen immersive viewing mode
- Timer indicator at bottom
- Purple accent colors for one-time content

### Technical Details:
- OneTimeImageView component
- Visibility API monitoring
- BeforeUnload handler
- Custom context menu prevention
- State tracking for viewed images

---

## 4. Device Compatibility ✅

### PC/Desktop Features:
- **Right-click context menus** on messages
- Hover effects and transitions
- Larger touch targets
- Enhanced visual feedback
- Keyboard shortcuts (PrintScreen detection)

### Mobile/Tablet Features:
- **Long press** gestures (500ms delay)
- **Swipe gestures** for quick actions
- Centered context menus
- Touch-optimized spacing
- Responsive layouts

### Adaptive UI:
- Context menu position adapts to screen size
- Touch targets sized appropriately
- Animations optimized for device type
- Consistent experience across platforms

---

## Component Structure

### New Components Created:

1. **MessageContextMenu.jsx**
   - Handles context menu display
   - Delete/Reply/View Once options
   - Position calculation
   - Click-outside-to-close

2. **OneTimeImageView.jsx**
   - One-time view card UI
   - Full-screen viewer
   - Screenshot detection
   - Auto-close timer

3. **ReplyPreview.jsx**
   - Shows reply context
   - Original message preview
   - Cancel reply option

4. **Hooks Created:**
   - `useLongPress.js` - Long press detection
   - `useSwipeGesture.js` - Swipe gesture handling

### Modified Components:

1. **CustomMessageList.jsx**
   - Integrated context menu
   - Added delete functionality
   - One-time image support
   - Gesture handlers

2. **CustomMessageInput.jsx**
   - Reply preview integration
   - Reply state management
   - Enhanced send functionality

3. **api.js**
   - `deleteMessage()` function
   - `replyToMessage()` function

---

## API Endpoints Required

### Backend endpoints needed:

```javascript
// Delete message
DELETE /chat/messages/:messageId?deleteType=me|everyone

// Reply to message
POST /chat/messages/:messageId/reply

// Mark one-time image as viewed
POST /chat/images/:imageId/viewed
```

---

## Usage Examples

### Deleting a Message:
```javascript
// PC: Right-click → Delete for Me
// Mobile: Long press → Delete for Me

await deleteMessage(messageId, 'me');
// Message marked as deleted in local state
```

### Replying to a Message:
```javascript
// PC: Right-click → Reply
// Mobile: Swipe left → Reply

const replyData = {
  text: "Your reply here",
  parentId: originalMessageId
};
await replyToMessage(originalMessageId, replyData);
```

### Sending One-Time View Image:
```javascript
// When attaching image, mark as one-time:
const attachment = {
  type: 'image',
  image_url: imageUrl,
  oneTimeView: true // Special flag
};
```

---

## Future Enhancements

1. **Message Reactions**
   - Emoji reactions on messages
   - Quick reactions via swipe

2. **Edit Messages**
   - Edit own messages
   - Show "edited" indicator

3. **Forward Messages**
   - Forward to other chats
   - Multi-forward support

4. **Star/Save Messages**
   - Bookmark important messages
   - Starred messages section

5. **Enhanced One-Time View**
   - Blurhash preview
   - Countdown timer visible
   - Network status handling

---

## Testing Checklist

### PC/Desktop:
- [ ] Right-click context menu works
- [ ] Delete for Me hides message
- [ ] Delete for Everyone shows deleted text
- [ ] Reply preview appears
- [ ] One-time view image opens/closes
- [ ] Screenshot detection triggers

### Mobile/Tablet:
- [ ] Long press shows context menu
- [ ] Swipe left activates reply
- [ ] Touch targets are accessible
- [ ] Context menu centered properly
- [ ] One-time view works on mobile
- [ ] All animations smooth

### Cross-Platform:
- [ ] Deletions sync across devices
- [ ] Replies show correctly
- [ ] Images disappear after viewing
- [ ] No console errors
- [ ] Toast notifications work

---

## Known Limitations

1. **Screenshot Detection**: Cannot fully prevent screenshots, only detect common methods
2. **Network Dependency**: Requires active connection for real-time updates
3. **Browser Support**: Some gestures may not work on older browsers

---

## Troubleshooting

### Context Menu Not Appearing:
- Check if event listeners are attached
- Verify z-index is sufficient
- Ensure message has valid ID

### Delete Not Working:
- Verify API endpoint exists
- Check authentication token
- Ensure message ownership validation

### One-Time View Issues:
- Check image URL accessibility
- Verify state management
- Ensure proper cleanup on view

---

## Performance Considerations

- Deleted messages tracked in Set (O(1) lookup)
- Context menu rendered once, positioned dynamically
- Gesture handlers use refs to avoid re-renders
- One-time images removed from DOM after viewing

---

## Security Notes

- Always validate delete permissions on backend
- Never expose one-time image URL after viewing
- Implement rate limiting on delete endpoints
- Log suspicious activity patterns

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
**Author**: TalkDude Development Team
