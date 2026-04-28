const User = require('../user');
const { buildProgressPayload } = require('./progressUtils.js');

const slugifyName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')
  .replace(/^\d+/, '')
  .slice(0, 12) || 'coder';

const generateUniqueUsername = async (name, email) => {
  const emailPrefix = email.split('@')[0] || '';
  const base = slugifyName(name) || slugifyName(emailPrefix);
  let candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const buildUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  profile: user.profile,
  progressSummary: buildProgressPayload(user.progressHistory).stats,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  token,
});

module.exports = {
  buildUserResponse,
  generateUniqueUsername,
};
