const activityService = require("../services/activity.service");

exports.viewListing = async (req, res) => {
  const { listingId } = req.body;
  const userId = req.user._id;

  const score = await activityService.trackView(userId, listingId);

  res.json({ success: true, score });
};

exports.timeSpent = async (req, res) => {
  const { listingId, duration } = req.body;
  const userId = req.user._id;

  const score = await activityService.trackTime(userId, listingId, duration);

  res.json({ success: true, score });
};

exports.interact = async (req, res) => {
  const { listingId, type } = req.body;
  const userId = req.user._id;

  const score = await activityService.trackInteraction(userId, listingId, type);

  res.json({ success: true, score });
};