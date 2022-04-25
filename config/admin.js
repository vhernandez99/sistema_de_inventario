module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'e0dfb9fc8304a3550b88fb538f0123bd'),
  },
});
