
import {
    createWebsiteCandidate,
    getReminderTime,
} from './jumuah-schedule';

import {
    approveJumuahSchedule,
    createAdminOverride,
    rejectJumuahSchedule,
} from './jumuah-admin';

// Create a sample website schedule.
// This is test data, not an actual admin approval.
const websiteSchedule = createWebsiteCandidate(
  '12:30',
  new Date().toISOString()
);

// Simulated administrator identity for testing only.
const testAdmin = {
  adminId: 'test-admin',
  timestamp: new Date().toISOString(),
};

// TEST 1: Approve the website time.
const approved = approveJumuahSchedule(
  websiteSchedule,
  testAdmin
);

console.log('TEST 1: APPROVAL');
console.log('Khutbah:', approved.khutbahTime);
console.log('Status:', approved.status);
console.log('Approved by:', approved.approvedBy);
console.log(
  'Reminder:',
  getReminderTime(approved.khutbahTime)
);

// TEST 2: Reject the website time.
const rejected = rejectJumuahSchedule(
  websiteSchedule,
  testAdmin
);

console.log('\nTEST 2: REJECTION');
console.log('Khutbah:', rejected.khutbahTime);
console.log('Status:', rejected.status);

// TEST 3: Override the website time.
const override = createAdminOverride(
  '13:00',
  testAdmin
);

console.log('\nTEST 3: ADMIN OVERRIDE');
console.log('Khutbah:', override.khutbahTime);
console.log('Status:', override.status);
console.log('Source:', override.source);
console.log(
  'Reminder:',
  getReminderTime(override.khutbahTime)
);

console.log('\nAll three test scenarios completed.');
