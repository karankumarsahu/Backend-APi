import cron from 'node-cron';
import fundTransferModel from '../models/fundTransfer.model.js';

const processPendingTransfers = async () => {
  try {
    const pendingTransfers = await fundTransferModel.find({ status: 'pending' });

    for (const transfer of pendingTransfers) {
      console.log(`Processing fund transfer for ${transfer.phoneNumber}`);

      transfer.status = 'completed';
      await transfer.save();
    }

    console.log('Pending fund transfers processed successfully');
  } catch (error) {
    console.error('Error processing pending fund transfers:', error);
  }
};

cron.schedule('0 * * * *', () => {
  console.log('Running cron job for pending fund transfers');
  processPendingTransfers();
});
