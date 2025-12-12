/**
 * Z-Index Scale
 * Standardized layering system to prevent overlap conflicts
 * 
 * Usage:
 * import { Z_INDEX } from '@/tokens/z-index';
 * <div style={{ zIndex: Z_INDEX.MODAL }}>
 */

export const Z_INDEX = {
    BASE: 0,
    DROPDOWN: 10,
    STICKY_HEADER: 40,
    FIXED_UI: 40,           // Header, BottomNav
    OVERLAY_BACKDROP: 50,   // Modal backdrops
    OVERLAY_CONTENT: 51,    // Modal content
    DRAWER: 52,             // Slide-out panels
    TOAST: 60,              // Notifications
    TOOLTIP: 70,            // Contextual tips
    POPOVER: 80,            // Dropdown popovers
    CRITICAL_MODAL: 90,     // Confirmation dialogs
    SIGNATURE_CANVAS: 100,  // Always on top
} as const;

export type ZIndexToken = typeof Z_INDEX[keyof typeof Z_INDEX];
