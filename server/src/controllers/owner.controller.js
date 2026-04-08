const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const redis = require("../config/redis");
const { calculateLeadScore, classifyLead } = require("../services/leadScore");

// ================= DASHBOARD =================
exports.getOwnerDashboard = async (req, res) => {
  try {
    const users = await User.find({}, "_id name").lean();
    const employees = await Employee.find({}, "_id name").lean();

    const pipeline = redis.pipeline();

    users.forEach((u) => {
      pipeline.hgetall(`user:analytics:${u._id}`);
    });

    employees.forEach((e) => {
      pipeline.get(`employee:session:${e._id}`);
    });

    const results = await pipeline.exec();

    const userResults = results.slice(0, users.length);
    const employeeResults = results.slice(users.length);

    let high = 0, medium = 0, low = 0;

    users.forEach((user, i) => {
      const data = userResults[i][1] || {};

      const timeSpent = Number(data.timeSpent || 0);
      const visits = Number(data.visits || 0);
      const interactions = Number(data.interactions || 0);

      const score = calculateLeadScore({
        timeSpent,
        visits,
        interactions,
      });

      if (score > 80) high++;
      else if (score > 40) medium++;
      else low++;
    });

    let activeEmployees = 0;

    employeeResults.forEach(([_, val]) => {
      if (val) activeEmployees++;
    });

    res.json({
      success: true,
      data: {
        users: {
          total: users.length,
          high,
          medium,
          low,
        },
        employees: {
          total: employees.length,
          active: activeEmployees,
        },
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};



// ================= USER INSIGHTS =================
exports.getUserInsights = async (req, res) => {
  try {
    const users = await User.find({}, "name phone email").lean();

    const pipeline = redis.pipeline();

    users.forEach((u) => {
      pipeline.hgetall(`user:analytics:${u._id}`);
    });

    const results = await pipeline.exec();

    const data = users.map((user, i) => {
      const analytics = results[i][1] || {};

      const visits = Number(analytics.visits || 0);
      const timeSpent = Number(analytics.timeSpent || 0);
      const interactions = Number(analytics.interactions || 0);

      const leadScore = calculateLeadScore({
        timeSpent,
        visits,
        interactions,
      });

      return {
        name: user.name,
        phone: user.phone,
        email: user.email,

        visits,
        timeSpent,
        interactions,

        avgTimePerVisit: visits ? (timeSpent / visits).toFixed(2) : 0,

        leadScore,
        category: classifyLead(leadScore),
      };
    });

    // 🔥 Sort by best leads
    data.sort((a, b) => b.leadScore - a.leadScore);

    res.json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};



// ================= EMPLOYEE INSIGHTS =================
exports.getEmployeeInsights = async (req, res) => {
  try {
    const employees = await Employee.find({}, "name phone").lean();

    const pipeline = redis.pipeline();

    employees.forEach((emp) => {
      pipeline.get(`employee:session:${emp._id}`);
    });

    const results = await pipeline.exec();

    const data = employees.map((emp, i) => {
      const active = !!results[i][1];

      return {
        name: emp.name,
        phone: emp.phone,
        active,
        status: active ? "Online" : "Offline",
      };
    });

    res.json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};