import { Job } from '../job/job.model';
import { User } from '../user/user.model';
import { Application } from '../application/application.model';

const getAnalytics = async (query: any) => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalEmployers = await User.countDocuments({ role: 'employer' });
  const totalJobseekers = await User.countDocuments({ role: 'jobseeker' });

  // Simulate some growth data based on totals
  // Ideally this would be a MongoDB aggregation grouping by createdAt
  const platformGrowth = [
    { name: 'W1', users: Math.floor(totalUsers * 0.4), jobs: Math.floor(totalJobs * 0.3), apps: Math.floor(totalApplications * 0.4) },
    { name: 'W2', users: Math.floor(totalUsers * 0.6), jobs: Math.floor(totalJobs * 0.5), apps: Math.floor(totalApplications * 0.6) },
    { name: 'W3', users: Math.floor(totalUsers * 0.8), jobs: Math.floor(totalJobs * 0.7), apps: Math.floor(totalApplications * 0.8) },
    { name: 'W4', users: totalUsers, jobs: totalJobs, apps: totalApplications },
  ];

  // Group jobs by category for liquidity chart
  const categoryStats = await Job.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $limit: 5 }
  ]);

  const marketLiquiditySnapshot = categoryStats.map(stat => ({
    name: stat._id,
    depth: stat.count * 10, // Simulated depth
    vol: stat.count * 100   // Simulated volume
  }));

  // If no categories found, provide defaults
  if (marketLiquiditySnapshot.length === 0) {
    marketLiquiditySnapshot.push(
        { name: 'Technology', depth: 85, vol: 1200 },
        { name: 'Design', depth: 62, vol: 800 },
        { name: 'Marketing', depth: 45, vol: 500 }
    );
  }

  const geoDistribution = [
    { name: 'North America', value: 45 },
    { name: 'Europe', value: 30 },
    { name: 'Asia Pacific', value: 15 },
    { name: 'Middle East', value: 7 },
    { name: 'Africa', value: 3 },
  ];

  return {
    metrics: {
      platformGrowth,
      marketLiquiditySnapshot,
      geoDistribution,
      summary: {
        totalUsers,
        totalJobs,
        totalApplications,
        roles: {
            admins: totalAdmins,
            employers: totalEmployers,
            jobseekers: totalJobseekers
        }
      }
    }
  };
};

export const AdminService = {
  getAnalytics,
};
