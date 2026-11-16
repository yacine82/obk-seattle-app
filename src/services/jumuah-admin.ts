
import {
    JUMUAH_CONFIG,
    isValidTime,
    type JumuahSchedule,
} from './jumuah-schedule';

/**
 * Admin approval and override data structures.
 *
 * IMPORTANT:
 * These functions only prepare schedule changes.
 * A secure backend must authenticate the admin,
 * authorize the action, and save the result.
 */

export interface AdminAction {
  adminId: string;
  timestamp: string;
}

function validateAdminAction(
  action: AdminAction
): void {
  if (!action.adminId.trim()) {
    throw new Error('Admin ID is required.');
  }

  if (
    !Number.isFinite(Date.parse(action.timestamp))
  ) {
    throw new Error('Valid action timestamp is required.');
  }
}

/**
 * Approve a pending website schedule.
 */
export function approveJumuahSchedule(
  schedule: JumuahSchedule,
  action: AdminAction
): JumuahSchedule {
  validateAdminAction(action);

  if (schedule.status !== 'pending') {
    throw new Error(
      'Only pending schedules can be approved.'
    );
  }

  return {
    ...schedule,
    status: 'approved',
    approvedBy: action.adminId,
    approvedAt: action.timestamp,
  };
}

/**
 * Reject a pending website schedule.
 */
export function rejectJumuahSchedule(
  schedule: JumuahSchedule,
  action: AdminAction
): JumuahSchedule {
  validateAdminAction(action);

  if (schedule.status !== 'pending') {
    throw new Error(
      'Only pending schedules can be rejected.'
    );
  }

  return {
    ...schedule,
    status: 'rejected',
    approvedBy: null,
    approvedAt: null,
  };
}

/**
 * Create an admin override with a corrected time.
 *
 * The override is represented as an approved
 * schedule, but it must only be saved after
 * the backend authorizes the administrator.
 */
export function createAdminOverride(
  khutbahTime: string,
  action: AdminAction
): JumuahSchedule {
  validateAdminAction(action);

  if (!isValidTime(khutbahTime)) {
    throw new Error(
      'Invalid Khutbah time. Use HH:mm.'
    );
  }

  return {
    id: `override-${action.timestamp}`,
    khutbahTime,
    timezone: JUMUAH_CONFIG.timezone,
    source: 'admin_override',
    sourceUrl: null,
    status: 'approved',
    observedAt: action.timestamp,
    approvedAt: action.timestamp,
    approvedBy: action.adminId,
    effectiveFrom: null,
    effectiveUntil: null,
  };
}
