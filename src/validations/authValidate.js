import Joi from "joi";

const authValidate = (auth) => {
  console.log(auth);
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
      .required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    repeat_password: Joi.ref("password"),
  });

  return schema.validate(auth);
};

module.exports = authValidate;
