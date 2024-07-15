const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, enum: ['like', 'share'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const Engagement = mongoose.model('Engagement', engagementSchema);

app.post('/engage', async (req, res) => {
  const { postId, userId, action } = req.body;
  const engagement = new Engagement({ postId, userId, action });
  await engagement.save();
  res.status(200).send({ message: 'Engagement recorded' });
});

const calculateRewards = async () => {
  const engagements = await Engagement.aggregate([
    { $group: { _id: '$userId', likes: { $sum: { $cond: [{ $eq: ['$action', 'like'] }, 1, 0] } }, shares: { $sum: { $cond: [{ $eq: ['$action', 'share'] }, 1, 0] } } } },
    { $project: { userId: '$_id', totalEngagements: { $add: ['$likes', '$shares'] } } },
  ]);
  
  engagements.forEach(async (engagement) => {
    if (engagement.totalEngagements > 10) {
      // Issue a coupon
      const coupon = new Coupon({ userId: engagement.userId, discount: '10%' });
      await coupon.save();
    }
  });
};

app.get('/rewards', async (req, res) => {
  await calculateRewards();
  res.status(200).send({ message: 'Rewards calculated' });
});
