import { unmute } from "../utils/unmute";

let unmuteHandle = null;

export function initializeUnmute(
  context,
  allowBackgroundPlayback = false,
  forceIOSBehavior = false
) {
  if (context && !unmuteHandle) {
    unmuteHandle = unmute(context, allowBackgroundPlayback, forceIOSBehavior);
  }
  return unmuteHandle;
}

export function disposeUnmute() {
  if (unmuteHandle) {
    unmuteHandle.dispose();
    unmuteHandle = null;
  }
}
