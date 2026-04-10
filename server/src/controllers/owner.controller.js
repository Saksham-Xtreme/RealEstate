const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const redis = require("../config/redis");
const { calculateLeadScore, classifyLead } = require("../services/leadScore");
const bcrypt = require("bcryptjs");
// ================= DASHBOARD =================
exports.getOwnerDashboard = async (req, res) => {
    try {
      const users = await User.find({ role: "user" }, "_id name assignedTo").lean();
      const employees = await Employee.find({}, "_id name email").lean();
  
      const pipeline = redis.pipeline();
  
      // user analytics
      users.forEach(u => {
        pipeline.hgetall(`user:analytics:${u._id}`);
      });
  
      // employee sessions
      employees.forEach(e => {
        pipeline.get(`employee:session:${e._id}`);
      });
  
      const results = await pipeline.exec();
  
      const userResults = results.slice(0, users.length);
      const employeeResults = results.slice(users.length);
  
      // ------------------------
      // 🔥 LEAD SCORING
      // ------------------------
      let high = 0, medium = 0, low = 0;
  
      const enrichedUsers = users.map((user, i) => {
        const data = userResults[i][1] || {};
  
        const score = calculateLeadScore({
          timeSpent: Number(data.timeSpent || 0),
          visits: Number(data.visits || 0),
          interactions: Number(data.interactions || 0),
        });
  
        const category = classifyLead(score);
  
        if (category === "HIGH") high++;
        else if (category === "MEDIUM") medium++;
        else low++;
  
        return {
          ...user,
          score,
          category,
        };
      });
  
      // ------------------------
      // 🔥 EMPLOYEE PERFORMANCE
      // ------------------------
  
      const leadCountMap = {};
  
      enrichedUsers.forEach(u => {
        if (u.assignedTo) {
          const key = u.assignedTo.toString();
          leadCountMap[key] = (leadCountMap[key] || 0) + 1;
        }
      });
  
      const employeeData = employees.map((emp, i) => {
        const activeTime = Number(employeeResults[i][1] || 0);
        const leads = leadCountMap[emp._id.toString()] || 0;
  
        const performanceScore = (leads * 10) + activeTime;
  
        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          leads,
          activeTime,
          performanceScore,
          status: activeTime > 60 ? "Active" : "Idle",
        };
      });
  
      // sort best employees
      employeeData.sort((a, b) => b.performanceScore - a.performanceScore);
  
      // ------------------------
      // 🔥 TOP LEADS
      // ------------------------
  
      const topUsers = enrichedUsers
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(u => ({
          name: u.name,
          score: u.score,
          category: u.category,
        }));
  
      // ------------------------
      // RESPONSE
      // ------------------------
  
      res.json({
        success: true,
        data: {
          stats: {
            totalUsers: users.length,
            totalEmployees: employees.length,
            activeEmployees: employeeData.filter(e => e.status === "Active").length,
            highLeads: high,
            mediumLeads: medium,
            lowLeads: low,
          },
          employees: employeeData,
          topUsers,
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



exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // check existing
    const exists = await Employee.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      phone,
      assignedBy: req.user._id, // owner id
    });

    res.json({
      success: true,
      data: employee,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};