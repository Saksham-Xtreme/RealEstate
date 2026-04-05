const axios = require("axios");
const redis = require("../config/redis");

const baseURL = "https://cpaas.messagecentral.com";

// 🔧 Normalize phone
const normalizePhone = (phone) => {
  const cleanPhone = String(phone).replace(/\D/g, "");

  if (cleanPhone.length !== 10) {
    throw new Error("Invalid phone number format");
  }

  return cleanPhone;
};

// 🔐 GET TOKEN (cached)
const getAuthToken = async () => {
  let token = await redis.get("mc:auth_token");
  if (token) return token;

  const base64String = Buffer.from(process.env.MC_PASSWORD).toString("base64");

  const res = await axios.get(`${baseURL}/auth/v1/authentication/token`, {
    params: {
      country: "IN",
      customerId: process.env.MC_CUSTOMER_ID,
      email: process.env.MC_EMAIL,
      key: base64String,
      scope: "NEW"
    }
  });

  token = res.data.token;

  await redis.set("mc:auth_token", token, "EX", 3600);

  return token;
};

// 📲 SEND OTP
exports.sendOtpService = async (phone) => {
  const cleanPhone = normalizePhone(phone);

  const authToken = await getAuthToken();

  const res = await axios.post(
    `${baseURL}/verification/v3/send`,
    null,
    {
      params: {
        countryCode: "91",
        customerId: process.env.MC_CUSTOMER_ID,
        flowType: "SMS",
        mobileNumber: cleanPhone
      },
      headers: {
        authToken
      }
    }
  );

  const verificationId = res.data?.data?.verificationId;

  if (!verificationId) {
    throw new Error("verificationId missing from response");
  }

  await redis.set(`otp:${cleanPhone}`, verificationId, "EX", 300);

  return { success: true };
};

// 🔐 VERIFY OTP
exports.verifyOtpService = async (phone, otp) => {
  const cleanPhone = normalizePhone(phone);

  const verificationId = await redis.get(`otp:${cleanPhone}`);

  if (!verificationId) {
    throw new Error("OTP expired or invalid");
  }

  const authToken = await getAuthToken();

  const res = await axios.get(
    `${baseURL}/verification/v3/validateOtp`,
    {
      params: {
        countryCode: "91",
        mobileNumber: cleanPhone,
        verificationId,
        customerId: process.env.MC_CUSTOMER_ID,
        code: otp
      },
      headers: {
        authToken
      }
    }
  );

  await redis.del(`otp:${cleanPhone}`);

  return res.data;
};