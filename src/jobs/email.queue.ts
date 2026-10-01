import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

// 1. CREATE THE QUEUE (To push jobs into)
export const emailQueue = new Queue('EmailQueue', {
  connection: redisConnection,
});

// 2. CREATE THE WORKER (To process jobs from the queue)
export const emailWorker = new Worker(
  'EmailQueue',
  async (job: Job) => {
    // In a real production app, you would use Nodemailer or SendGrid here.
    // For now, we simulate the email sending process with a 2-second delay.
    console.log(`\n📧 [EmailWorker] Processing job ${job.id}...`);
    console.log(`📧 [EmailWorker] Sending email to: ${job.data.to}`);
    console.log(`📧 [EmailWorker] Subject: ${job.data.subject}`);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`✅ [EmailWorker] Email sent successfully to ${job.data.to}!\n`);
  },
  { connection: redisConnection },
);

// Event listeners for debugging & monitoring
emailWorker.on('completed', (job) => {
  console.log(`[EmailQueue] Job ${job.id} has been completed.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`[EmailQueue] Job ${job?.id} failed with error: ${err.message}`);
});
