const { getLeadsService } = require("../services/employee.service");

exports.getLeads = async (req, res) => {
  try {
    const leads = await getLeadsService();

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};