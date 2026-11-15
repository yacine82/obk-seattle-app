
import {
    fetchJumuahCandidate,
} from './jumuah-sync';

import {
    getReminderTime,
} from './jumuah-schedule';

async function testLiveWebsite() {
  console.log('Connecting to OBK Seattle website...');

  try {
    const candidate = await fetchJumuahCandidate();

    console.log('Website connection: Successful');
    console.log('Khutbah time:', candidate.khutbahTime);
    console.log('Source:', candidate.sourceUrl);
    console.log('Verification status:', candidate.status);

    console.log(
      'Reminder time:',
      getReminderTime(candidate.khutbahTime)
    );

    console.log(
      'IMPORTANT: This schedule is not admin-approved.'
    );
  } catch (error) {
    console.error('Website synchronization test failed.');

    if (error instanceof Error) {
      console.error('Reason:', error.message);
    }
  }
}

testLiveWebsite();
