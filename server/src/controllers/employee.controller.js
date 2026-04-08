const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/employee.model");

const { getLeadsService } = require("../services/employee.service");

exports.getLeads = async (req, res) => {
    if (req.userType !== "employee") {
        return res.status(403).json({ message: "Forbidden" });
    }
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



exports.createEmployee = async (req, res) => {
    
    if (req.userType !== "user" || req.user.role !== "owner") {
        return res.status(403).json({ message: "Only owner can create employee" });
    }

    try {
        const { name, phone, email, password } = req.body;

        const exists = await Employee.findOne({
        $or: [{ phone }, { email }],
        });

        if (exists) {
        return res.status(400).json({
            success: false,
            message: "Employee already exists",
        });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
        name,
        phone,
        email,
        password: hashedPassword,
        role: "employee",
        assignedBy: req.user._id,
        });

        res.status(201).json({
        success: true,
        message: "Employee created",
        data: employee,
        });

    } catch (err) {
        res.status(500).json({
        success: false,
        message: "Error creating employee",
        });
    }
};



exports.employeeLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const employee = await Employee.findOne({ phone });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        role: "employee",
        type: "employee", // 🔥 IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      employee,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};