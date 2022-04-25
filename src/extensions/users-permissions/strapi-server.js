const utils = require("@strapi/utils");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const userService = require("@strapi/plugin-users-permissions/server/services/user");
const auth = require("@strapi/plugin-users-permissions/server/controllers/auth");

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;

  return utils.sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = (plugin) => {
  plugin.services.user = ({ strapi }) => {
    return {
      ...userService({ strapi }),
      fetchAuthenticatedUser: (id) => {
        return strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { id }, populate: ["role"] });
      },
    };
  };

  plugin.controllers.user.find = async (ctx) => {
    const users = await getService("user").fetchAll(
      ctx.query.filters,
      ctx.query.populate
    );
    ctx.body = await Promise.all(
      users.map(async (user) => {
        const sanitized = await sanitizeOutput(user, ctx);
        return {
          ...sanitized,
          role: user.role,
        };
      })
    );
  };

  plugin.controllers.user.findOne = async (ctx) => {
    const { id } = ctx.params;
    let data = await getService("user").fetch({ id }, ctx.query.populate);

    if (data) {
      const sanitized = await sanitizeOutput(data, ctx);
      data = { ...sanitized, role: data.role };
    }

    ctx.body = data;
  };

  plugin.controllers.auth.callback = async (ctx) => {
    await auth.callback(ctx);
    if (ctx.body.user) {
      const id = ctx.body.user.id;
      const user = await getService("user").fetch({ id }, ["role"]);
      ctx.body = {
        ...ctx.body,
        user: {
          ...ctx.body.user,
          role: user.role,
        },
      };
    }
  };

  plugin.controllers.auth.register = async (ctx) => {
    // Copy email to username
    ctx.request.body.username = ctx.request.body.email;
    await auth.register(ctx);
    if (ctx.state.user && ctx.request.body.role) {
      // Update role
      await strapi.db.query("plugin::users-permissions.user").update({
        where: { email: ctx.request.body.email },
        data: {
          role: ctx.request.body.role,
        },
      });

      const user = await getService("user").fetch({ id: ctx.body.user.id }, [
        "role",
      ]);
      ctx.body = {
        ...ctx.body,
        user: {
          ...ctx.body.user,
          role: user.role,
        },
      };
    }
  };

  return plugin;
};
